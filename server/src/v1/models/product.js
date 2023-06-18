"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.ProductImage);
      Product.hasMany(models.OrderDetail);
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        targetKey: "id",
        as: "categoryData"
      })
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      price: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      cpu: DataTypes.STRING,
      ram: DataTypes.STRING,
      hardDrive: DataTypes.STRING,
      vga: DataTypes.STRING,
      monitor: DataTypes.STRING,
      pin: DataTypes.STRING,
      os: DataTypes.STRING,
      image: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      sellCount: DataTypes.INTEGER,
      categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },

    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  Product.beforeCreate((product, _) => {
    return product.id = uuidv4();
  });
  return Product;
};
