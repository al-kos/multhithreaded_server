const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

console.log(chatForm, roomName, userList)

// Передача информации в URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

const socket = io()

// Присоединение к чату
socket.emit('joinRoom', { username, room })

// Получение комнаты и пользователей
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room)
  outputUsers(users)
})

// Сообщение на сервер
socket.on('message', (message) => {
  console.log(message)
  outputMessage(message)

  // Опустить до последнего сообщения
  chatMessages.scrollTop = chatMessages.scrollHeight
})

// Слушатель отправки сообщения
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let msg = e.target.elements.msg.value
  msg = msg.trim()

  if (!msg) {
    return false
  }

  // Отправка сообщения на сервер
  socket.emit('chatMessage', msg)

  // Очистка поля ввода
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

// Функция для создания блока с сообщением
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  const p = document.createElement('p')
  p.classList.add('meta')
  p.innerText = message.username
  p.innerHTML += `<span>${message.time}</span>`
  div.appendChild(p)
  const para = document.createElement('p')
  para.classList.add('text')
  para.innerText = message.text
  div.appendChild(para)
  document.querySelector('.chat-messages').appendChild(div)
}

// Функция для отображения названия комнаты
function outputRoomName(room) {
  roomName.innerText = room
}

// Функция для отображения списка пользователей
function outputUsers(users) {
  userList.innerHTML = ''
  users.forEach((user) => {
    const li = document.createElement('li')
    li.innerText = user.username
    userList.appendChild(li)
  })
}

// Запрос на подтверждение выхода из чата
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?')
  if (leaveRoom) {
    window.location = '../index.html'
  } else {
  }
})
