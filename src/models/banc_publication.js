const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Commune = require("./commune");

class BancPublication extends Model {}
BancPublication.init({
    id_banc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    id_commune: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Commune,
            key: "id_commune"
        }
    }
}, {
    sequelize,
    modelName: "BancPublication",
    tableName: "BancPublications",
    timestamps: true
});

BancPublication.Commune = BancPublication.belongsTo(Commune, {foreignKey: "id_commune"});
Commune.BancPublication = Commune.hasMany(BancPublication, {foreignKey: "id_commune"});
(async () => {
    await BancPublication.sync();
})();
module.exports = BancPublication
