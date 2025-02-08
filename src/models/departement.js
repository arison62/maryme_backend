const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Ville = require("./ville");

class Departement extends Model {}
Departement.init({
    id_departement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_ville: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ville,
            key: "id_ville"
        }
    }
}, {
    sequelize,
    modelName: "Departement",
    tableName: "Departements",
    timestamps: true
});

Departement.Ville = Departement.belongsTo(Ville, {foreignKey: "id_ville"});
Ville.Departement = Ville.hasMany(Departement, {foreignKey: "id_ville"});

(async () => {
    await Departement.sync();
})();

module.exports = Departement
