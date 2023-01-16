import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

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