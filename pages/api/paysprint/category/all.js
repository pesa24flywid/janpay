/**
 * 
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

import Connect from "../../../../lib/utils/mongoose"
import Category from "../../../../lib/models/PSCategory"

const allCategories = async (req, res) => {
    const { method } = req
    if (req.method == "POST") {
        await Connect()
        const result = await Category.find()
        res.status(200).json(result)
    }
    else {
        res.status(401).send(`${method} method not allowed!`)
    }
}

export default allCategories