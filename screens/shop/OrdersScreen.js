import React, {
    useState,
    useEffect,
    useCallback
} from 'react'
import {
    FlatList,
    Platform,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    Button
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import OrderItem from '../../components/shop/OrderItem'
import * as orderActions from '../../store/actions/orders'
import Colors from '../../constants/Colors'

const OrdersScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const orders = useSelector(state => state.orders.orders)
    const dispatch = useDispatch()

    const loadOrders = useCallback(async () => {
        setError(null)
        setIsLoading(true)
        try {
            await dispatch(orderActions.fetchOrders())
        } catch (err) {
            setError(err.message)
        }
        setIsLoading(false)
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {//this is responsible for fetching data when the app refresh
        loadOrders()
    }, [dispatch])
    ////////////////////////////the order of error handling is important in this case 
    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An Error occured</Text>
                <Button
                    title="Try Again"
                    color={Colors.primary}
                    onPress={loadOrders}
                />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    if (!isLoading && orders.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found,Maybe start ordering some!!!</Text>
            </View>
        )
    }
    ////////////////////////////the order of error handling is important in this case 
    return (
        <FlatList
            data={orders}
            keyExtractor={(item => item.id)}
            renderItem={(itemData) => (
                <OrderItem
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}
                />)}
        />
    )
}

export const ordersScreenOptions = navData => {
    return {
        headerTitle: 'Yours Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer()
                    }}
                />
            </HeaderButtons>
        ),
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        fontFamily: 'open-sans',
        padding: 20
    }
})

export default OrdersScreen
