"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class RoleDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            RoleDetail.belongsTo(models.Role, {
                foreignKey: "roleId",
                targetKey: "id",
                as: "roleData"
            })
        }
    }
    RoleDetail.init(
        {
            roleId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            actionName: DataTypes.STRING,
            actionCode: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "RoleDetail",
        }
    );
    RoleDetail.beforeCreate((roleDetail, _) => {
        return roleDetail.id = uuidv4();
    });
    return RoleDetail;
};
