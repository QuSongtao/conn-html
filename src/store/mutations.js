import * as types from './mutation_types'

export default {
  // 改变当前主题id
  [types.CONTENT_TITLTE] (state, id) {
    console.log(id)
    state.conntent_titlte = id
  }
}
