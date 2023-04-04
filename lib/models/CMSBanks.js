import { model, models, Schema } from 'mongoose'

const bankSchema = new Schema({
    organisation_code: String,
    personal_identifier: String,
    bank_name: String,
    account: String,
    ifsc: String,
    status: Boolean
})

const CMSBank = models.PortalBanks || model("PortalBanks", bankSchema)

export default CMSBank