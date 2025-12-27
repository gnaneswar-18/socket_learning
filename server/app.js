import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
const port = 8080;
const app = express();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.get('/', (req, res) => {
    res.send("hello");
})

io.on("connection", (socket) => {
    console.log("user connected",socket.id);
    //  socket.emit("event",`welcome to server room ${socket.id}`);
    //  socket.broadcast.emit("event",`${socket.id} joined the server`);
   socket.on("message",({msg,room})=>{
    io.to(room).emit("receive-message",msg);
    // io.emit("receive-message",data)
    //  socket.broadcast.emit("receive-message",data);
   })
   socket.on("join-room",(data)=>{
     socket.join(data);
   })
    socket.on("disconnect", () => {
        console.log(`${socket.id} user disconnected`);
    })

})
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
}) 