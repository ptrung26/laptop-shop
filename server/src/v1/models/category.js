"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Category.hasMany(models.Product);
        }
    }
    Category.init(
        {
            name: {
                type: DataTypes.STRING,
            },
            slug: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "Category",
        }
    );
    Category.beforeCreate((cate, _) => {
        return cate.id = uuidv4();
    });
    return Category;
};
