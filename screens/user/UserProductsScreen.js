import React, {
    useState,
    useEffect,
    useCallback,
} from 'react'
import {
    FlatList,
    Platform,
    Button,
    Alert,
    StyleSheet,
    ActivityIndicator,
    View
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import ProductItem from '../../components/shop/ProductItem'
import Colors from '../../constants/Colors'
import * as productActions from '../../store/actions/product'


const UserProductsScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const userProducts = useSelector(state => state.products.userProducts)
    const dispatch = useDispatch()
    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', { productId: id })
    }
    const deleteHandler = (id) => {
        Alert.alert('Are u sure', 'After Deletion u cannot recover that item', [
            { text: 'No', type: 'default' },
            {
                text: 'Yes',
                type: 'destructive',
                onPress: async () => {
                    setError(null)
                    setIsLoading(true)
                    try {
                        await dispatch(productActions.deleteProduct(id))
                    } catch (err) {
                        setError(err.message)
                    }
                    setIsLoading(false)
                }
            }
        ])
    }

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
        <FlatList
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        editProductHandler(itemData.item.id)
                    }}
                >
                    <Button color={Colors.primary}
                        title='Edit'
                        onPress={() => {
                            editProductHandler(itemData.item.id)
                        }}
                    />
                    <Button color={Colors.primary}
                        title='Delete'
                        onPress={deleteHandler.bind(this, itemData.item.id)}
                    />
                </ProductItem>
            )}
        />
    )
}

UserProductsScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Products',
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
                    title="Add"
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                        navData.navigation.navigate('EditProduct')
                    }}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    }
})

export default UserProductsScreen