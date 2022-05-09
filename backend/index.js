const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

//compulsory middlewares
app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended: true}));
//Accept request from this url
app.use(cors({
    origin: "http://localhost:3000"
}));

//dotenv config
dotenv.config({path: "./config.env"});

const PORT = process.env.PORT;//getting port number

//socket.io setting 
const http = require('http').createServer(app);
// //end of socket setting
const io = require('socket.io')(http , {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET" , "POST"],
        allowedHeaders: "Content-type",
    },
});

//router for routing
const userRouter = require('./routes/user');
const postRouter = require("./routes/post");

app.use("/user" , userRouter);
app.use("/post" , postRouter);

io.on("connect" , socket => {
    socket.on("post-like" , like => {
        socket.broadcast.emit("post-like" , like);
    });
    socket.on("post-comment" , comment => {
        socket.broadcast.emit("post-comment" , comment);
    });
})



console.log(`App is listing on PORT number: ${PORT}`);
http.listen(PORT);




