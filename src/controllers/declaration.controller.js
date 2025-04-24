const Declaration = require("../models/declaration");
const Celebrant = require("../models/celebrant");
const Temoin = require("../models/temoin");
const DeclarationTemoin = require("../models/declaration_temoin");
const Epouse = require("../models/epouse");
const Epoux = require("../models/epoux");
const { sequelize } = require("../configs/db");
const Commune = require("../models/commune");
const OfficiersEtatCivil = require("../models/officier_etat_civil");
const Oppostion = require("../models/oppostion");
const Utilisateur = require("../models/utilisateur");
const TraitementDeclaration = require("../models/traitement_declaration");
const PublicationDeclaration = require("../models/publication_declaration");
const { sendDeclarationEmail, sendReminderEmail, sendMessageEmail } = require("../utils/send_mail_declaration");
const Message = require("../models/message");

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
  const { celebrant, temoins, id_commune, date_celebration, epoux, epouse } =
    req.body;
  const { id_utilisateur } = req.auth;
  const t = await sequelize.transaction();
  try {
    const createdCelebrant = await Celebrant.create(
      { ...celebrant },
      { transaction: t }
    );
    const createdEpouse = await Epouse.create(
      { ...epouse },
      { transaction: t }
    );
    const createdEpoux = await Epoux.create({ ...epoux }, { transaction: t });

    const declaration = await Declaration.create(
      {
        id_utilisateur: id_utilisateur,
        id_commune: id_commune,
        date_celebration: date_celebration,
        id_celebrant: createdCelebrant.id_celebrant,
        id_epoux: createdEpoux.id_epoux,
        id_epouse: createdEpouse.id_epouse,
      },
      { transaction: t }
    );

    for (let temoinData of temoins) {
      let temoin = await Temoin.create({ ...temoinData }, { transaction: t });
      await declaration.addTemoin(temoin, { transaction: t });
    }

    t.commit();

    return res.status(200).json({
      error: false,
      message: "Declaration cree avec succes",
      data: { id: declaration.id_declaration },
    });
  } catch (error) {
    console.log(error);
    t.rollack();

    return res.json({
      error: true,
      message: "Erreur lors de la creation de la declaration",
      data: {},
    });
  }
};

/**
 * Controller to get all declarations for the commune of the logged-in officer.
 * Requires the officer's ID to be available in req.auth.id_officier,
 * which should be set by your authentication middleware.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @returns {Promise<void>}
 */
exports.getDeclarationsByOfficerCommune = async (req, res) => {
  try {
    const { status } = req.query;

    const officerId = req.auth.id_officier;

    // 1. Find the officer's commune ID.
    const officer = await OfficiersEtatCivil.findOne({
      where: { id_officier: officerId },
      include: [{ model: Commune }], // Include the Commune model to access its attributes
    });

    if (!officer) {
      return res.status(404).json({
        error: true,
        message: "Officer not found",
        data: {},
      });
    }

    const communeId = officer.id_commune;

    // 2. Fetch all declarations for that commune.
    const declarations = await Declaration.findAll({
      where: {
        id_commune: communeId,
        ...(status && { status: status }), // Filter by status if provided
      },
      include: [
        {
          model: Commune,
          attributes: ["nom"],
        },
        {
          model: Celebrant,

          attributes: ["nom", "prenom", "telephone"],
        },
        {
          model: Epoux,
          attributes: ["nom", "prenom", "telephone"],
        },
        {
          model: Epouse,
          attributes: ["nom", "prenom", "telephone"],
        },
        {
          model: Temoin,
          through: DeclarationTemoin,
          attributes: ["nom", "prenom", "telephone"],
        },
        {
          model: Oppostion,
          attributes: ["motif", "date_oppostion"],
        },
        {
          model: Utilisateur,
          attributes: ["email", "telephone"],
        },
        {
            model: Message,
            attributes: ["contenu", "type_message", "date_envoi"],
        }
      ],
      order: [["createdAt", "DESC"]], // Order by creation date, most recent first
      nest: true,
    });

    if (!declarations || declarations.length === 0) {
      return res.status(200).json({
        //  No declarations found is not an error, return empty array
        error: false,
        message: "No declarations found for this commune.",
        data: [],
      });
    }

    res.status(200).json({
      error: false,
      message: "Declarations retrieved successfully",
      data: declarations,
    });
  } catch (error) {
    console.error("Error fetching declarations for officer's commune:", error);
    res.status(500).json({
      error: true,
      message: "Failed to retrieve declarations",
      data: {},
    });
  }
};

