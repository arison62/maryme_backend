const Declaration = require("../models/declaration");
const Celebrant = require("../models/celebrant");
const Temoin = require("../models/temoin");
const DeclarationTemoin = require("../models/declaration_temoin");
const Epouse = require("../models/epouse");
const Epoux = require("../models/epoux");

/**
 * 
 * @param {*} req {
 *  body: {
    celebrant: {
        nom: string,
        prenom: string,
        date_naissance: string,
        telephone: string
    },
    temoins: [
        {
            nom: string,
            prenom: string,
            date_naissance: string,
            telephone: string
        }
    ],
    id_commune: string
 
    date_celebration: string
    
    epoux: {
        nom: string,
        prenom: string,
        date_naissance: string,
        telephone: string
    },
    epouse: {
        nom: string,
        prenom: string,
        date_naissance: string,
        telephone: string
    }
 * }
 * @param {*} res 
 */
exports.createDeclaration = async (req, res) => {
    const { celebrant, temoins, id_commune, date_celebration, epoux, epouse } = req.body;
    const { id_utilisateur } = req.auth;
    try {
        const createdCelebrant = await Celebrant.create({ ...celebrant });
        const createdEpouse = await Epouse.create({ ...epouse });
        const createdEpoux = await Epoux.create({ ...epoux });

        const declaration = await Declaration.create({
            id_utilisateur: id_utilisateur,
            id_commune: id_commune,
            date_celebration: date_celebration,
            id_celebrant: createdCelebrant.id_celebrant,
            id_epoux: createdEpoux.id_epoux,
            id_epouse: createdEpouse.id_epouse
        });

        for (let temoinData of temoins) {
        
            let temoin = await Temoin.create({ ...temoinData });
            await declaration.addTemoin(temoin);
        }
        return res.status(500).json({
            error: false,
            message: "Declaration cree avec succes",
            data: { id_declaration: declaration.id_declaration }
        })
    } catch (error) {
        console.log(error)
        return res.json({
            error: true,
            message: "Erreur lors de la creation de la declaration",
            data: {}
        })
    }

}