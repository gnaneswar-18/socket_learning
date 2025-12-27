import { useEffect } from 'react';
import { io } from 'socket.io-client'
import { Container, Typography, TextField, Button, Stack, Box } from '@mui/material'
import { useState } from 'react';
import { useMemo } from 'react';
const App = () => {
  const socket = useMemo(() => io("http://localhost:8080"), []);
  const [msg, setmsg] = useState("");
  const [room, setroom] = useState("");
  const [socketId, setsocketId] = useState();
  const [message, setmessage] = useState([]);
  const [roomname,setroomname]=useState("");

  const handlesubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { msg, room });
    setmsg("");
    // setroom("");
  }
  const handlejoinroom=(e)=>{
    e.preventDefault();
    socket.emit("join-room",roomname);
    setroomname("");
  }
  useEffect(() => {
    socket.on("connect", () => {
      setsocketId(socket.id);
      console.log("connected", socket.id);
    }, [])

    // socket.on("event", (data) => {
    //   console.log(data);
    // })
    socket.on("receive-message", (data) => {
      setmessage((message) => [...message, data])
    })

    return () => {
      socket.disconnect();
    }
  }, [])
  return (
    <Container maxWidth="sm">

      <Box sx={{ height: 200 }}></Box>
      <Typography variant='h3' component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={handlejoinroom}>
        <TextField value={roomname} onChange={e => setroomname(e.target.value)} id="outlined-basic" label="roomname" variant="outlined">
        </TextField>
        
        <Button type='submit' variant="contained" color="primary">join</Button>
      </form>
      <form onSubmit={handlesubmit}>
        <TextField value={msg} onChange={e => setmsg(e.target.value)} id="outlined-basic" label="message" variant="outlined">
        </TextField>
        <TextField value={room} onChange={e => setroom(e.target.value)} id="outlined-basic" label="room" variant="outlined"></TextField>
        <Button type='submit' variant="contained" color="primary">Send</Button>
      </form>
      <Stack>
        {
          message.map((el, i) => (
            <Typography key={i} variant='h6' component="div" gutterBottom>
              {el}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  )
}

export default App
