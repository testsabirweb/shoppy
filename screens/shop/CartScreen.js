import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem'
import * as cartActions from '../../store/actions/cart'
import * as ordersActions from '../../store/actions/orders'
import Card from '../../components/UI/Card'

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            });
        }
        return transformedCartItems.sort((a, b) =>
            a.productId > b.productId ? 1 : -1
        );
    });
    const dispatch = useDispatch()

    const sendOrderHandler = async () => {
        setError(null)
        setIsLoading(true)
        try {
            await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))
        } catch (err) {
            setError(err.message)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured!',
                error,
                [{ text: 'Ok' }]
            )
        }
    }, [error])

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amount}>{Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text>
                </Text>
                {isLoading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                    </View>
                ) : (
                        <Button
                            color={Colors.accent}
                            title="Order Now"
                            disabled={cartItems.length === 0}
                            onPress={sendOrderHandler}
                        />
                    )}
            </Card>
            <FlatList
                data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={itemData =>
                    <CartItem
                        quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        deletable={true}
                        onRemove={() => {
                            dispatch(cartActions.removeFromCart(itemData.item.productId))
                        }}
                    />
                }
            />
        </View>
    );
};

export const cartScreenOptions = {
    headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    }
});

export default CartScreen;
