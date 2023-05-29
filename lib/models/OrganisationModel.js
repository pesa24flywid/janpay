import { model, models, Schema } from 'mongoose'

const organisationSchema = new Schema({
    id: Number,
    title: Number,
    code: String,
    active_services: Array,
    aeps_status: {
        type: Boolean,
        default: true
    },
    bbps_status: {
        type: Boolean,
        default: true
    },
    dmt_status: {
        type: Boolean,
        default: true
    },
    recharge_status: {
        type: Boolean,
        default: true
    },
    payout_status: {
        type: Boolean,
        default: true
    },
    pan_status: {
        type: Boolean,
        default: true
    },
    lic_status: {
        type: Boolean,
        default: true
    },
    cms_status: {
        type: Boolean,
        default: true
    },
    fastag_status: {
        type: Boolean,
        default: true
    },
    axis_status: {
        type: Boolean,
        default: true
    },
    notifications: [{
        title: String,
        content: String,
    }],
    portal_roles: [
        {
            name: String,
            is_enabled: Boolean,
        }
    ],
    default_role: Boolean,
})

const Organisation = models.Organisations || model("Organisations", organisationSchema)

export default Organisation