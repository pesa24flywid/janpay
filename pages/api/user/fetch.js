/**
 * 
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

import Connect from '../../../lib/utils/mongoose'
import User from "../../../lib/models/UserModel"

const UserInfo = async (req, res) => {
    const { method } = req
    const { user_id } = req.body
    if (method == "POST") {
        await Connect()
        const result = await User.find({
            "organisation_code": `${process.env.NEXT_PUBLIC_ORGANISATION}`,
            "user_id": user_id
        })
        res.status(200).json(result)
    }
    else {
        res.status(401).send(`${method} method not allowed!`)
    }
}

export default UserInfo