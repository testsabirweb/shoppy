import React from 'react'
import { StyleSheet, Text, FlatList } from 'react-native'

import { useSelector } from 'react-redux'

const ProductsOverviewScreen = (props) => {
    const products = useSelector((state) => state.products.availableProducts)

    return (
        <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={(itemData) => {
                return (
                    <Text>{itemData.item.title}</Text>
                )
            }}
        />
    )
}

ProductsOverviewScreen.navigationOptions = {
    headerTitle='All Products'
}

const styles = StyleSheet.create({

})

export default ProductsOverviewScreen