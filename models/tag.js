module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Tag.associate = function(models) {
    Tag.belongsToMany(models.Item, { through: models.ItemTag, foreignKey: 'tagId' });
  };

  return Tag;
};
