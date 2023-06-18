const roleControler = require("../controllers/role.controller");
const express = require("express");
const { limit } = require("../middlewares/limit.middleware");
const { auth, checkRole } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", limit, auth, checkRole('admin'), roleControler.createRole);
router.put("/", limit, auth, checkRole('admin'), roleControler.setRoleOfUser);
router.post('/detail/:roleId', auth, roleControler.createRoleDetail);
module.exports = router; 