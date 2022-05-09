const expressJwt = require("express-jwt");
const dotenv = require('dotenv');
//dotenv config
dotenv.config({path: "./config.env"});

const checkingUserMiddleware = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});

module.exports.checkingUserMiddleware = checkingUserMiddleware;