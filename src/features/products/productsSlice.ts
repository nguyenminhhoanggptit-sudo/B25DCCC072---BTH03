import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import type { RootState } from '../../app/store';

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProductsState {
  items: Product[];
  status: FetchStatus;
  error: string | null;
}

const PRODUCTS_URL = 'https://fakestoreapi.com/products';

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_arg, { rejectWithValue }) => {
    try {
      const response = await fetch(PRODUCTS_URL);
      if (!response.ok) {
        return rejectWithValue(`Không thể tải sản phẩm (mã lỗi ${response.status}).`);
      }
      const data = (await response.json()) as Product[];
      return data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Không thể kết nối tới máy chủ.',
      );
    }
  },
  {
    condition: (_arg, { getState }) => {
      const { products } = getState() as { products: ProductsState };
      return products.status !== 'loading' && products.status !== 'succeeded';
    },
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi không xác định.';
      });
  },
});

export const selectProducts = (state: RootState): Product[] => state.products.items;
export const selectProductsStatus = (state: RootState): FetchStatus => state.products.status;
export const selectProductsError = (state: RootState): string | null => state.products.error;
export const selectProductById = (state: RootState, id: number): Product | undefined =>
  state.products.items.find((product) => product.id === id);

export default productsSlice.reducer;
