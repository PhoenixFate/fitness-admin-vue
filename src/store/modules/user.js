export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    username: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateUsername (state, name) {
      state.username = name
    },
    updateName (state, name) {
      state.name = name
    }
  }
}
