const {sequelize} = require("../configs/db");
const {DataTypes, Model} = require("sequelize");
const Declaration = require("./declaration");

class Message extends Model {}
Message.init({
    id_message: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    date_envoi: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    contenu: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type_message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_declaration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Declaration,
            key: "id_declaration"
        }
    }
}, {
    sequelize,
    modelName: "Message",
    tableName: "Messages",
    timestamps: true
})

Message.Declaration = Message.belongsTo(Declaration, {foreignKey: "id_declaration"});
Declaration.Message = Declaration.hasMany(Message, {foreignKey: "id_declaration"});

(async () => {
    await Message.sync();
})();

module.exports = Message;