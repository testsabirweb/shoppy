import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    ScrollView,
    Button
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart'

const ProductDetailScreen = (props) => {
    const dispatch = useDispatch()
    const productId = props.route.params.productId
    const selectedProduct = useSelector((state) => {
        return state.products.availableProducts.find(prod => prod.id === productId)
    })
    return (
        <ScrollView >
            <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
            <View style={styles.actions}>
                <Button color={Colors.primary} title="Add to Cart" onPress={() => {
                    dispatch(cartActions.addToCart(selectedProduct))
                }} />
            </View>
            <Text style={styles.price}>{selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description} </Text>
        </ScrollView>
    )
}
export const productDetailScreenOptions = (navData) => {
    return {
        headerTitle: navData.route.params.productTitle
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 10,
        alignItems: "center"
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: "center",
        marginVertical: 20,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontSize: 14,
        textAlign: "center",
        marginHorizontal: 20,
        fontFamily: 'open-sans'
    }
})

export default ProductDetailScreen