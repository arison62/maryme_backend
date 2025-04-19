const { Router } = require("express");
const {authMiddleware} = require("../middlewares/auth.middleware");
const { createDeclaration } = require("../controllers/declaration.controller");

const router = Router();
router.post('/create', authMiddleware, createDeclaration);

module.exports = router;
