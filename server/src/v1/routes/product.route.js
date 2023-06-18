const express = require("express");
const productController = require("../controllers/product.controller");
const { body } = require("express-validator");
const { auth, checkRole } = require("../middlewares/auth.middleware");
const { limit } = require("../middlewares/limit.middleware");

const upload = require("../middlewares/cloudinary.middleware");
const router = express.Router();

router.post('/',
    auth,
    checkRole('createProduct'),
    upload.single('image'),
    body("file").isEmpty().withMessage("Upload Image Error!"),
    productController.addProduct);

router.put('/:id',
    auth,
    checkRole('updateProduct'),
    upload.single('image'),
    body("file").isEmpty().withMessage("Upload Image Error!"),
    productController.updateProduct);

router.delete('/:id', auth, checkRole('deleteProduct'), productController.deleteProduct);

router.get('/', productController.fillerProduct);

router.get('/:slug', productController.getProductbySlug);

module.exports = router;
