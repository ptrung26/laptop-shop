const db = require("../models");
const responseHandler = require("../handlers/response.handler");
const { Op } = require("sequelize");
const cloudinary = require('cloudinary').v2;
const productController = {

    addProduct: async (req, res) => {
        const fileData = req.file;
        try {
            const newProduct = await db.Product.create({ image: fileData?.path, ...req.body });
            responseHandler.created(res, {
                status: 200,
                message: 'Create new product successfully!',
                product: newProduct,
            })
        } catch (err) {
            if (fileData) {
                cloudinary.uploader.destroy(fileData.fileName);
            }
            responseHandler.err(res);
        }

    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return responseHandler.notfound(res);
        }

        const product = await db.Product.findOne({
            where: {
                id,
            }
        })

        if (!product) {
            return responseHandler.notfound(res);
        }

        try {
            await db.Product.destroy({
                where: {
                    id,
                }
            })

            responseHandler.ok(res, {
                status: 200,
                message: 'delete product successfully!'
            })
        } catch (err) {
            responseHandler.err(res);
        }
    },

    updateProduct: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return responseHandler.notfound(res);
        }

        const fileData = req.file;

        try {
            const product = await db.Product.findOne({
                where: {
                    id,
                }
            })

            if (!product) {
                return responseHandler.notfound(res);
            }

            await db.Product.update({ image: fileData?.path, ...req.body }, {
                where: {
                    id
                }
            })

            responseHandler.ok(res, {
                status: 200,
                message: `update product ${id} successfully!`,
            })
        } catch (err) {
            if (fileData) {
                cloudinary.uploader.destroy(fileData.fileName);
            }
            responseHandler.err(res);
        }
    },

    fillerProduct: async (req, res) => {
        const { page, q, brand, cpu, category, max, min, ram, order } = req.query;

        const queries = {};

        if (q) {
            queries.name = {
                [Op.like]: `%${q}%`
            }
        }

        if (brand) {
            queries.name = {
                [Op.like]: `%${brand}%`
            }
        }

        if (cpu) {
            queries.cpu = {
                [Op.like]: `%${cpu}%`
            }
        }

        if (ram) {
            queries.ram = {
                [Op.like]: `%${ram}%`
            }
        }

        if (category) {
            const { id: categoryId } = await db.Category.findOne({
                where: {
                    slug: category,
                }
            })
            queries.categoryId = categoryId;
        }

        if (max && min) {
            queries.price = {
                [Op.gte]: +min,
                [Op.lte]: +max,
            }
        }


        const limit = 12;
        const offset = page ? (+page - 1) * limit : 0;

        try {
            const totalRecords = await db.Product.count({
                where: queries,
            })

            const products = await db.Product.findAll({
                where: queries,
                limit,
                offset,
                order,
            });

            const totalPage = Math.ceil(totalRecords / limit);

            return responseHandler.ok(res, {
                status: 200,
                products,
                totalPage
            })
        } catch (err) {
            responseHandler.err(res);
        }
    },

    getProductbySlug: async (req, res) => {
        let { slug } = req.params;
        if (!slug) {
            return responseHandler.badRequest(res, { status: 400, message: "not enough parameter!" });
        }


        try {
            const product = await db.Product.findOne({
                where: {
                    slug,
                },
                include: [
                    { model: db.Category, as: 'categoryData', attributes: ['id', 'name', 'slug'] }
                ]
            });

            const productImages = await db.ProductImage.findAll({
                where: {
                    productId: product.id,
                },
                attributes: ['imageSrc']
            })

            responseHandler.ok(res, {
                status: 200,
                product,
                images: productImages,
            })
        } catch (err) {
            responseHandler.err(res);
        }
    },
}

module.exports = productController;