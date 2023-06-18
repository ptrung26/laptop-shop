const express = require("express");
const productRoute = require("./product.route.js");
const userRoute = require("./user.route.js");
const roleRoute = require("./role.route.js");
const cartRoute = require('./cart.route.js');
const categoryRoute = require("./category.route.js");
const orderRoute = require("./order.route.js");
const router = express.Router();
const responseHandler = require("../handlers/response.handler");

router.use("/categories", categoryRoute);
router.use("/products", productRoute);
router.use("/user", userRoute);
router.use("/role", roleRoute)
router.use("/cart", cartRoute);
router.use("/order", orderRoute);

router.use((req, res) => {
    responseHandler.notfound(res);
})

module.exports = router;
