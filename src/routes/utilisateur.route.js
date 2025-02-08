const express = require("express")
const { requestToken, login } = require("../controllers/utilisateur.controller")

const router = express.Router()


router.post("/token", requestToken)
router.post("/login", login);
module.exports = router