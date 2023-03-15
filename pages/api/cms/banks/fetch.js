/**
 * 
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

import CMSBank from "../../../../lib/models/CMSBanks";
import Connect from "../../../../lib/utils/mongoose";

const AllCmsBanks = async (req, res) => {
    const { method } = req
    if (method == "POST") {
        await Connect()
        const result = await CMSBank.find({"organisation_code": `${process.env.NEXT_PUBLIC_ORGANISATION.toUpperCase()}`}).exec()
        res.status(200).json(result)
    }
    else {
        res.status(401).send(`${method} method not allowed!`)
    }
}

export default AllCmsBanks