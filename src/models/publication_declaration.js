const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Declaration = require("./declaration");

class PublicationDeclaration extends Model {}

PublicationDeclaration.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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

Declaration.PublicationDeclaration = Declaration.hasMany(PublicationDeclaration, {foreignKey: "id_declaration"});

(async () => {
    await PublicationDeclaration.sync();
})();

module.exports = PublicationDeclaration

