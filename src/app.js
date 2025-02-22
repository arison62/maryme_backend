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
        callback(new Error("CORS non autorisé"));
      }
    },
    credentials: true, // Autorise l'envoi des cookies et tokens
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Ajoute les headers nécessaires
  };

  



const app = express()
  
app.use(cors(corsOptions));

  
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/user/auth", userRouter)

module.exports = app