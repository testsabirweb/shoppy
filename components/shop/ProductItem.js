import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native'

import Card from '../UI/Card'

const ProductItem = (props) => {
    let TouchableCmp = TouchableOpacity
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }
    return (
        <Card style={styles.product} >
            <View style={styles.touchable}>
                <TouchableCmp onPress={props.onSelect} useForeground>
                    <View>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{ uri: props.image }} />
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.title} >{props.title}</Text>
                            <Text style={styles.price}>{props.price.toFixed(2)}</Text>
                        </View>
                        <View style={styles.actions}>
                            {props.children}
                        </View>
                    </View>
                </TouchableCmp>
            </View>
        </Card>

    )
}

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 20,

    },
    touchable: {
        overflow: "hidden",
        borderRadius: 10
    },
    imageContainer: {
        height: '60%',
        width: '100%',
        overflow: "hidden",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    image: {
        height: '100%',
        width: '100%'
    },
    title: {
        fontSize: 18,
        marginVertical: 2,
        fontFamily: 'open-sans-bold'
    },
    price: {
        fontSize: 14,
        color: '#888',
        fontFamily: 'open-sans'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '23%',
        paddingHorizontal: 20
    },
    details: {
        alignItems: 'center',
        height: '17%',
        padding: 10
    },
})

export default ProductItem