const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_DURATION='1h';

exports.generate_token = (data)=>{
    let token = jwt.sign(data, SECRET_KEY, {
        expiresIn: TOKEN_DURATION
    });

    return token;
}

exports.verify_token = (token)=>{
    try{
        let decoded = jwt.verify(token, SECRET_KEY);
        return {decoded, error: false}
    } catch(err){
        if(err.name == "TokenExpiredError"){
            return {error: true, message: "TOKEN EXPIRED"}
        }else{
            return {error: true, message: "INVALID TOKEN"}
        }
    }
}

