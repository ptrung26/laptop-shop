"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            OrderDetail.belongsTo(models.Order, {
                foreignKey: "orderId",
                targetKey: "id",
                as: "orderData"
            })
            OrderDetail.belongsTo(models.Product, {
                foreignKey: "productId",
                targetKey: "id",
                as: "productData"
            })
        }
    }
    OrderDetail.init(
        {
            orderId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
                primaryKey: true,
            },
            productId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            price: DataTypes.INTEGER,
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            }
        },
        {
            sequelize,
            modelName: "OrderDetail",
        }
    );
    return OrderDetail;
};
