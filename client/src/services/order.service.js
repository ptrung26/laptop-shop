import privateClient from "../config/api/privateClient";
import publicClient from "../config/api/publicClient";
export const OrderServices = {

    addNewOrder: async ({ order, cart }) => {
        try {
            const response = await privateClient.post("/order", {
                order, cart
            });
            return { response };
        } catch (err) {
            return { err };
        }
    },

    getOrderById: async ({ id }) => {
        try {
            const response = await publicClient.get(`/order/${id}`);
            return { response };
        } catch (err) {
            return { err };
        }
    }

}