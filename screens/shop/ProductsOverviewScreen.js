import React, { useState, useEffect, useCallback } from 'react'
import { FlatList, Platform, Button, ActivityIndicator, View, StyleSheet, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import * as productActions from '../../store/actions/product'
import HeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constants/Colors'

const ProductsOverviewScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const products = useSelector((state) => state.products.availableProducts)
    const dispatch = useDispatch()

    const loadProducts = useCallback(async () => {
        setError(null)
        setIsLoading(true)
        try {
            await dispatch(productActions.fetchProducts())
        } catch (err) {
            setError(err.message)
        }
        setIsLoading(false)
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        loadProducts()
    }, [dispatch])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        })
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found,Maybe start adding some in the admin pannel</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An Error occured</Text>
                <Button
                    title="Try Again"
                    color={Colors.primary}
                    onPress={loadProducts}
                />
            </View>
        )
    }

    return (
        <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={(itemData) => {
                return (
                    <ProductItem
                        image={itemData.item.imageUrl}
                        price={itemData.item.price}
                        title={itemData.item.title}
                        onSelect={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title)
                        }}
                    >
                        <Button color={Colors.primary}
                            title='View Details'
                            onPress={() => {
                                selectItemHandler(itemData.item.id, itemData.item.title)
                            }}
                        />
                        <Button color={Colors.primary}
                            title='To Cart'
                            onPress={() => {
                                dispatch(cartActions.addToCart(itemData.item))
                            }}
                        />
                    </ProductItem>
                )
            }}
        />
    )
}

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft: (
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
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="cart"
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default ProductsOverviewScreen