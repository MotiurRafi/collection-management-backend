const db = require('../models');
const upload = require('../middlewares/multer-config');

const setField = (dataObject, fieldName, fieldStateName, stateValue, nameValue) => {
  if (stateValue !== undefined) dataObject[fieldStateName] = stateValue;
  if (nameValue !== undefined) dataObject[fieldName] = nameValue;
};

const setCustomFields = (dataObject, customFields) => {
  setField(dataObject, 'integer_field1_name', 'integer_field1_state', customFields.ifs1, customFields.ifn1);
  setField(dataObject, 'integer_field2_name', 'integer_field2_state', customFields.ifs2, customFields.ifn2);
  setField(dataObject, 'integer_field3_name', 'integer_field3_state', customFields.ifs3, customFields.ifn3);

  setField(dataObject, 'string_field1_name', 'string_field1_state', customFields.sfs1, customFields.sfn1);
  setField(dataObject, 'string_field2_name', 'string_field2_state', customFields.sfs2, customFields.sfn2);
  setField(dataObject, 'string_field3_name', 'string_field3_state', customFields.sfs3, customFields.sfn3);

  setField(dataObject, 'multiline_text_field1_name', 'multiline_text_field1_state', customFields.mlfs1, customFields.mlfn1);
  setField(dataObject, 'multiline_text_field2_name', 'multiline_text_field2_state', customFields.mlfs2, customFields.mlfn2);
  setField(dataObject, 'multiline_text_field3_name', 'multiline_text_field3_state', customFields.mlfs3, customFields.mlfn3);

  setField(dataObject, 'checkbox_field1_name', 'checkbox_field1_state', customFields.cbfs1, customFields.cbfn1);
  setField(dataObject, 'checkbox_field2_name', 'checkbox_field2_state', customFields.cbfs2, customFields.cbfn2);
  setField(dataObject, 'checkbox_field3_name', 'checkbox_field3_state', customFields.cbfs3, customFields.cbfn3);

  setField(dataObject, 'date_field1_name', 'date_field1_state', customFields.dfs1, customFields.dfn1);
  setField(dataObject, 'date_field2_name', 'date_field2_state', customFields.dfs2, customFields.dfn2);
  setField(dataObject, 'date_field3_name', 'date_field3_state', customFields.dfs3, customFields.dfn3);
};



exports.createCollection = async (req, res) => {
  const { name, description, category, customFields } = req.body;
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
    if (customFields) {
      setCustomFields(collectionData, customFields);
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
    const collection = await db.Collection.findByPk(id);
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collection", error });
  }
};

exports.getUserCollections = async (req, res) => {
  const { userId } = req.params;
  try {
    const collections = await db.Collection.findAll({ where: { userId } });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collections", error });
  }
};

exports.updateCollection = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, customFields } = req.body;

  const imageUrl = req.file ? req.file.location : null;

  try {
    const collection = await db.Collection.findByPk(id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (req.user.role !== 'admin' && collection.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    if (name !== undefined) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (category !== undefined) collection.category = category;
    if (imageUrl !== undefined) collection.image = imageUrl;

    if (customFields) {
      setCustomFields(collection, customFields);
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
