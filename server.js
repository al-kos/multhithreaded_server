const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  console.log('New Client connected')

  socket.emit('message', 'The message to client')

  socket.broadcast.emit('message', 'For all clients whithout currently')

  socket.on('disconnect', () => {
    io.emit('message', 'Client disconnect')
  })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
