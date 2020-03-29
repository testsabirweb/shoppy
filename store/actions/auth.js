import { AsyncStorage } from 'react-native'

import * as keys from '../../key'

export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'
export const SET_DID_TRY_AUTO_LOGIN = 'SET_DID_TRY_AUTO_LOGIN'

let timer;

export const authenticate = (userId, idToken, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime))
        dispatch({
            type: AUTHENTICATE,
            userId,
            idToken
        })
    }
}

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
        dispatch(authenticate(
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn) * 1000
        ));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        )
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
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
        dispatch(authenticate(
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn) * 1000
        ));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        )
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    };
};

export const logout = () => {
    return async dispatch => {
        clearLogoutTimer()
        await AsyncStorage.removeItem('userData')
        dispatch({ type: LOGOUT })
    }
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer)//inbuilt function of javascript
    }
}

const setLogoutTimer = (expirationDate) => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout())
        }, expirationDate)
    }
}

const saveDataToStorage = (idToken, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            idToken,
            userId,
            expiryDate: expirationDate.toISOString()
        })
    )
}

export const setDidTryAutoLogin = () => {
    return { type: SET_DID_TRY_AUTO_LOGIN }
}