import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL_API;
const publicClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar' }
})

publicClient.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,

    }
})

export default publicClient; 