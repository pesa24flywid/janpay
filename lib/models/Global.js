import { model, models, Schema } from 'mongoose'

const globalSchema = new Schema({
    organisation_code: String,
    aeps_provider: String,
    aeps_status: Boolean,
    bbps_provider: String,
    bbps_status: Boolean,
    dmt_provider: String,
    dmt_status: Boolean,
    recharge_status: Boolean,
    recharge_provider: String,
    notifications: [{
        title: String,
        content: String,
    }],
    retailer: Number,
    distributor: Number,
    super_distributor: Number,
    default_role: String,
})

const Global = models.globaldata || model("globaldata", globalSchema)

export default Global