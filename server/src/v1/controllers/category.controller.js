const responseHandler = require("../handlers/response.handler");
const db = require("../models");

const categogryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await db.Category.findAll();
            responseHandler.ok(res, {
                status: 200,
                categories,
            })
        } catch (err) {
            responseHandler.err(res);
        }
    },

    addNewCategory: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }

        try {
            const newCategory = await db.Category.create({
                name: req.body.name,
            })

            responseHandler.created(res, {
                message: 'add new category successfully!',
                newCategory,
            })
        } catch (err) {
            responseHandler.err(res);
        }
    },

    removeCategory: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }

        const { categoryId } = req.params;

        try {
            const productsOfCategory = await db.Category.findAll({
                categoryId,
            })

            if (productsOfCategory) {
                return responseHandler.err(res);
            }

            await db.Category.destroy({
                where: {
                    categoryId
                }
            })

            responseHandler.ok(res, {
                message: 'delete category successfully!',
            })
        } catch (err) {
            responseHandler.err(res);
        }
    }
}

module.exports = categogryController; 