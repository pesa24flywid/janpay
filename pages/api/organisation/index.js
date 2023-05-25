import Organisation from "../../../lib/models/OrganisationModel"
import Connect from "../../../lib/utils/mongoose"


export default async function GlobalDetails(req, res) {
    await Connect()
    if (req.method == "GET") {
        const result = await Organisation.findOne({ organisation_code: process.env.NEXT_PUBLIC_ORGANISATION })
        if (!result) return res.status(404).json({ message: "Organisation Info not found!" })
        return res.status(200).json(result)
    }

    if (req.method == "POST") {
        const result = await Organisation.findOneAndUpdate({organisation_code: process.env.NEXT_PUBLIC_ORGANISATION}, req.body).exec()
        if (!result) return res.status(500).json({ message: "Error while updating" })
        return res.status(200).json(result)
    }
}