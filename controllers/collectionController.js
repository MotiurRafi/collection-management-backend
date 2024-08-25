const db = require('../models');

const setField = (dataObject, fieldName, fieldStateName, nameValue) => {
  if (nameValue !== undefined && nameValue !== '') { 
    dataObject[fieldName] = nameValue ;
    dataObject[fieldStateName] = true
  }else{
    dataObject[fieldStateName] = false
  }
};

const setCustomFields = (dataObject, customFields) => {
  setField(dataObject, 'integer_field1_name', 'integer_field1_state', customFields.ifn1);
  setField(dataObject, 'integer_field2_name', 'integer_field2_state', customFields.ifn2);
  setField(dataObject, 'integer_field3_name', 'integer_field3_state', customFields.ifn3);

  setField(dataObject, 'string_field1_name', 'string_field1_state', customFields.sfn1);
  setField(dataObject, 'string_field2_name', 'string_field2_state', customFields.sfn2);
  setField(dataObject, 'string_field3_name', 'string_field3_state', customFields.sfn3);

  setField(dataObject, 'multiline_text_field1_name', 'multiline_text_field1_state', customFields.mlfn1);
  setField(dataObject, 'multiline_text_field2_name', 'multiline_text_field2_state', customFields.mlfn2);
  setField(dataObject, 'multiline_text_field3_name', 'multiline_text_field3_state', customFields.mlfn3);

  setField(dataObject, 'checkbox_field1_name', 'checkbox_field1_state', customFields.cfn1);
  setField(dataObject, 'checkbox_field2_name', 'checkbox_field2_state', customFields.cfn2);
  setField(dataObject, 'checkbox_field3_name', 'checkbox_field3_state', customFields.cfn3);

  setField(dataObject, 'date_field1_name', 'date_field1_state', customFields.dfn1);
  setField(dataObject, 'date_field2_name', 'date_field2_state', customFields.dfn2);
  setField(dataObject, 'date_field3_name', 'date_field3_state', customFields.dfn3);
};

exports.createCollection = async (req, res) => {
  console.log("Request Body:", req.body);
  const { name, description, category, customFields } = req.body;

  let parsedCustomFields;
  try {
    parsedCustomFields = JSON.parse(customFields);
  } catch (error) {
    return res.status(400).json({ message: "Invalid customFields format" });
  }

  try {
    const userId = req.params.userId === req.user.id || req.user.role === 'admin' ? req.params.userId : req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const imageUrl = req.file ? req.file.location : null;
    const collectionData = {
      name,
      description,
      image: imageUrl,
      category,
      userId
    };
    if (parsedCustomFields) {
      setCustomFields(collectionData, parsedCustomFields);
    }
    const collection = await db.Collection.create(collectionData);
    res.status(201).json(collection);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ message: "Error creating collection", error: error.message });
  }
};

exports.getCollection = async (req, res) => {
  const { id } = req.params;
  try {
    const collection = await db.Collection.findByPk(id, {
      include: [
        {
          model: db.User,
          attributes: ['username']
        }
      ]
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collection", error });
  }
};

exports.getAllCollection = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const collections = await db.Collection.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      attributes: [
        'id',
        'name',
        'description',
        'image',
        'category',
        [db.sequelize.fn('COUNT', db.sequelize.col('Items.id')), 'itemCount'],
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'username'],
        },
        {
          model: db.Item,
          attributes: [],
          required: false,
        },
      ],
      group: ['Collection.id', 'User.id', 'Collection.name', 'Collection.description', 'Collection.image', 'Collection.category'],
      order: [[db.sequelize.col('itemCount'), 'DESC']],
      subQuery: false,
    });

    res.status(200).json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Error fetching collections' });
  }
};

exports.getUserCollections = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const collectionCount = await db.Collection.count({
      where: { userId }    
    });
    const collections = await db.Collection.findAll({
      where: { userId },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'name',
        'description',
        'image',
        'category',
        [db.sequelize.fn('COUNT', db.sequelize.col('Items.id')), 'itemCount']
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'username']
        },
        {
          model: db.Item,
          attributes: [],
          required: false
        }
      ],
      group: ['Collection.id', 'Collection.name', 'Collection.description', 'Collection.image', 'Collection.category', 'User.id', 'User.username'],
      subQuery: false
    });

    res.status(200).json({ collectionCount, collections });
    } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Error fetching collections', error });
  }
};


exports.getCategoryCollections = async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 3 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const collections = await db.Collection.findAll({
      where: { category },
      offset: parseInt(offset),
      limit: parseInt(limit),
      attributes: [
        'id',
        'name',
        'description',
        'image',
        'category',
        [db.sequelize.fn('COUNT', db.sequelize.col('Items.id')), 'itemCount']
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'username']
        },
        {
          model: db.Item,
          attributes: [],
          required: false
        }
      ],
      group: ['Collection.id', 'Collection.name', 'Collection.description', 'Collection.image', 'Collection.category', 'User.id', 'User.username'],
      subQuery: false
    });

    res.status(200).json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Error fetching collections' });
  }
};



exports.updateCollection = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const { name, description, category, customFields } = req.body;

  let parsedCustomFields;
  try {
    parsedCustomFields = JSON.parse(customFields);
    console.log('Parsed Custom Fields:', parsedCustomFields);
  } catch (error) {
    return res.status(400).json({ message: "Invalid customFields format" });
  }

  const imageUrl = req.file ? req.file.location : null;

  try {
    const collection = await db.Collection.findByPk(id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (req.user.role !== 'admin' && collection.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    if (name !== undefined) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (category !== undefined) collection.category = category;
    if (imageUrl !== null && imageUrl !== undefined) collection.image = imageUrl;

    if (parsedCustomFields) {
      setCustomFields(collection, parsedCustomFields);
      console.log('Updated Collection with Custom Fields:', collection);
    }

    await collection.save();
    res.status(200).json(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ message: "Error updating collection", error: error.message });
  }
};

exports.deleteCollection = async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await db.Collection.findByPk(id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (req.user.role !== 'admin' && collection.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await collection.destroy();
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting collection", error });
  }
};
