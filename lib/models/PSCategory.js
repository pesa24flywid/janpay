import { model, models, Schema } from 'mongoose'

const categorySchema = new Schema({
    operator_category_name: String,
    keyword: String,
    active: String,
})

const Category = models.Categories || model("Categories", categorySchema)

export default Category