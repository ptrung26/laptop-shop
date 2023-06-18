"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      discount: {
        type: Sequelize.INTEGER
      },
      cpu: {
        type: Sequelize.STRING,
      },
      ram: {
        type: Sequelize.STRING,
      },
      hardDrive: {
        type: Sequelize.STRING,
      },
      vga: {
        type: Sequelize.STRING,
      },
      monitor: {
        type: Sequelize.STRING,
      },
      pin: {
        type: Sequelize.STRING,
      },
      os: {
        type: Sequelize.STRING,
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      sellCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      categoryId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: "categories",
          key: "id",
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
