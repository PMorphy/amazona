import { createContext, useReducer } from 'react';

const initialState = {
  cart: {
    cartItems: []
  }
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'CART_ADD_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, payload]
        }
      };
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
