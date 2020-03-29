import React, {
    useState,
    useEffect,
    useCallback,
    useReducer//this is not a reducer of redux store 
    //it is just used to manage state which are related to each other
} from 'react'
import {
    StyleSheet,
    ScrollView,
    Platform,
    Alert,
    KeyboardAvoidingView,
    ActivityIndicator,
    View
} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'

import HeaderButton from '../../components/UI/HeaderButton'
import * as productActions from '../../store/actions/product'
import Input from '../../components/UI/Input'
import Colors from '../../constants/Colors';

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

const EditProductScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const prodId = props.navigation.getParam('productId')
    const editedProduct = useSelector((state) => {
        return (state.products.userProducts.find(prod => prod.id === prodId))
    })

    const dispatch = useDispatch()

    const initialState = {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    }
    const [formState, dispatchFormState] = useReducer(formReducer, initialState)

    // const textChangeHandler = (inputIdentifier, text) => {//text will be received automatically by react
    //     let isValid = false
    //     if (text.trim().length > 0) {
    //         isValid = true
    //     }
    //     dispatchFormState({
    //         type: FORM_INPUT_UPDATE,
    //         value: text,
    //         isValid: isValid,
    //         input: inputIdentifier
    //     })
    // }
    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input',
                'Please check the error in the form',
                [{ text: 'Okay' }])
            return;
        }
        setError(null)
        setIsLoading(true)
        try {
            if (editedProduct) {
                await dispatch(
                    productActions.updateProduct(
                        prodId,
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl
                    )
                )
            } else {
                await dispatch(
                    productActions.createProduct(
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl,
                        +formState.inputValues.price///+ sign is just for handling float type
                    )
                )
            }
            props.navigation.goBack()
        } catch (err) {
            setError(err.message)
        }
        setIsLoading(false)
        // props.navigation.goBack()
    }, [dispatch, prodId, formState])

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler })
    }, [submitHandler])

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured!',
                error,
                [{ text: 'Ok' }]
            )
        }
    }, [error])

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={100}
        >
            <ScrollView style={styles.form}>
                <Input
                    id='title'
                    label='Title'
                    errorText='please enter a valid title'
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.title : ''}
                    initiallyValid={!!editedProduct}
                    required
                />
                <Input
                    id='imageUrl'
                    label='Image URL'
                    errorText='please enter a valid image url'
                    keyboardType='default'
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.imageUrl : ''}
                    initiallyValid={!!editedProduct}
                    required//it is not built in fun it is a prop see Input.js
                />
                {editedProduct ? null : (
                    <Input
                        id='price'
                        label='Price'
                        errorText='please enter a valid price'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1}//it is not built in fun it is a prop see Input.js
                    />)
                }
                <Input
                    id='description'
                    label='Description'
                    errorText='please enter a valid description'
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect
                    multiline
                    numberOfLines={3}
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.description : ''}
                    initiallyValid={!!editedProduct}
                    required
                    minLength={5}//it is not built in fun it is a prop see Input.js
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export const editProductScreenOptions = (navData) => {
    const submitFn = navData.navigation.getParam('submit')
    return {
        headerTitle: navData.navigation.getParam('prductId') ? 'Edit Product' : 'Add Product',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Save"
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    }
})

export default EditProductScreen