const jwt = require("jsonwebtoken");

const Utilisateur = require("../models/utilisateur");
const Token = require("../models/token");

const isValidEmail = require("../utils/email_check");
const { generate_password, generate_otp } = require("../utils/generate_credentials");
const { send_otp } = require("../utils/send_mail");
const { Op } = require("sequelize");
const { generate_token } = require("../utils/jwt_utils");



exports.requestToken = async (req, res) => {
    const { email } = req.body;
    if (!isValidEmail(email)) {
        return res.status(404).json(
            {
                error: "INVALID EMAIL"
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
                description: ""
            });
        }else{
            return res.status(200).json({
                success: true,
                description: "Token envoye a votre adresse mail"
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
            description: ""
        });
    } else if (token[0].date_expiration < Date.now()){
        return res.status(404).json({
            error: "EXPIRED TOKEN",
            description: ""
        });
    } else{
        return res.status(200).json({
            success: true,
            data: {
                token: generate_token({
                    email
                })
            }
        })
    }
}

