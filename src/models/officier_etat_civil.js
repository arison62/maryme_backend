const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Commune = require("./commune");

class OfficiersEtatCivil extends Model {}

OfficiersEtatCivil.init({
    id_officier: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_commune: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Commune,
            key: "id_commune"
        }
    }
}, {
    sequelize,
    modelName: "OfficiersEtatCivil",
    tableName: "OfficiersEtatCivils",
    timestamps: true
})

OfficiersEtatCivil.Commune = OfficiersEtatCivil.belongsTo(Commune, {foreignKey: "id_commune"});
Commune.OfficiersEtatCivil = Commune.hasMany(OfficiersEtatCivil, {foreignKey: "id_commune"});

(async () => {
    await OfficiersEtatCivil.sync();
})();

module.exports = OfficiersEtatCivil