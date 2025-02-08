const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");

class Utilisateur extends Model {}
Utilisateur.init({
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
        
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Utilisateur",
    tableName: "Utilisateurs",
    timestamps: true
});

(async () => {
    await Utilisateur.sync();
})();

module.exports = Utilisateur