/**
 * 
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */

import Connect from '../../../lib/utils/mongoose'
import User from "../../../lib/models/UserModel"

const addUser = async (req, res) => {
    const { method } = req
    const {
        status,
        user_id,
        user_name,
        organisation_code,
        allowed_pages,
        active_services,
        notifications,
        favorite_banks,
    } = req.body
    if (req.method == "POST") {
        await Connect()
        const create = await User.create(req.body)
        res.status(200).json(create)
    }
    else {
        res.status(401).send(`${method} method not allowed!`)
    }
}

export default addUser