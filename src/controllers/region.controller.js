const Region = require("../models/region");
const Departement = require("../models/departement");
const Commune = require("../models/commune"); 

/**
 * get all regions with their departments
 */
exports.getAllRegions = async (req, res) => {
    try {
        const regions = await Region.findAll({
            include: {
                model: Departement,
                include: {
                    model: Commune
                }
            }
        });
        return res.status(200).json({
            error: false,
            message: "",
            data: regions
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
            data: {}
        });
    }
   
}

exports.getAllDepartements = async (req, res) => {
    try {
        const departements = await Departement.findAll();
        return res.status(200).json({
            error: false,
            message: "",
            data: departements
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
            data: {}
        });
    }
}

/**
 * get all departments in a region
 */
exports.getDepartmentsByRegion = async (req, res) => {
    const { id_region } = req.params;
    try {
        const departments = await Departement.findAll({
            where: {
                id_region: id_region
            }
        });
        return res.status(200).json({
            error: false,
            message: "",
            data: departments
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
            data: {}
        });
    }
}

/**
 * get all communes in a department
 */

exports.getCommunesByDepartment = async (req, res) => {
    const { id_departement } = req.params;
    try {
        const communes = await Commune.findAll({
            where: {
                id_departement: id_departement
            }
        });
        return res.status(200).json({
            error: false,
            message: "",
            data: communes
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
            data: {}
        });
    }
}
