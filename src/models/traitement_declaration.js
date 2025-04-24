const { sequelize } = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
const Declaration = require("./declaration");
const OfficierEtatCivil = require("./officier_etat_civil");

class TraitementDeclaration extends Model {}

TraitementDeclaration.init(
  {
    id_traitement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_declaration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Declaration,
        key: "id_declaration",
      },
    },
    id_officier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OfficierEtatCivil,
        key: "id_officier",
      },
    },
    date_traitement: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "en_attente",
      validate: {
        isIn: [["en_attente", "accepte", "refuse"]],
      },
    },
    
    prevStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "en_attente",
      validate: {
        isIn: [["en_attente", "accepte", "refuse"]],
      },
    },
  },
  {
    sequelize,
    modelName: "TraitementDeclaration",
    tableName: "TraitementDeclarations",
    timestamps: true,
  }
);

Declaration.TraitementDeclaration = Declaration.hasOne(TraitementDeclaration, {
  foreignKey: "id_declaration",
});
TraitementDeclaration.Declaration = TraitementDeclaration.belongsTo(
  Declaration,
  { foreignKey: "id_declaration" }
);
OfficierEtatCivil.TraitementDeclaration = OfficierEtatCivil.hasMany(
  TraitementDeclaration,
  { foreignKey: "id_officier" }
);
TraitementDeclaration.OfficierEtatCivil = TraitementDeclaration.belongsTo(
  OfficierEtatCivil,
  { foreignKey: "id_officier" }
);

(async () => {
  await TraitementDeclaration.sync();
})();

module.exports = TraitementDeclaration;
