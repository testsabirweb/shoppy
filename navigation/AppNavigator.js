import React from 'react'
import { useSelector } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'

import { ProductsNavigator } from './ShopNavigator'

const AppNavigator = (props) => {
    const isAuth = useSelector(state => !!state.auth.idToken)

    return (
        <NavigationContainer>
            <ProductsNavigator />
        </NavigationContainer>
    )
}

export default AppNavigator