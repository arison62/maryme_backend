const bcrypt = require('bcryptjs');

function generate_password(length = 7) {
    let result = '';

    /**
     * base58check characters
     */
    const characters = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generate_otp(length = 6) {
    let result = '';

    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const hash_password = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

const compare_password = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}


module.exports = { generate_password, generate_otp, hash_password, compare_password };

