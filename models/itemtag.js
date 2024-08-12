module.exports = (sequelize, DataTypes) => {
    const ItemTag = sequelize.define('ItemTag', {
      itemId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Items',
          key: 'id'
        }
      },
      tagId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Tags',
          key: 'id'
        }
      }
    }, {
      timestamps: false
    });
  
    return ItemTag;
  };
  