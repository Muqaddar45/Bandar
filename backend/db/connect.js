const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config({path:"./../config.env"});

mongoose.connect(process.env.DATABASE).then(data => {
    console.log("Database connected");
}).catch(err => {
    console.log(err);
});