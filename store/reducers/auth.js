import { AUTHENTICATE, LOGOUT, SET_DID_TRY_AUTO_LOGIN } from "../actions/auth";

const initialState = {
    idToken: null,
    userId: null,
    didTryAutoLogin: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                idToken: action.idToken,
                userId: action.userId,
                didTryAutoLogin: true
            }
        case LOGOUT:
            return {
                ...initialState,
                didTryAutoLogin: true
            }
        // case SIGNUP: {
        //     return {
        //         idToken: action.idToken,
        //         userId: action.userId
        //     }
        // }
        case SET_DID_TRY_AUTO_LOGIN:
            return {
                ...state,
                didTryAutoLogin: true
            }
        default:
            return state
    }
}