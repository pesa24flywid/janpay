import { model, models, Schema } from 'mongoose'

const organisationSchema = new Schema({
    id: Number,
    title: Number,
    code: String,
    active_services: Array,
    notifications: [{
        title: String,
        content: String,
    }],
    portal_roles: [
        {
            name: String,
            is_enabled: Integer,
        }
    ],
    default_role: Integer,
})

const Organisation = models.Organisations || model("Organisations", organisationSchema)

export default Organisation