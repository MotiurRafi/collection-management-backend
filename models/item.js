module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    integer_field1_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    integer_field2_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    integer_field3_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    string_field1_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    string_field2_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    string_field3_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    multiline_text_field1_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    multiline_text_field2_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    multiline_text_field3_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkbox_field1_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkbox_field2_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkbox_field3_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_field1_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_field2_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_field3_value: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});

  Item.associate = function (models) {
    Item.belongsTo(models.Collection, { foreignKey: 'collectionId' });
    Item.hasMany(models.Comment, { foreignKey: 'itemId' });
    Item.belongsToMany(models.User, { through: models.Like, as: 'Likers', foreignKey: 'itemId' });
    Item.belongsToMany(models.Tag, { through: models.ItemTag, foreignKey: 'itemId' });
  };

  return Item;
};
