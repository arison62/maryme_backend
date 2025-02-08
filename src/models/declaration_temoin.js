const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");

class DeclarationTemoin extends Model {}

DeclarationTemoin.init({
    id: {
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
    id_temoin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Temoin,
            key: "id_temoin"
        }
    }
}, {
    sequelize,
    modelName: "DeclarationTemoin",
    tableName: "DeclarationTemoins",
    timestamps: true
});

DeclarationTemoin.Temoin = DeclarationTemoin.belongsTo(Temoin, {foreignKey: "id_temoin"});
Temoin.DeclarationTemoin = Temoin.hasMany(DeclarationTemoin, {foreignKey: "id_temoin"});
DeclarationTemoin.Declaration = DeclarationTemoin.belongsTo(Declaration, {foreignKey: "id_declaration"});
Declaration.DeclarationTemoin = Declaration.hasMany(DeclarationTemoin, {foreignKey: "id_declaration"});

(async () => {
    await DeclarationTemoin.sync();
})();

module.exports = DeclarationTemoin
        