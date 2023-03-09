import { model, models, Schema } from 'mongoose'

const bankSchema = new Schema({
    organisation_code: String,
    bank_name: String,
    account: String,
    ifsc: String,
    active: Boolean,
})

const CMSBank = models.Banks || model("Banks", bankSchema)

export default CMSBank