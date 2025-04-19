const {verify_token} = require("../utils/jwt_utils");

exports.authMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;
    
    if(!authorization){
        return res.status(401).json({
            error: true,
            message: "NO TOKEN PROVIDED",
            data: {}
        });
    }
    const token = authorization.split(" ")[1];
    const {decoded, error} = verify_token(token);
    if(error){
        console.log(decoded)
        return res.status(401).json({
            error: true,
            message: error.message,
            data: {}
        });
    }else{
        req.auth = decoded;
        next();
    }
    
}