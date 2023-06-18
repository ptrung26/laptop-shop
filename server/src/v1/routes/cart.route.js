const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { auth, checkRole } = require("../middlewares/auth.middleware");

router.get("/", auth, checkRole('ViewCart'), cartController.getAllProductFromCart);
router.post("/", auth, checkRole('createCart'), cartController.addProductToCart);
router.put("/", auth, checkRole('updateCart'), cartController.updateProductOfCart);
router.delete("/", auth, checkRole('deleteCart'), cartController.deleteProductFromCart);
module.exports = router; 