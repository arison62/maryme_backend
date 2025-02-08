const express = require("express");
const { generate_otp } = require("./src/utils/generate_token");
const isValidEmail = require("./src/utils/email_check");
const { send_otp } = require("./src/utils/send_mail");

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get("*", (req, res)=>{
    res.end("Hello world")
});

app.post("/user/create", (req, res)=>{
    const {email} = req.body
    console.log(req.body);
    if(isValidEmail(email) ){
        const otp = generate_otp();

        console.log(otp)
        send_otp(email, otp).then((info)=>{
            res.status(200).json({message: "success", info, otp})
        })
    }else{
        res.status(400).json({message: "invalid email"})
    }
});

module.exports = app