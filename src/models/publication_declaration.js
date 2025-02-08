const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const BancPublication = require("./banc_publication");
const Declaration = require("./declaration");

class PublicationDeclaration extends Model {}

PublicationDeclaration.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_banc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: BancPublication,
            key: "id_banc"
        }
    },
    date_publication: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    id_declaration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Declaration,
            key: "id_declaration"
        }
    },
}, {
    sequelize,
    modelName: "PublicationDeclaration",
    tableName: "PublicationDeclarations",
    timestamps: true
});

BancPublication.PublicationDeclaration = BancPublication.hasMany(PublicationDeclaration, {foreignKey: "id_banc"});
Declaration.PublicationDeclaration = Declaration.hasMany(PublicationDeclaration, {foreignKey: "id_declaration"});

(async () => {
    await PublicationDeclaration.sync();
})();

module.exports = PublicationDeclaration

