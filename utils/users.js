// Массив для хранения пользователей (вместо БД)
const users = []

// Присоединение пользователя к чату
function userJoin(id, username, room) {
  const user = { id, username, room }
  users.push(user)
  return user
}

// Текущий пользователь
function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

// Пользователь покидает чат
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

// Получение всех пользователей чата
function getRoomUsers(room) {
  return users.filter((user) => user.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
}
