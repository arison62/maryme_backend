const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Celebrant = require("./celebrant");
const  Epoux = require("./epoux");
const Epouse = require("./epouse");
const Commune = require("./commune");
const Utilisateur = require("./utilisateur");



class Declaration extends Model {}
Declaration.init({
    id_declaration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Utilisateur,
            key: "id_utilisateur"
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "en_attente",
        validate: {
            isIn:[
                ["en_attente", "accepte", "refuse"]
            ]
        }
    },

    date_declaration: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    date_celebration: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_celebrant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Celebrant,
            key: "id_celebrant"
        }
    },
    id_epoux: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Epoux,
            key: "id_epoux"
        }
    },

    id_commune: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Commune,
            key: "id_commune"
        }
    },
    id_epouse: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Epouse,
            key: "id_epouse"
        }
    }
}, {
    sequelize,
    modelName: "Declaration",
    tableName: "Declarations",
    timestamps: true
});
Declaration.Utilisateur = Declaration.belongsTo(Utilisateur, {foreignKey: "id_utilisateur"});
Utilisateur.Declaration = Utilisateur.hasMany(Declaration, {foreignKey: "id_utilisateur"});
Declaration.Celebrant = Declaration.belongsTo(Celebrant, {foreignKey: "id_celebrant"});
Celebrant.Declaration = Celebrant.hasMany(Declaration, {foreignKey: "id_celebrant"});
Declaration.Epoux = Declaration.belongsTo(Epoux, {foreignKey: "id_epoux"});
Epoux.Declaration = Epoux.hasMany(Declaration, {foreignKey: "id_epoux"});
Declaration.Epouse = Declaration.belongsTo(Epouse, {foreignKey: "id_epouse"});
Epouse.Declaration = Epouse.hasOne(Declaration, {foreignKey: "id_epouse"});
Declaration.Commune = Declaration.belongsTo(Commune, {foreignKey: "id_commune"});
Commune.Declaration = Commune.hasMany(Declaration, {foreignKey: "id_commune"});

(async () => {
    await Declaration.sync();
})();

module.exports = Declaration