import CartItem from '../../models/cartItem'
import { ADD_TO_CART } from '../actions/cart';

const initialState = {
    items: {},
    totalAmount: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product
            const productPrice = addedProduct.price
            const productTitle = addedProduct.title
            let newOrUpdatedCartItem;

            if (state.items[addedProduct.id]) {
                // product already exist
                newOrUpdatedCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    state.items[addedProduct.id].sum + productPrice
                )
                return {
                    ...state,
                    items: {
                        ...state.items,
                        [addedProduct.id]: newOrUpdatedCartItem///this will create a property within an object dynamically
                    },
                    totalAmount: state.totalAmount + productPrice
                }
            }
            else {//product added to the cart for the first time
                newOrUpdatedCartItem = new CartItem(1, productPrice, productTitle, productPrice)
                return {
                    ...state,
                    items: { ...state.items, [addedProduct.id]: newOrUpdatedCartItem },
                    totalAmount: state.totalAmount + productPrice
                }
            }
    }
    return state
}