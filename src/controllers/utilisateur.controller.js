const jwt = require("jsonwebtoken");

const Utilisateur = require("../models/utilisateur");
const Token = require("../models/token");

const isValidEmail = require("../utils/email_check");
const { generate_password, generate_otp } = require("../utils/generate_otp");
const { send_otp } = require("../utils/send_mail");
const { Op } = require("sequelize");
const { generate_token } = require("../utils/jwt_utils");



exports.requestToken = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    if (!isValidEmail(email)) {
        return res.status(404).json(
            {
                error: "INVALID EMAIL",
                message: "",
                data: {}
            }
        );
    } else {
        const [user, created] = await Utilisateur.findOrCreate({
            where: {
                email: email
            },
            defaults: {
                password: generate_password()
            }
        });

        const otp = generate_otp()
        const token = await Token.create({
            id_utilisateur: user.id_utilisateur,
            token: otp,
            date_expiration: Date.now() + (5 * 60 * 1000)
        })

        const infos = await send_otp(email, otp);
        if(infos == undefined){
            return res.status(500).json({
                error : "INTERNAL ERROR",
                message: "",
                data: {}
            });
        }else{
            return res.status(200).json({
                error: false,
                message: "Token envoye a votre adresse mail",
                data: {}
            });
        }
    }

}

exports.login = async (req, res) => {
    const {email, otp} = req.body;
    const token = await Token.findAll({
        where: {
            token: otp,
        },
        include: {
            model: Utilisateur,
            where: {
                email: email
            }
        }
    });

    if(token[0] == undefined){
        return res.status(404).json({
            error: "INVALID TOKEN",
            message: "",
            data: {}
        });
    } else if (token[0].date_expiration < Date.now()){
        return res.status(404).json({
            error: "EXPIRED TOKEN",
            message: "",
            data: {}
        });
    } else{
        return res.status(200).json({
            error: false,
            data: {
                token: generate_token({
                    email,
                    id_utilisateur: token[0].id_utilisateur
                })
            },
            message: ""
        })
    }
}

