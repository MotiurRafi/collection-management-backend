const { Op } = require('sequelize');
const db = require('../models');

exports.createItem = async (req, res) => {
  const { collectionId, name, tags, customFieldValues } = req.body;
  try {
    const collection = await db.Collection.findByPk(collectionId);
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    if (collection.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const itemData = {
      name,
      collectionId,
    };

    if (customFieldValues) {
      if (collection.integer_field1_state) itemData.integer_field1_value = customFieldValues.ifv1;
      if (collection.integer_field2_state) itemData.integer_field2_value = customFieldValues.ifv2;
      if (collection.integer_field3_state) itemData.integer_field3_value = customFieldValues.ifv3;

      if (collection.string_field1_state) itemData.string_field1_value = customFieldValues.sfv1;
      if (collection.string_field2_state) itemData.string_field2_value = customFieldValues.sfv2;
      if (collection.string_field3_state) itemData.string_field3_value = customFieldValues.sfv3;

      if (collection.multiline_text_field1_state) itemData.multiline_text_field1_value = customFieldValues.mlfv1;
      if (collection.multiline_text_field2_state) itemData.multiline_text_field2_value = customFieldValues.mlfv2;
      if (collection.multiline_text_field3_state) itemData.multiline_text_field3_value = customFieldValues.mlfv3;

      if (collection.checkbox_field1_state) itemData.checkbox_field1_value = customFieldValues.cfv1;
      if (collection.checkbox_field2_state) itemData.checkbox_field2_value = customFieldValues.cfv2;
      if (collection.checkbox_field3_state) itemData.checkbox_field3_value = customFieldValues.cfv3;

      if (collection.date_field1_state) itemData.date_field1_value = customFieldValues.dfv1;
      if (collection.date_field2_state) itemData.date_field2_value = customFieldValues.dfv2;
      if (collection.date_field3_state) itemData.date_field3_value = customFieldValues.dfv3;
    }

    const item = await db.Item.create(itemData);

    if (tags && Array.isArray(tags)) {
      const tagNames = tags.map(tag => tag.trim());
      const currentTags = await item.getTags();
      if (currentTags.length >= 80) {
        console.log("tags limit reached")
      } else {
        const existingTags = await db.Tag.findAll({ where: { name: { [Op.in]: tagNames } } });
        const newTagNames = tagNames.filter(tagName => !existingTags.map(tag => tag.name).includes(tagName));
        const availableSlots = 80 - currentTags.length;
        const tagsToAdd = newTagNames.slice(0, availableSlots);
        const newTags = await db.Tag.bulkCreate(tagsToAdd.map(tagName => ({ name: tagName })));
        await item.addTags([...existingTags, ...newTags]);
      }
    }

    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item" });
  }
};

exports.getItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await db.Item.findByPk(id, {
      include: {
        model: db.Tag,
        through: { attributes: [] }
      }
    });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

exports.getCollectionItems = async (req, res) => {
  const { collectionId } = req.params;
  try {
    const items = await db.Item.findAll({
      where: { collectionId },
      include: {
        model: db.Tag,
        through: { attributes: [] }
      }
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, tags, tagsToRemove, customFieldValues } = req.body;
  try {
    const item = await db.Item.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const collection = await db.Collection.findByPk(item.collectionId);

    if (collection.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (name !== undefined) item.name = name;

    if (tags && Array.isArray(tags)) {
      const tagNames = tags.map(tag => tag.trim());
      const currentTags = await item.getTags();
      if (currentTags.length >= 80) {
        console.log("tags limit reached")
      } else {
        const existingTags = await db.Tag.findAll({ where: { name: { [Op.in]: tagNames } } });
        const newTagNames = tagNames.filter(tagName => !existingTags.map(tag => tag.name).includes(tagName));
        const availableSlots = 80 - currentTags.length;
        const tagsToAdd = newTagNames.slice(0, availableSlots);
        const newTags = await db.Tag.bulkCreate(tagsToAdd.map(tagName => ({ name: tagName })));
        await item.addTags([...existingTags, ...newTags]);
      }
    }

    if (tagsToRemove && Array.isArray(tagsToRemove)) {
      const tagsToRemoveInstances = await db.Tag.findAll({ where: { name: { [Op.in]: tagsToRemove } } });
      await item.removeTags(tagsToRemoveInstances);
    }

    if (customFieldValues) {
      if (collection.integer_field1_state) item.integer_field1_value = customFieldValues.ifv1;
      if (collection.integer_field2_state) item.integer_field2_value = customFieldValues.ifv2;
      if (collection.integer_field3_state) item.integer_field3_value = customFieldValues.ifv3;

      if (collection.string_field1_state) item.string_field1_value = customFieldValues.sfv1;
      if (collection.string_field2_state) item.string_field2_value = customFieldValues.sfv2;
      if (collection.string_field3_state) item.string_field3_value = customFieldValues.sfv3;

      if (collection.multiline_text_field1_state) item.multiline_text_field1_value = customFieldValues.mlfv1;
      if (collection.multiline_text_field2_state) item.multiline_text_field2_value = customFieldValues.mlfv2;
      if (collection.multiline_text_field3_state) item.multiline_text_field3_value = customFieldValues.mlfv3;

      if (collection.checkbox_field1_state) item.checkbox_field1_value = customFieldValues.cfv1;
      if (collection.checkbox_field2_state) item.checkbox_field2_value = customFieldValues.cfv2;
      if (collection.checkbox_field3_state) item.checkbox_field3_value = customFieldValues.cfv3;

      if (collection.date_field1_state) item.date_field1_value = customFieldValues.dfv1;
      if (collection.date_field2_state) item.date_field2_value = customFieldValues.dfv2;
      if (collection.date_field3_state) item.date_field3_value = customFieldValues.dfv3;
    }

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await db.Item.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const collection = await db.Collection.findByPk(item.collectionId);

    if (collection.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.destroy();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
};
