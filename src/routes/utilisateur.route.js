const express = require("express")
const { requestToken, login, loginAdmin, createAdmin } = require("../controllers/utilisateur.controller")


const router = express.Router()


router.post("/token", requestToken)
router.post("/login", login);
router.post("/admin/login", loginAdmin);
router.post("/admin/create", createAdmin);
module.exports = router