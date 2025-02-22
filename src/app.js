const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/utilisateur.route");

const allowedOrigins = [
    "http://localhost:3000",  // Pour le développement en local
    "https://maryme.onrender.com" // Pour la production
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false)
        }
    },
    credentials: true, // Autorise l'envoi des cookies et tokens
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Ajoute les headers nécessaires
};





const app = express()

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // ✅ Répond immédiatement aux preflight requests
    }

    next();
});


app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/user/auth", userRouter)

module.exports = app