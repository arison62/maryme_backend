const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/utilisateur.route");
const declarationRouter = require("./routes/declaration.route");
const regionRouter = require("./routes/region.route");
const communeRouter = require("./routes/commune.route");
const officierRouter = require("./routes/officier.route");

// Configuration détaillée des options CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'https://maryme.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // Cache préflight pendant 24 heures
};

// Appliquer la configuration CORS
app.use(cors(corsOptions));

// Middleware pour les en-têtes personnalisés
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user/auth", userRouter);
app.use("/declaration", declarationRouter);
app.use("/officier", officierRouter);

app.use(regionRouter);
app.use(communeRouter);


app.use((req, res, next) => {
  res.status(404).json({
    error: true,
    message: "Route not found",
    data: {},
  });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: "Internal Server Error",
    data: {},
  });
});

module.exports = app;