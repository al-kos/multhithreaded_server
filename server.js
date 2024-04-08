const path = require('path')
const http = require('http')
require('dotenv').config()
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Статическая папка
app.use(express.static(path.join(__dirname, 'public')))

// Бот-информатор
const botName = 'ChatCord Bot'

// Подключение к комнате
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    // Приветствие, информация о подключении
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

    // Уведомление о присоединении для всех пользователей
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`),
      )

    // Отображение всех пользователей
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    })
  })

  // Слушатель сообщений из чата
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)

    io.to(user.room).emit('message', formatMessage(user.username, msg))
  })

  // Уведомление об отсоединении для всех пользователей
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`),
      )

      // Отображение всех пользователей
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      })
    }
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
