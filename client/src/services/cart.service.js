import privateClient from "../config/api/privateClient";
export const CartServices = {
    addToCart: async ({ productId, quantity }) => {
        try {
            const response = await privateClient.post("/cart", {
                productId, quantity

            })
            return { response };
        } catch (err) {
            return { err };
        }
    },

    updateCart: async ({ productId, quantity }) => {
        try {
            const response = await privateClient.put("/cart", {
                productId, quantity

            })
            return { response };
        } catch (err) {
            return { err };
        }
    },

    removeCartItem: async (productId) => {
        try {
            const response = await privateClient.delete("/cart", {
                params: {
                    productId
                }
            })
            return { response };
        } catch (err) {
            return { err };
        }
    },
    getAllProductsFromCart: async () => {
        try {
            const response = await privateClient.get("/cart");
            return { response };
        } catch (err) {
            return { err };
        }
    },

}