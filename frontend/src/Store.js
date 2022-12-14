import { createContext, useReducer } from 'react';

const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : ''
  },
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'CART_ADD_ITEM':
      const itemExists = state.cart.cartItems.find(
        (item) => item._id === payload._id
      );

      const cartItems = itemExists
        ? state.cart.cartItems.map((item) =>
            item._id === itemExists._id ? payload : item
          )
        : [...state.cart.cartItems, payload];

      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== payload._id
      );

      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'USER_SIGN_IN':
      return { ...state, userInfo: payload };

    case 'USER_SIGN_OUT':
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' }
      };

    case 'SAVE_SHIPPING_ADDRESS':
      return { ...state, cart: { ...state.cart, shippingAddress: payload } };

    case 'SAVE_PAYMENT_METHOD':
      return { ...state, cart: { ...state.cart, paymentMethod: payload } };

    default:
      return state;
  }
};

export const Store = createContext();
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
