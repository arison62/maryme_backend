const Commune = require("../models/commune");


exports.createCommune = async (req, res) => {
    console.log(req.body)
    const { nom, id_departement } = req.body;
    try {
        const commune = await Commune.create({
            nom,
            id_departement
        });
        return res.status(201).json({
            error: false,
            message: "Commune created successfully",
            data: commune
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
            data: {}
        });
    }
}

