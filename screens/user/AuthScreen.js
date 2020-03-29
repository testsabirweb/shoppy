import React, { useReducer, useEffect, useCallback, useState } from 'react'
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Button,
    ActivityIndicator,
    Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'

import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value//creating key dynamically
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid//creating key dynamically
        }
        let updatedFormIsValid = true
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            ...state,
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        }
    }
    return state
}

const AuthScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const [isSignup, setIsSignup] = useState(false)
    const dispatch = useDispatch()

    const initialState = {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    }

    const [formState, dispatchFormState] = useReducer(formReducer, initialState)

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occured', error, [{ text: 'OK' }])
        }
    }, [error])

    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = authActions.signup(
                formState.inputValues.email,
                formState.inputValues.password
            )
        }
        else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            )
        }
        setIsLoading(true)
        setError(null)
        try {
            await dispatch(action)
            // props.navigation.navigate('Shop')
            //now navigaiton is not needed only by dispatching action we set isAuth to true so then it renders ShopNavigator 
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
        }
        // setIsLoading(false)//cant perform a React state update on a unmounted component
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={['#ffffff', '#e6ffff', '#ccffff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-mail"
                            keyboardType="email-address"
                            required//not a in built function see Input.js for reference
                            email//not a in built function see Input.js for reference
                            autoCapitalize="none"
                            errorText="please enter a valid email address"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />

                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required//not a in built function see Input.js for reference
                            minLength={5}//not a in built function see Input.js for reference
                            autoCapitalize="none"
                            errorText="please enter a valid password of minimun 5 characters"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ?
                                <ActivityIndicator
                                    size='small'
                                    color={Colors.primary}
                                /> :
                                <Button
                                    title={isSignup ? 'Sign Up' : 'Login'}
                                    color={Colors.primary}
                                    onPress={authHandler}
                                />
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                color={Colors.accent}
                                onPress={() => {
                                    setIsSignup(prevState => !prevState)
                                }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

export const authScreenOptions = {
    headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,

    },
    authContainer: {
        width: "80%",
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        overflow: "hidden"
    }
})

export default AuthScreen