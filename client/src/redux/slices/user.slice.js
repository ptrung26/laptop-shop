import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CartServices } from '../../services/cart.service';

export const counterSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        cart: null,
        totalCart: null,
        fetchCartStatus: 'idle',
        addCartStatus: 'idle',
        updateCartStatus: 'idle',
        removeCartStatus: 'idle',
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }

    },
    extraReducers(builder) {
        builder
            .addCase(fetchCart.pending, (state, action) => {
                state.fetchCartStatus = 'loading'
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.fetchCartStatus = 'succeeded'
                const { cart, totalCart } = action.payload;
                state.cart = cart;
                state.totalCart = totalCart;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addCart.fulfilled, (state, action) => {
                state.addCartStatus = 'succeeded'
                state.cart = null;
                const { totalCart } = action.payload;
                state.totalCart = totalCart;
                alert("Thêm sản phẩm vào giỏ hàng thành công!");
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.updateCartStatus = 'succeeded'
                const { product } = action.payload;
                const updateCart = state.cart.map(item => {
                    if (item.id === product.productId) {
                        item.quantity = product.quantity;
                    }
                    return item;
                });

                state.cart = updateCart;

            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.removeCartStatus = 'succeeded'
                const { productId, totalCart } = action.payload;
                const updateCart = state.cart.filter(item => item.id !== productId);
                state.cart = updateCart;
                state.cart = totalCart;
            })
    }
});
export const { setUser } = counterSlice.actions;
export default counterSlice.reducer;
export const fetchCart = createAsyncThunk('user/fetchCart', async () => {
    const { response } = await CartServices.getAllProductsFromCart();
    return response.data;
})
export const addCart = createAsyncThunk('user/addCart', async ({ productId, quantity }) => {
    let { response, err } = await CartServices.addToCart({
        productId,
        quantity
    });
    return response.data;
})
export const updateCart = createAsyncThunk('user/updateCart', async ({ productId, quantity }) => {
    const { response } = await CartServices.updateCart({ productId, quantity });
    return response.data;
})

export const removeCartItem = createAsyncThunk('user/removeCartItem', async (productId) => {
    const { response } = await CartServices.removeCartItem(productId);
    return response.data;
})