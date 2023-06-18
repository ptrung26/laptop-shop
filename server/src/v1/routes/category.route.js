const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { auth, checkRole } = require("../middlewares/auth.middleware");

router.get('/', categoryController.getAllCategories);
router.post('/', auth, checkRole('createCategory'), categoryController.addNewCategory);
router.delete('/:categoryId', auth, checkRole('deleteCategory'), categoryController.removeCategory);

module.exports = router; 