const db = require("../models");
const responseHandler = require("../handlers/response.handler");
const sendEmail = require("../helpers/sendEmail");
const orderController = {
    getOrderById: async (req, res) => {

        const { orderId } = req.params;
        if (!orderId) {
            return responseHandler.badRequest(res, 'order id is required!');
        }

        const orderFound = await db.Order.findOne({
            where: {
                id: orderId,
            },
            raw: true,
        });

        const orderDetails = await db.OrderDetail.findAll({
            where: {
                orderId: orderFound.id,
            },
            include: [{
                model: db.Product,
                as: "productData",
                attributes: ["name", "slug"]
            }]
        })

        const result = await db.OrderDetail.findOne({
            where: {
                orderId: orderFound.id,
            },
            attributes: [
                [db.sequelize.literal('SUM(price * quantity)'), 'totalPrice']
            ]
        });

        const totalPrice = result.dataValues.totalPrice;
        const order = { ...orderFound, orderDetails, totalPrice }
        return responseHandler.ok(res, {
            status: 200,
            order,
        })
    },

    createNewOrder: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }

        const { order, cart } = req.body;
        if (!order || !cart) {
            return responseHandler.badRequest(res, 'not enough parameters!');
        }
        order.userId = req.user.id;


        try {

            const newOrder = await db.Order.create(order);
            const orderDetail = cart.map(item => {
                return {
                    orderId: newOrder.id,
                    productId: item.id,
                    price: item.price,
                    quantity: item.quantity,
                }
            })

            const newOrderDetail = await db.OrderDetail.bulkCreate(orderDetail, {
                fields: ['orderId', 'productId', 'price', 'quantity'],
            });

            await Promise.all(cart.map(async (item) => {
                const product = await db.Product.findByPk(item.id);
                if (product) {
                    const updatedQuantity = product.quantity - item.quantity;
                    const updatedSellCount = product.sellCount + item.quantity;
                    await product.update({
                        quantity: updatedQuantity,
                        sellCount: updatedSellCount,
                    });
                }
            }));

            const subject = 'Tạo đơn đặt hàng'
            const date = new Date(newOrder.createdAt);
            const html = `
            <p><b>Mã đơn hàng:</b> ${newOrder.id}</p>
            <p><b>Ngày đặt:</b> ${date.toLocaleString()}</p>
            <a href='${process.env.URL_SERVER}/invoice/${newOrder.id}'>Click vào đây để xem thông tin chi tiết</a>
            `
            const rs = await sendEmail(order.email, subject, html);
            return responseHandler.ok(res, {
                status: 200,
                message: 'ok',
                order: newOrderDetail,
            })

        } catch (err) {
            return responseHandler.badRequest(res, 'create order error!');
        }

    }

}

module.exports = orderController; 
