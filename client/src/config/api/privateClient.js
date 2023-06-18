import axios from "axios";
import { UserServices } from "../../services/user.service";
const BASE_URL = process.env.REACT_APP_BASE_URL_API;
const privateClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

privateClient.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('actk')}`,
        }
    }
})

let isRefreshing = false;
privateClient.interceptors.response.use(
    response => {
        return response
    },
    async (error) => {
        const { status } = error?.response?.data || 0;
        if (status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                const { response, err } = await UserServices.refeshToken();
                if (response) {
                    const { accessToken } = response.data;
                    localStorage.setItem("actk", accessToken);
                    const config = error.config;
                    config.headers.Authorization = `Bearer ${accessToken}`;
                    const newResponse = await privateClient.request(config);
                    isRefreshing = false;
                    return newResponse;
                } else {
                    return Promise.reject(err);
                }

            } else {
                return Promise.reject(error);
            }

        }

    })
export default privateClient; 