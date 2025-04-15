const jwt = require("jsonwebtoken");

const Utilisateur = require("../models/utilisateur");
const Token = require("../models/token");

const isValidEmail = require("../utils/email_check");
const {
    generate_password,
    generate_otp,
    hash_password,
} = require("../utils/generate_otp");
const { send_otp } = require("../utils/send_mail");
const { Op } = require("sequelize");
const { generate_token } = require("../utils/jwt_utils");

exports.requestToken = async (req, res) => {
    const { email } = req.body;
    if (email == undefined) {
        return res.status(404).json({
            error: "EMAIL NOT FOUND",
            message: "",
            data: {},
        });
    }
    if (!isValidEmail(email)) {
        return res.status(404).json({
            error: "INVALID EMAIL",
            message: "",
            data: {},
        });
    } else {
        const [user, created] = await Utilisateur.findOrCreate({
            where: {
                email: email,
            },
            defaults: {
                password: generate_password(),
            },
        });

        const otp = generate_otp();
        const token = await Token.create({
            id_utilisateur: user.id_utilisateur,
            token: otp,
            date_expiration: Date.now() + 5 * 60 * 1000,
        });

        const infos = await send_otp(email, otp);
        if (infos == undefined) {
            return res.status(500).json({
                error: "INTERNAL ERROR",
                message: "",
                data: {},
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Token envoye a votre adresse mail",
                data: {},
            });
        }
    }
};

exports.login = async (req, res) => {
    const { email, otp } = req.body;
    const token = await Token.findAll({
        where: {
            token: otp,
        },
        include: {
            model: Utilisateur,
            where: {
                email: email,
            },
        },
    });

    if (token[0] == undefined) {
        return res.status(404).json({
            error: "INVALID TOKEN",
            message: "",
            data: {},
        });
    } else if (token[0].date_expiration < Date.now()) {
        return res.status(404).json({
            error: "EXPIRED TOKEN",
            message: "",
            data: {},
        });
    } else {
        return res.status(200).json({
            error: false,
            data: {
                token: generate_token({
                    email,
                    id_utilisateur: token[0].id_utilisateur,
                }),
            },
            message: "",
        });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        const { email, password, telephone } = req.body;
        if (email == undefined || password == undefined || telephone == undefined) {
            return res.status(404).json({
                error: "EMAIL, PASSWORD OR TELEPHONE NOT FOUND",
                message: "",
                data: {},
            });
        }
        if (!isValidEmail(email)) {
            return res.status(404).json({
                error: "INVALID EMAIL",
                message: "",
                data: {},
            });
        }

        // If it's a first user he is the admin Utilisateur#est_admin=true && Utilisateur#est_valide=true
        // If it's not a first user he is a normal Utilisateur#est_admin=true && Utilisateur#est_valide=false

        let nombre_admin = await Utilisateur.count({
            where: {
                est_admin: true,
            },
        });
        const est_valide = nombre_admin == 0 ? true : false;
        const [user, created] = await Utilisateur.findOrCreate({
            where: {
                email: email,
            },
            defaults: {
                password: hash_password(password),
                telephone: telephone,
                est_admin: true,
                est_valide: est_valide,
            },
        });

        if (created) {
            return res.status(200).json({
                error: false,
                message: est_valide
                    ? "Utilisateur cree avec succes"
                    : "Utilisateur cree avec succes, mais il n'est pas encore valide",
                data: {
                    id_utilisateur: user.id_utilisateur,
                    token: generate_token({
                        email,
                        est_admin: user.est_admin && user.est_valide,
                        id_utilisateur: user.id_utilisateur,
                    }),
                },
            });
        } else {
            user.est_valide = false;
            user.est_admin = true;
            await user.save()
            return res.status(200).json({
                error: false,
                message: "Utilisateur cree avec succes, mais il n'est pas encore valide",
                data: {
                    id_utilisateur: user.id_utilisateur,
                    token: generate_token({
                        email,
                        id_utilisateur: user.id_utilisateur,
                    }),
                },
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
            data: {},
        });
    }

};




exports.validateAdmin = async (req, res) => {
    const { id_utilisateur } = req.params;
    try {
        const {est_admin} = req.auth;

        if(est_admin == false){
            return res.status(403).json({
                error: "FORBIDDEN",
                message: "",
                data: {},
            });
        }

        if (id_utilisateur == undefined) {
            return res.status(404).json({
                error: "ID UTILISATEUR NOT FOUND",
                message: "",
                data: {},
            });
        }
        const user = await Utilisateur.findOne({
            where: {
                id_utilisateur: id_utilisateur,
            },
        });
        if (user == undefined) {
            return res.status(404).json({
                error: "USER NOT FOUND",
                message: "",
                data: {},
            });
        }
        user.est_valide = true;
        await user.save();
        return res.status(200).json({
            error: false,
            message: "Utilisateur valide avec succes",
            data: {},
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
            data: {},
        });
    }
}

exports.loginAdmin = async (req, res)=>{
    const {email, password} = req.body;
   try{

    const user = await Utilisateur.findOne({
        where: {
            email: email,
            password: password,
        }
    });

    if(user == undefined){
        return res.status(404).json({
            error: "USER NOT FOUND",
            message: "",
            data: {},
        });
    }
    if(user.est_valide == false){
        return res.status(404).json({
            error: "USER NOT VALID",
            message: "",
            data: {},
        });
    }
    if(user.est_admin == false){
        return res.status(404).json({
            error: "USER NOT ADMIN",
            message: "",
            data: {},
        });
    }
    return res.status(200).json({
        error: false,
        message: "Utilisateur connecte avec succes",
        data: {
            id_utilisateur: user.id_utilisateur,
            token: generate_token({
                email,
                est_admin: user.est_admin && user.est_valide,
                id_utilisateur: user.id_utilisateur,
            }),
        },
    });

   }catch(e){
        return res.status(500).json({
            error: true,
            message: e.message,
            data: {},
        });
    }
   
}

