const express = require("express");
const { body } = require("express-validator")
const userController = require("../controllers/user.controller");
const requestHandler = require("../handlers/request.handler");
const { auth, checkRole } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post(
    "/signup",
    body("username")
        .exists()
        .withMessage("userName is required!"),
    body("password")
        .exists()
        .isLength({ min: 6 })
        .withMessage("password minimum 6 charaters"),
    requestHandler.validate,
    userController.signup);

router.post(
    "/signin",
    body("username")
        .exists()
        .withMessage("userName is required!"),
    body("password")
        .exists()
        .isLength({ min: 6 })
        .withMessage("password minimum 6 charaters"),
    userController.signin);

router.post("/refresh", userController.refreshToken);
router.get("/info", auth, userController.getInfo);
router.get("/logout", auth, userController.logout);
router.post("/forgot-password", userController.forgotPassword);
router.get("/reset-password/:token", userController.verifyResetToken);
router.put("/reset-password", userController.resetPassword);

module.exports = router;
