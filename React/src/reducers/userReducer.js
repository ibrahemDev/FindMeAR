
// todoReducer.js
import { v4 as uuidv4 } from 'uuid';
import { UPDATE_USER_ID } from '../actionTypes'

const user = window._user_

const initialState = {
  user_id: user
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_ID:
      return {
        ...state,
        user_id: action.data.id
      }
    default:
      return state
  }
}
