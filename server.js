const express = require('express')
const socketio = require('socket.io')

const app = express()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
