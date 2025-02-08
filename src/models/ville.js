const {sequelize} = require("../configs/db");
const {DataTypes, Model, } = require("sequelize");

class Ville extends Model{}
Ville.init({
    id_ville: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Ville",
    tableName: "Villes",
    timestamps: true
});

(async () => {
    await Ville.sync();
})();

module.exports = Ville