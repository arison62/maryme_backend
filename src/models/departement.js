const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Region = require("./region");

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
    id_Region: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Region,
            key: "id_Region"
        }
    }
}, {
    sequelize,
    modelName: "Departement",
    tableName: "Departements",
    timestamps: true
});

Departement.Region = Departement.belongsTo(Region, {foreignKey: "id_Region"});
Region.Departement = Region.hasMany(Departement, {foreignKey: "id_Region"});

(async () => {
    await Departement.sync();
})();

module.exports = Departement
