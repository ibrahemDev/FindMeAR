

// ACTION TYPES
import { UPDATE_USER_ID } from '../actionTypes/index'// SELECTOR


export const selectUserID = state => state.userReducer.user_id;// ACTION



const updateUserID = data => ({
  type: UPDATE_USER_ID,
  data: data
})// EXPORTS


export const selectors = {
  selectUserID
}


export const actions = {
  updateUserID
}













