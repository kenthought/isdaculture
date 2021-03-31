import { combineReducers } from "redux";
import { USER_POND_STATE_CHANGE, USER_STATE_CHANGE, USER_HISTORY_STATE_CHANGE } from "./constants";

const initialState = {
    currentUser: null,
    ponds: [],
    fluctuation: []
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POND_STATE_CHANGE:
            return {
                ...state,
                ponds: action.ponds
            }
        case USER_HISTORY_STATE_CHANGE:
            return {
                ...state,
                fluctuation: action.fluctuation
            }
        default:
            return state
    }
}

export const Reducers = combineReducers({
    userState: user
})

export default Reducers