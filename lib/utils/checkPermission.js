import { ClientAxios } from "../axios"

function PermissionMiddleware (pageId) {
    var hasAccess

    ClientAxios.post('/api/user/fetch', {
        user_id: localStorage.getItem('userId')
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        hasAccess = res.data[0].allowed_pages.includes(pageId)
    }).catch((err) => {
        console.log(err)
    })

    return true
}

export default PermissionMiddleware