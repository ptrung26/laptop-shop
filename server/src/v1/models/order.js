"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.belongsTo(models.User, {
                foreignKey: "userId",
                targetKey: "id",
                as: "userData"
            })
            Order.hasMany(models.OrderDetail);
        }
    }
    Order.init(
        {
            userId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
            },
            fullName: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            phoneNumber: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            }
        },
        {
            sequelize,
            modelName: "Order",
        }
    );
    Order.beforeCreate((order, _) => {
        return order.id = uuidv4();
    });
    return Order;
};
