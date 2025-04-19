const {Router} = require('express');
const {createCommune} = require('../controllers/commune.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const router = Router();

router.post('/commune/create', authMiddleware, createCommune);
 module.exports = router;