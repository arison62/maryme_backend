const {Router} = require('express');
const {getAllRegions, getDepartmentsByRegion, getCommunesByDepartment, getAllDepartements} = require('../controllers/region.controller');
const {authMiddleware} = require('../middlewares/auth.middleware');

const router = Router();
router.get('/regions',getAllRegions);
router.get('/regions/:id_region/departements', getDepartmentsByRegion);
router.get('/departements/:id_departement/communes', getCommunesByDepartment);
router.get('/departements', getAllDepartements);

module.exports = router;
