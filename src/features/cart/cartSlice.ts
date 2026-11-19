import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "../../types";
import type { RootState } from "../../app/store";

interface CartState {
  items: CartItem[];
}

interface UpdateQuantityPayload {
  productId: number;
  delta: number;
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(
        (item) => item.product.id === action.payload.id,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
    },
    updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { productId, delta } = action.payload;
      const item = state.items.find(
        (cartItem) => cartItem.product.id === productId,
      );
      if (!item) {
        return;
      }
      item.quantity += delta;
      if (item.quantity <= 0) {
        state.items = state.items.filter(
          (cartItem) => cartItem.product.id !== productId,
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state: RootState): CartItem[] =>
  state.cart.items;

export const selectCartCount = (state: RootState): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: RootState): number => {
  const total = state.cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  return Math.round(total * 100) / 100;
};

export default cartSlice.reducer;
