"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            UserRole.belongsTo(models.User, {
                foreignKey: "userId",
                targetKey: "id",
                as: "userData"
            })
            UserRole.belongsTo(models.Role, {
                foreignKey: "roleId",
                targetKey: "id",
                as: "roleData"
            })
        }
    }
    UserRole.init(
        {
            userId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            roleId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "UserRole",
        }
    );
    return UserRole;
};
