const OfficiersEtatCivil = require("../models/officier_etat_civil");
const isValidEmail = require("../utils/email_check");
const { hash_password } = require("../utils/generate_otp");
const { generate_token } = require("../utils/jwt_utils");

exports.createOfficier = async (req, res) => {
  const { nom, prenom, email, password, telephone, id_commune } = req.body;
  if (
    nom == undefined ||
    telephone == undefined ||
    email == undefined ||
    password == undefined ||
    id_commune == undefined
  ) {
    return res.status(404).json({
      error: "NOM, TELEPHONE, EMAIL OR PASSWORD NOT FOUND OR ID_COMMUNE NOT FOUND",
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
  const { est_admin } = req.auth;
  if (!est_admin) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
      data: {},
    });
  }
  try {
    const officier = await OfficiersEtatCivil.create({
      nom: nom,
      prenom: prenom,
      email: email,
      mot_de_passe: hash_password(password),
      telephone: telephone,
      id_commune: id_commune
    });
    return res.status(200).json({
      error: false,
      message: "Officier created successfully",
      data: {
        id_officier: officier.id_officier,
        nom: officier.nom,
        prenom: officier.prenom,
        email: officier.email,
        telephone: officier.telephone,
        token: generate_token({
          email,
          est_officier: true,
          id_officier: officier.id_officier,
        }),
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
      data: {},
    });
  }
};

exports.loginOfficier = async (req, res) => {
  const { email, password } = req.body;
  if (email == undefined || password == undefined) {
    return res.status(404).json({
      error: "EMAIL OR PASSWORD NOT FOUND",
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
  const officier = await OfficiersEtatCivil.findOne({
    where: {
      email: email,
      mot_de_passe: hash_password(password),
    },
  });
  if (officier == null) {
    return res.status(404).json({
      error: true,
      message: "Invalid email or password",
      data: {},
    });
  }
  return res.status(200).json({
    error: false,
    message: "Login successful",
    data: {
      id_officier: officier.id_officier,
      nom: officier.nom,
      prenom: officier.prenom,
      email: officier.email,
      telephone: officier.telephone,
      token: generate_token({
        email,
        est_officier: true,
        id_officier: officier.id_officier,
      }),
    },
  });
};
