const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/utilisateur.route");


const app = express()
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    console.log(req.headers.origin)
    next();
});
  
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/user/auth", userRouter)

module.exports = app