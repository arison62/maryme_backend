const { Router } = require("express");
const {authMiddleware} = require("../middlewares/auth.middleware");
const { createDeclaration, getDeclarationsByOfficerCommune, traitementDeclaration, publishDeclaration, sendMail, getDeclarationMessages, getDeclarationsPublished } = require("../controllers/declaration.controller");

const router = Router();
router.post('/create', authMiddleware, createDeclaration);
router.get('/get', authMiddleware, getDeclarationsByOfficerCommune);
router.get('/publier', getDeclarationsPublished);
router.post('/traitement/:id_declaration', authMiddleware, traitementDeclaration);
router.post('/publier/:id_declaration', authMiddleware, publishDeclaration);
router.post('/message/send/:id_declaration', authMiddleware, sendMail);
router.get('/message/:id_declaration', authMiddleware, getDeclarationMessages)
module.exports = router;
