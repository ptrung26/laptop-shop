import publicClient from "../config/api/publicClient";
export const CategoryServices = {
    getAllCategories: async () => {
        try {
            const data = await publicClient.get('/categories');
            return { data };
        } catch (err) {
            return { err };
        }
    }
}