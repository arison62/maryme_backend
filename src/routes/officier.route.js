const {Router} = require("express");
const {createOfficier, loginOfficier, getOfficierById} = require("../controllers/officier.controller");
const {authMiddleware} = require("../middlewares/auth.middleware");
const router = Router();

router.post("/create", authMiddleware, createOfficier);
router.post("/login", loginOfficier);
router.get("/:id", authMiddleware, getOfficierById);
module.exports = router;