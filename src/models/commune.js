const { sequelize } = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
const Departement = require("./departement");

class Commune extends Model { }

Commune.init({
    id_commune: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_departement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Departement,
            key: "id_departement"
        }
    }
}, {
    sequelize,
    modelName: "Commune",
    tableName: "Communes",
    timestamps: true
});

Commune.Departement = Commune.belongsTo(Departement, { foreignKey: "id_departement" });
Departement.Commune = Departement.hasMany(Commune, { foreignKey: "id_departement" });

(async () => {
    await Commune.sync();
})();

module.exports = Commune;