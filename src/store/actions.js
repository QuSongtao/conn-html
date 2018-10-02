import * as types from './mutation_types'

export default {
  // 改变当前主题id
  changeCurrentTitle: ({commit}, title) => {
    console.log(title)
    commit(types.CONTENT_TITLTE, title)
  }
}
