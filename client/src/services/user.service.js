import privateClient from "../config/api/privateClient";
import publicClient from "../config/api/publicClient";


export const UserServices = {
    signin: async ({ username, password }) => {
        try {
            const response = await publicClient.post("/user/signin", {
                username,
                password,
            })

            return { response };
        } catch (err) {
            return { err };
        }
    },
    signup: async ({ email, username, password }) => {
        try {
            const response = await publicClient.post("/user/signup", {
                email,
                username,
                password

            })

            return { response };
        } catch (err) {
            return { err };
        }
    },

    logout: async () => {
        try {
            const response = await privateClient.get("/user/logout");
            return { response };
        } catch (err) {
            return { err };
        }

    },

    refeshToken: async () => {
        try {
            const response = await publicClient.post("/user/refresh");
            return { response };
        } catch (err) {
            return { err };
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await publicClient.post("/user/forgot-password", {
                email,
            });

            return { response };
        } catch (err) {

            return { err };
        }
    },

    verifyResetToken: async (token) => {
        try {
            const response = await publicClient.get(`/user/reset-password/${token}`);
            return { response };
        } catch (err) {
            return { err };
        }
    },

    resetPassword: async (token, password) => {
        try {
            const response = await publicClient.put("/user/reset-password", {
                token, password
            })
            return { response };
        } catch (err) {
            return { err };
        }

    },

    getInfo: async () => {
        try {
            const response = await privateClient.get("/user/info");
            return { response };
        } catch (err) {
            return { err };
        }
    }
}