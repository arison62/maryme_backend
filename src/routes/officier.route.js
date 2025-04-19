const {Router} = require("express");
const {createOfficier, loginOfficier} = require("../controllers/officier.controller");
const {authMiddleware} = require("../middlewares/auth.middleware");
const router = Router();

router.post("/create", authMiddleware, createOfficier);
router.post("/login", loginOfficier);
module.exports = router;