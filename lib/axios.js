import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
const clientURL = process.env.NEXT_PUBLIC_FRONTEND_URL

export default axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
})

export const FormAxios = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest'
    },
})

export const ClientAxios = axios.create({
    clientURL,
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'multipart/form-data'
    },
})