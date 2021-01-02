const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  users: state => state.user,
  routes: state => state.routes.routes,
  collapsed: state => state.menu.collapsed
}

export default getters
