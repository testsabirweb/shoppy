import React, {
    useEffect,
    useCallback,
    useReducer//this is not a reducer of redux store 
    //it is just used to manage state which are related to each other
} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    ScrollView,
    Platform,
    Alert
} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'

import HeaderButton from '../../components/UI/HeaderButton'
import * as productActions from '../../store/actions/product'

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

    const textChangeHandler = (inputIdentifier, text) => {//text will be received automatically by react
        let isValid = false
        if (text.trim().length > 0) {
            isValid = true
        }
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: text,
            isValid: isValid,
            input: inputIdentifier
        })
    }

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input',
                'Please check the error in the form',
                [{ text: 'Okay' }])
            return;
        }
        if (editedProduct) {
            dispatch(
                productActions.updateProduct(
                    prodId,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl
                )
            )
        } else {
            dispatch(
                productActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price///+ sign is just for handling float type
                )
            )
        }
        props.navigation.goBack()
    }, [dispatch, prodId, formState])

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler })
    }, [submitHandler])

    return (
        <ScrollView style={styles.form}>
            <View style={styles.formControl}>
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input}
                    value={formState.inputValues.title}
                    onChangeText={textChangeHandler.bind(this, 'title')}//we dont need to pass text explicitly
                    //because it will be passed by react Eventhandler automatically as the last argument 
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect={false}
                    returnKeyType='next'
                />
                {!formState.inputValidities.title && <Text>please enter a valid input</Text>}
            </View>
            <View style={styles.formControl}>
                <Text style={styles.label}>Image URL</Text>
                <TextInput style={styles.input}
                    value={formState.inputValues.imageUrl}
                    onChangeText={textChangeHandler.bind(this, 'imageUrl')}//we dont need to pass text explicitly
                //because it will be passed by react Eventhandler automatically as the last argument
                />
            </View>
            {editedProduct ? null : (
                <View style={styles.formControl}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput style={styles.input}
                        value={formState.inputValues.price}
                        onChangeText={textChangeHandler.bind(this, 'price')}//we dont need to pass text explicitly
                        //because it will be passed by react Eventhandler automatically as the last argument
                        keyboardType='decimal-pad'
                    />
                </View>)
            }
            <View style={styles.formControl}>
                <Text style={styles.label}>Description</Text>
                <TextInput style={styles.input}
                    value={formState.inputValues.description}
                    onChangeText={textChangeHandler.bind(this, 'description')}//we dont need to pass text explicitly
                //because it will be passed by react Eventhandler automatically as the last argument
                />
            </View>
        </ScrollView>
    )
}

EditProductScreen.navigationOptions = (navData) => {
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
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
})

export default EditProductScreen