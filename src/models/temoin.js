const { sequelize } = require("../configs/db");
const { DataTypes, Model } = require("sequelize");

class Temoin extends Model { }

Temoin.init({
    id_temoin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,

    },
  
    telephone: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: "Temoin",
    tableName: "Temoins",
    timestamps: true
});

(async () => {
    await Temoin.sync();
})();

module.exports = Temoin