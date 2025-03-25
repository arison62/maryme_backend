const {sequelize} = require("../configs/db");
const {DataTypes, Model, } = require("sequelize");

class Region extends Model{}
Region.init({
    id_region: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Region",
    tableName: "Regions",
    timestamps: true
});

(async () => {
    await Region.sync();
})();

module.exports = Region