const TokenKey = 'admin'

export function getUser() {
  return localStorage.getItem(TokenKey)
}

export function setUser(info) {
  return localStorage.setItem(TokenKey, info)
}

export function removeUser() {
  return localStorage.removeItem(TokenKey)
}
