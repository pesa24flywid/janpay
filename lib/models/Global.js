import { model, models, Schema } from 'mongoose'

const globalSchema = new Schema({
    organisation_code: String,
    aeps_provider: String,
    bbps_provider: String,
    dmt_provider: String,
    notifications: [{
        title: String,
        content: String,
    }],
    retailer: Number,
    distributor: Number,
    super_distributor: Number,
    default_role: String,
})

const Global = models.globalinfo || model("globalinfo", globalSchema)

export default Global