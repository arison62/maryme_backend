const express = require("express");
const userRouter = require("./routes/utilisateur.route");


const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/auth/user", userRouter)

module.exports = app