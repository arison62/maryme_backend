const { Router } = require("express");
const { utilisateurAuth } = require("../middlewares/utilisateurAuth.middleware");
const { createDeclaration } = require("../controllers/declaration.controller");

const router = Router();
router.post('/create', utilisateurAuth, createDeclaration);

module.exports = router;
