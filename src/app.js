const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/utilisateur.route");


const app = express()
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/user/auth", userRouter)

module.exports = app