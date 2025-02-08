const { Sequelize } = require("sequelize");

const db_host = process.env.DB_HOST
const db_name = process.env.DB_NAME
const db_user = process.env.DB_USER
const db_password = process.env.DB_PASSWORD


const sequelize = new Sequelize(
    db_name,
    db_user,
    db_password,
    {
        host: db_host,
        dialect: "mysql",
    });


function dbConnect() {
    sequelize
        .authenticate()
        .then(() => {
            console.log("Connection has been established successfully.");
        })
        .catch((error) => {
            console.error("Unable to connect to the database:", error);
        });
}

async function dbDisconnect() {
    sequelize.close();
}

module.exports = {dbConnect, dbDisconnect, sequelize};