const responseHandler = require("../handlers/response.handler");
const db = require("../models");
const client = require("../config/redis.config")

const cartController = {

    getAllProductFromCart: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }

        try {
            const cart = await client.HGETALL(`cart:${req.user.id}`);
            const totalCart = await client.HLEN(`cart:${req.user.id}`);
            const productIds = Object.keys(cart);
            const products = await db.Product.findAll({
                where: {
                    id: productIds,
                },
                attributes: ['name', 'id', 'image', 'price', 'discount', 'slug'],
            })


            const productsWithQuantity = products.map(product => {
                return {
                    ...product.toJSON(),
                    price: parseInt(product.price * (1 - (1.0 * product.discount) / 100)),
                    quantity: parseInt(cart[product.id]),
                }
            })

            responseHandler.ok(res, {
                message: 'success',
                cart: productsWithQuantity,
                totalCart
            })

        } catch (err) {
            responseHandler.err(res);

        }
    },

    addProductToCart: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return responseHandler.badRequest(res);
        }

        try {

            await client.HINCRBY(`cart:${req.user.id}`, productId, quantity);
            const totalCart = await client.HLEN(`cart:${req.user.id}`);
            return responseHandler.ok(res, {
                status: 200,
                message: 'Add product to cart successfully!',
                productId,
                totalCart
            })

        } catch (err) {
            responseHandler.err(res);
        }

    },

    updateProductOfCart: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return responseHandler.badRequest(res);
        }

        try {
            await client.HSET(`cart:${req.user.id}`, productId, quantity);
            responseHandler.ok(res, {
                message: "update product of cart successfully!",
                product: {
                    productId,
                    quantity,
                }
            })
        } catch (err) {
            return responseHandler.err(res);
        }
    },

    deleteProductFromCart: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }
        const { productId } = req.query;

        if (!productId) {
            return responseHandler.err(res);
        }

        try {
            await client.hDel(`cart:${req.user.id}`, productId);
            const totalCart = await client.HLEN(`cart:${req.user.id}`);
            responseHandler.ok(res, {
                status: 200,
                message: 'Delete product from cart successfully!',
                productId,
                totalCart
            })

        } catch (err) {
            responseHandler.err(res);
        }
    }

}

module.exports = cartController; 