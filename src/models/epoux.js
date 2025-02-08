const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");

class Epoux extends Model {}
Epoux.init({
    id_epoux: {
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
    date_naissance: {
        type: DataTypes.DATE,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: "Epoux",
    tableName: "Epoux",
    timestamps: true
});

(async () => {
    await Epoux.sync();
})();

module.exports = Epoux;