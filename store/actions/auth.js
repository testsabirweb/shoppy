import * as keys from '../../key'

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            keys.signupKey,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errResData = await response.json()
            const errorId = errResData.error.message
            let message = 'Something Went Wrong!!!'
            if (errorId === 'EMAIL_EXISTS') {
                message = 'Email already exists try SigningIn'
            }
            throw new Error(message)
        }

        const resData = await response.json();
        console.log(resData);
        dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            keys.signinKey,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errResData = await response.json()
            const errorId = errResData.error.message
            let message = 'Something Went Wrong!!!'
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found try SigningUp first'
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'The password is invalid'
            }
            throw new Error(message)
        }

        const resData = await response.json();
        console.log(resData);
        dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
    };
};
