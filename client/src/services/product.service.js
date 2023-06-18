import publicClient from "../config/api/publicClient";

export const ProductServices = {
    filter: async (query) => {
        try {
            const response = await publicClient.get("/products", {
                params: {
                    ...query,
                }
            })
            return { response };
        } catch (err) {

            return { err };
        }
    },
    getProductBySlug: async (slug) => {
        try {
            const response = await publicClient.get(`products/${slug}`);
            return { response };
        } catch (err) {
            return { err };
        }
    }
}