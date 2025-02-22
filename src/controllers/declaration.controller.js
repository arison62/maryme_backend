import Declaration from "../models/declaration";
import Celebrant from "../models/celebrant";
import Temoin from "../models/temoin";
import DeclarationTemoin from "../models/declaration_temoin";
import Commune from "../models/commune";
import Epouse from "../models/epouse";
import Epoux from "../models/epoux";

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
    commune: string
    ville: string
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

}