import { AUTHENTICATE } from "../actions/auth";

const initialState = {
    idToken: null,
    userId: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                idToken: action.idToken,
                userId: action.userId
            }
        // case SIGNUP: {
        //     return {
        //         idToken: action.idToken,
        //         userId: action.userId
        //     }
        // }
        default:
            return state
    }
}