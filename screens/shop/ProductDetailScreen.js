import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native'
import { useSelector } from 'react-redux'


const ProductDetailScreen = (props) => {
    const productId = props.navigation.getParam('productId')
    const selectedProduct = useSelector((state) => {
        return state.products.availableProducts.find(prod => prod.id === productId)
    })
    return (
        <View>
            <Text>{selectedProduct.title}</Text>
        </View>
    )
}
ProductDetailScreen.navigationOptions = (navData) => {
    return {
        headerTitle: navData.navigation.getParam('productTitle')
    }
}

const styles = StyleSheet.create({

})

export default ProductDetailScreen