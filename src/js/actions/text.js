import { ActionTypes } from '../constants'

export default {
  updateText(params, originalKey) {
    return { type: ActionTypes.UPDATE_TEXT, params, originalKey };
  },

  insertText(params) {
    return { type: ActionTypes.INSERT_TEXT, params };
  },

  removeText(key) {
    return { type: ActionTypes.REMOVE_TEXT, key };
  },

  copyText(key) {
    return { type: ActionTypes.COPY_TEXT, key };
  },

  clearTexts() {
    return { type: ActionTypes.CLEAR_TEXTS }
  },

  importTexts(json) {
    return { type: ActionTypes.IMPORT_TEXTS, json }
  }
};

