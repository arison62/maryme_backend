const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/utilisateur.route");


const allowedOrigins = [
    "http://localhost:3000",  // Dev
    "https://maryme.onrender.com" // Prod
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // ✅ Renvoie l'origine au lieu de `true`
        } else {
            callback(new Error("CORS non autorisé"));
        }
    },
    credentials: true, // ✅ Important pour les cookies et JWT
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Vérifie bien cette casse
};




const app = express()
app.use(cors(corsOptions));



app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/user/auth", userRouter)

module.exports = app