module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    status: {
      type: DataTypes.ENUM('active', 'blocked'),
      defaultValue: 'active'
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Collection, { foreignKey: 'userId' });
    User.hasMany(models.Comment, { foreignKey: 'userId' });
    User.hasMany(models.Like, { foreignKey: 'userId' });  
    User.belongsToMany(models.Item, { through: models.Like, as: 'LikedItems', foreignKey: 'userId'});
      };
  return User;
};
