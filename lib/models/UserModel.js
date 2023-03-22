import { model, models, Schema } from 'mongoose'

const userSchema = new Schema({
    user_id: String,
    user_name: String,
    organisation_code: String,
    allowed_pages: {
        type: Array,
        default: '*'
    },
    active_services: Array,
    notifications: [{
        title: String,
        content: String,
    }],
    favorite_banks: [{
        display_name: String,
        eko_bank_id: String,
        paysprint_bank_id: String,
    }],
    permissions: [{
        action: {type: String, default: 'manage'},
        subject: {type: String, default: 'all'},
    }]
})

const User = models.Users || model("Users", userSchema)

export default User
