/**
 * 
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */

import Connect from "../../../../lib/utils/mongoose"
import Category from "../../../../lib/models/PSCategory"

const addCategory = async (req, res) => {
    const { method } = req
    const { operator_category_name, status } = req.body
    if (req.method == "POST") {
        await Connect()
        if (operator_category_name) {
            const alreadyAdded = await Category.findOne({ "operator_category_name": `${operator_category_name}` })
            if (alreadyAdded) {
                res.status(200).json({ error: "Category was already added!" })
            }
            else {
                const create = await Category.create(req.body)
                res.status(200).json(create)
            }
        }
        else res.status(400).send("Please add category name.")
    }
    else {
        res.status(401).send(`${method} method not allowed!`)
    }
}

export default addCategory