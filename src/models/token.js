const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Utilisateur = require("./utilisateur");

class Token extends Model {}

Token.init({
    id_token: {
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
    date_expiration: {
        type: DataTypes.DATE,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Token",
    tableName: "Tokens",
    timestamps: true
})

Token.Utilisateur = Token.belongsTo(Utilisateur, {foreignKey: "id_utilisateur"});
Utilisateur.Token = Utilisateur.hasMany(Token, {foreignKey: "id_utilisateur"});

(async () => {
    await Token.sync();
})();

module.exports = Token;