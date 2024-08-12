module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define('Collection', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    integer_field1_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    integer_field1_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    integer_field2_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    integer_field2_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    integer_field3_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    integer_field3_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    string_field1_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    string_field1_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    string_field2_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    string_field2_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    string_field3_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    string_field3_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    multiline_text_field1_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    multiline_text_field1_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    multiline_text_field2_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    multiline_text_field2_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    multiline_text_field3_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    multiline_text_field3_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkbox_field1_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    checkbox_field1_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkbox_field2_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    checkbox_field2_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkbox_field3_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    checkbox_field3_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_field1_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    date_field1_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_field2_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    date_field2_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_field3_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    date_field3_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});
  Collection.associate = function(models) {
    Collection.belongsTo(models.User, { foreignKey: 'userId' });
    Collection.hasMany(models.Item, { foreignKey: 'collectionId' });
  };
  return Collection;
};
