const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");

class Epouse extends Model {}
Epouse.init({
    id_epouse: {
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
    }    
}, {
    sequelize,
    modelName: "Epouse",
    tableName: "Epouses",
    timestamps: true
});

(async () => {
    await Epouse.sync();
})();

module.exports = Epouse