exports.traitementDeclaration = async (req, res) => {
  const { id_declaration } = req.params;
  const { status } = req.query;
  const { id_officier } = req.auth;
  const t = await sequelize.transaction();
  try {
    if (!id_officier) {
        return res.status(401).json({
            error: true,
            message: "Unauthorized",
            data: {},
        });
    }
    if (!id_declaration) {
      return res.status(400).json({
        error: true,
        message: "id_declaration is required",
        data: {},
      });
    }
    if (!status) {
      return res.status(400).json({
        error: true,
        message: "status is required",
        data: {},
      });
    }
    if (
      status !== "en_attente" &&
      status !== "accepte" &&
      status !== "refuse"
    ) {
      return res.status(400).json({
        error: true,
        message:
          "status must be one of the following: en_attente, accepte, refuse",
        data: {},
      });
    }
    const declaration = await Declaration.findOne({
      where: {
        id_declaration: id_declaration,
      },
      include: [
        {
            model: Epouse,
            attributes: ["nom", "prenom"]
        },
        {
            model: Epoux,
            attributes: ["nom", "prenom"]
        },
        {
            model: Utilisateur,
            attributes: ["email"]
        }
      ]
    });
    if (!declaration) {
      return res.status(404).json({
        error: true,
        message: "Declaration not found",
        data: {},
      });
    }
    const traitementPrevDeclaration = await TraitementDeclaration.findOne({
      where: {
        id_declaration: id_declaration,
      },
    });
    const traitementDeclaration = await TraitementDeclaration.create(
      {
        id_declaration: id_declaration,
        id_officier: id_officier,
        status: status,
        prevStatus: traitementPrevDeclaration
          ? traitementPrevDeclaration.status
          : "en_attente",
      },
        { transaction: t }
    );
    await declaration.update({status: status}, { transaction: t });
    t.commit();
    sendDeclarationEmail(
        {
            to: declaration.Utilisateur.email,
            declaration: declaration,
            message: "",
            status: status
        }
    );
    return res.status(200).json({
      error: false,
      message: "Traitement de la declaration effectue avec succes",
      data: {
        id_traitement_declaration: traitementDeclaration.id_traitement_declaration,
        status: traitementDeclaration.status,
        prevStatus: traitementDeclaration.prevStatus,
        date_traitement: traitementDeclaration.date_traitement,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Erreur lors de la traitement de la declaration",
      data: {},
    });
  }
};

exports.publishDeclaration = async (req, res)=>{
    try {
        const { id_declaration } = req.params;
        const { id_officier } = req.auth;
        if (!id_officier) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized",
                data: {},
            });
        }
        if (!id_declaration) {
            return res.status(400).json({
                error: true,
                message: "id_declaration is required",
                data: {},
            });
        }
        const declaration = await Declaration.findOne({
            where: {
                id_declaration: id_declaration,
            },
            include: [
                
                  {
                    model: Epoux,
                    attributes: ["nom", "prenom", "telephone"],
                  },
                  {
                    model: Epouse,
                    attributes: ["nom", "prenom", "telephone"],
                  },
                  {
                    model: Utilisateur,
                    attributes: ["email", "telephone"],
                  },
            ]
        });
        if (!declaration) {
            return res.status(404).json({
                error: true,
                message: "Declaration not found",
                data: {},
            });
        }
        const [publication, created] = await PublicationDeclaration.findOrCreate({
            where: {
                id_declaration: id_declaration,
            },
            defaults: {
                id_declaration: id_declaration,
            },
        })
        if (!created) {
            return res.status(400).json({
                error: true,
                message: "Declaration already published",
                data: {},
            });
        }
        sendDeclarationEmail({
            to: declaration.Utilisateur.email,
            declaration: declaration,
            message: "Votre declaraion a ete publie",
            status: 'en_attente'
        });

        return res.status(200).json({
            error: false,
            message: "Declaration published successfully",
            data: {
                id_publication_declaration: publication.id_publication_declaration,
                date_publication: publication.date_publication,
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Erreur lors de la publication de la declaration",
            data: {},
        });
        
    }
}

exports.sendMail = async (req, res)=>{
    try {
        const {id_declaration} = req.params;
        const {message} = req.body;
        const {id_officier} = req.auth;

        if(!id_officier){
            return res.status(401).json({
                error: true,
                message: "Unauthorized",
                data: {}
            })
        }
        if(!id_declaration){
            return res.status(400).json({
                error: true,
                message: "Vous devez fournir la id_declaration",
                data: {}
            })
        }
        if(!message || message === ""){
            return res.status(400).json({
                error: true,
                message: "Le contenu du message est vide",
                data: {}
            });
        }

        const declaration = await Declaration.findOne({
            where: {
                id_declaration: id_declaration
            },
            include: [
                {
                    model: Epouse,
                    attributes: ["nom", "prenom"]
                },
                {
                    model: Epoux,
                    attributes: ["nom", "prenom"]
                },
                {
                    model: Utilisateur,
                    attributes: ["email"]
                }
            ]
        });
        if(!declaration){
            return res.status(404).json({
                error: true,
                message: "Declation not found",
                data: {}
            });
        }
        const messageModel = await Message.create({
            id_declaration: id_declaration,
            contenu: message,
            type_message: "infos"
        });

        sendMessageEmail({
            to: declaration.Utilisateur.email,
            declaration: declaration,
            message
        });
        return res.status(200).json({
            error: false,
            message: "Message envoye",
            data: {}
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: true,
            message: "Erreur d'envoie du mail",
            data: {}
        })
    }
}

exports.getDeclarationMessages = async (req, res) => {
    try {
        const {id_declaration} = req.params;
        const {id_officier} = req.auth;
        if(!id_declaration){
            return res.status(400).json({
                error: true,
                message: "Vous devez specifier id_declaration",
                data: {}
            })
        }
        if(!id_officier){
            return res.status(401).json({
                error: true,
                message: "Unauthorized",
                data: {}
            })
        }
        const messages = await Message.findAll({
            where: {
                id_declaration: id_declaration
            },
            order: [["createdAt", "DESC"]]
        });
        if(messages.length == 0){
            return res.status(404).json({
                error: true,
                message: "Pas de messages",
                data: {}
            });
        }
        return res.status(200).json({
            error: false,
            message: "Message recuperes",
            data: messages
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: true,
            message: "Erreur lors des messages",
            data: {}
        })
    }
}
