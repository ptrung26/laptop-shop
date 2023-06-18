"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.UserRole);
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      verify: DataTypes.STRING,
      verifyUpdatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user, _) => {
    return user.id = uuidv4();
  });
  return User;
};
