const Declaration = require("../models/declaration");
const Celebrant = require("../models/celebrant");
const Temoin = require("../models/temoin");
const DeclarationTemoin = require("../models/declaration_temoin");
const Epouse = require("../models/epouse");
const Epoux = require("../models/epoux");
const {sequelize} = require("../configs/db");

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
    const t = await sequelize.transaction();
    try {
        console.log(req.body);
        const createdCelebrant = await Celebrant.create({ ...celebrant }, {transaction: t});
        const createdEpouse = await Epouse.create({ ...epouse }, {transaction: t});
        const createdEpoux = await Epoux.create({ ...epoux }, {transaction: t});

        const declaration = await Declaration.create({
            id_utilisateur: id_utilisateur,
            id_commune: id_commune,
            date_celebration: date_celebration,
            id_celebrant: createdCelebrant.id_celebrant,
            id_epoux: createdEpoux.id_epoux,
            id_epouse: createdEpouse.id_epouse
        }, {transaction: t});

        for (let temoinData of temoins) {
        
            let temoin = await Temoin.create({ ...temoinData },{transaction: t});
            await declaration.addTemoin(temoin, {transaction: t});
        }

        t.commit();

        return res.status(200).json({
            error: false,
            message: "Declaration cree avec succes",
            data: { id: declaration.id_declaration }
        })
      
    } catch (error) {
        console.log(error)
        t.rollack();
       
        return res.json({
            error: true,
            message: "Erreur lors de la creation de la declaration",
            data: {}
        })
    }

}