const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";
const postgre_uri = process.env.POSTGRE_URI
let sequelize = null;
if(isProduction){
    sequelize = new Sequelize(postgre_uri, {
        logging: false
    })
}else{
    sequelize = new Sequelize(postgre_uri)
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