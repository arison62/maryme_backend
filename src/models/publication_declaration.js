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

// Définir l'association dans les deux sens
Declaration.hasOne(PublicationDeclaration, {foreignKey: "id_declaration"});
PublicationDeclaration.belongsTo(Declaration, {foreignKey: "id_declaration"});

(async () => {
  await PublicationDeclaration.sync();
})();

module.exports = PublicationDeclaration;