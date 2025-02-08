const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");

class Temoin extends Model{}

Temoin.init({
    id_celebrant: {
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
        type: DataTypes.STRING
    },
    date_naissance : {
        type: DataTypes.DATE
    },
    telephone: {
        type: DataTypes.STRING
    }
},{
    sequelize,
    tableName: "Temoins",
    modelName: "Temoin",
    timestamps: true
})

(async () => {
    await Temoin.sync();
})();

module.exports = Temoin