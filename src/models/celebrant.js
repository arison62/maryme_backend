const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");

class Celebrant extends Model{}

Celebrant.init({
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
    tableName: "Celebrants",
    modelName: "Celebrant",
    timestamps: true
});

(async () => {
    await Celebrant.sync();
})();

module.exports = Celebrant