const { Collection, Item, Tag, Comment, Sequelize } = require('../models');
const { Op } = require('sequelize');

const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const sanitizedQuery = query.replace(/'/g, "''");
    const searchQuery = `${sanitizedQuery}:*`;
    
    const collections = await Collection.findAll({
      where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`),
      attributes: ['id', 'name', 'category'],
    });

    const items = await Item.findAll({
      where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`),
      attributes: ['id', 'name', 'string_field1_value', 'string_field2_value', 'string_field3_value'],
    });

    const tags = await Tag.findAll({
      where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`),
      attributes: ['id', 'name'],
    });

    const comments = await Comment.findAll({
      where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`),
      attributes: ['id', 'text', 'itemId'],
    });

    res.json({
      collections,
      items,
      tags,
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
};

module.exports = { search };
