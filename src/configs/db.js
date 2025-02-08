const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";
let sequelize = null;

if (!isProduction) {
    const db_host = process.env.DB_HOST
    const db_name = process.env.DB_NAME
    const db_user = process.env.DB_USER
    const db_password = process.env.DB_PASSWORD


    sequelize = new Sequelize(
        db_name,
        db_user,
        db_password,
        {
            host: db_host,
            dialect: "mysql",
        });


}else{
    console.log(process.env.POSTGRE_URI)
    sequelize = new Sequelize(process.env.POSTGRE_URI);
}


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

module.exports = { dbConnect, dbDisconnect, sequelize };