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
    id_region: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Region,
            key: "id_region"
        }
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
  
}, {
    sequelize,
    modelName: "Departement",
    tableName: "Departements",
    timestamps: true
});

Departement.Region = Departement.belongsTo(Region, {foreignKey: "id_region"});
Region.Departement = Region.hasMany(Departement, {foreignKey: "id_region"});

(async () => {
    await Departement.sync();
})();

module.exports = Departement
