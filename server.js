const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

// const cors = require("cors");
// // const express = require("express");
// require("dotenv").config();
// // const bodyParser = require("body-parser");
// // require("./auth/passport");
// // const app = express();

// // var corsOptions = {
// //   origin: "http://localhost:8081",
// // };

// //middleware
// app.use(cors()); //corsOptions
// // app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// //routers
// const router = require("./routes/movieRouter.js");
// app.use("/api", router);

// //testting api
// app.get("/", (req, res) => {
//   res.json({ message: "No Issue Found" });
// });

// //port
// const PORT = process.env.PORT || 8080;

// //server
// app.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`);
// });


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})



server.listen(8080)