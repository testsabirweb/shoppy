import CartItem from '../../models/cartItem'
import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/product';

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
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                // need to reduce it, not erase it
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
            } else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.pid];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            };
        /////////////////////////////////
        case ADD_ORDER:         //this reducer also present in order.js
            return initialState //main aim of this reducer is when order is placed successfully
        //the cart is then cleared.   n8 16
        case DELETE_PRODUCT:
            if (!state.items[action.pid]) {
                return state
            }
            const updatedItems = { ...state.items }
            const itemTotal = state.items[action.pid].sum
            delete updatedItems[action.pid]
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
    }
    return state
}