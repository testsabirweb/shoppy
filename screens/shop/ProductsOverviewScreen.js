import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import productsReducer from '../../store/reducers'

const rootReducer = combineReducers({
    products: productsReducer
})

const store = createStore(rootReducer)

const ProductsOverviewScreen = (props) => {
    return (
        <Provider store={store}>
            <View></View>
        </Provider>
    )
}

const styles = StyleSheet.create({

})

export default ProductsOverviewScreen