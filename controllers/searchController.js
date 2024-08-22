const { Collection, Item, Tag, Comment, Sequelize, ItemTag } = require('../models');
const { Op } = require('sequelize');

const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const sanitizedQuery = query
      .replace(/'/g, "''") 
      .split(/\s+/) 
      .filter(word => word.length > 0) 
      .map(word => `${word}:*`) 
      .join(' & ');

    if (!sanitizedQuery) {
      return res.status(400).json({ error: 'Invalid query' });
    }

    const searchQuery = `(${sanitizedQuery})`;

    const collections = await Collection.findAll({
      where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`),
      attributes: ['id', 'name', 'category'],
    });

    const items = await Item.findAll({
      where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`),
      attributes: ['id', 'name', 'string_field1_value', 'string_field2_value', 'string_field3_value'],
    });

    const unfinishedTag = await Tag.findAll({
      where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`),
      attributes: ['id', 'name'],
    });
    const tags = await Promise.all(unfinishedTag.map(async (tag) => {
      const itemCount = await ItemTag.count({ where: { tagId: tag.id } });
      return {
        id: tag.id,
        name: tag.name,
        itemCount: itemCount
      };
    }));

    const comments = await Comment.findAll({
      where: Sequelize.literal(`"Comment".search_vector @@ to_tsquery('${searchQuery}')`),
      attributes: ['id', 'text', 'itemId'],
      include: [
        {
          model: Item,
          attributes: ['name']
        }
      ]
    });

    res.json({
      collections,
      items,
      tags,
      comments,
    });
  } catch (error) {
    console.error('Error while searching:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
};

module.exports = { search };
