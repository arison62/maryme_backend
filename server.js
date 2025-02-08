require("dotenv").config({path: [".env"]});

const http = require("http");
const app = require("./src/app");
const {dbConnect, dbDisconnect} = require("./src/configs/db");

dbConnect();

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});



process.on("exit", async (code) => { 
    await dbDisconnect();
    console.log(`Process exited with code ${code}`);
});

process.on("SIGINT", async () => {
    await dbDisconnect();
    console.log("Process received a SIGINT signal");
    process.exit();
})