const express = require("express");
const router = express.Router();
const order = require("../controllers/order.controller");
const { auth, checkRole } = require("../middlewares/auth.middleware");

router.post("/", auth, checkRole('createOrder'), order.createNewOrder);
router.get("/:orderId", order.getOrderById);
module.exports = router; 