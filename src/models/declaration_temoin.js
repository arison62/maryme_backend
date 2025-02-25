const { sequelize } = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
const Temoin = require("./temoin");
const Declaration = require("./declaration");

class DeclarationTemoin extends Model {}

DeclarationTemoin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }
  },
  {
    sequelize,
    modelName: "DeclarationTemoin",
    tableName: "DeclarationTemoins",
    timestamps: false,
  }
);

Temoin.belongsToMany(Declaration, {
  through: DeclarationTemoin,
  foreignKey: "id_temoin",
  otherKey: "id_declaration",
});
Declaration.belongsToMany(Temoin, {
  through: DeclarationTemoin,
  foreignKey: "id_declaration",
  otherKey: "id_temoin",
});

(async () => {
  await DeclarationTemoin.sync();
})();

module.exports = DeclarationTemoin;
