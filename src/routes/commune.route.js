const {Router} = require('express');
const {createCommune} = require('../controllers/commune.controller');
const { utilisateurAuth } = require('../middlewares/utilisateurAuth.middleware');
const router = Router();

router.post('/commune/create', utilisateurAuth, createCommune);
 module.exports = router;