const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Declaration = require("./declaration");

class Oppostion extends Model {}

Oppostion.init({
    id_oppostion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_declaration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Declaration,
            key: "id_declaration"
        }
    },
    date_oppostion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    motif: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Oppostion",
    tableName: "Oppostions",
    timestamps: true
})

Oppostion.Declaration = Oppostion.belongsTo(Declaration, {foreignKey: "id_declaration"});
Declaration.Oppostion = Declaration.hasMany(Oppostion, {foreignKey: "id_declaration"});

(async () => {
    await Oppostion.sync();
})();

module.exports = Oppostion;