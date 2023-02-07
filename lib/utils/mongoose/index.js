import mongoose from "mongoose";
const URI = process.env.MONGODB_URI
const Connect = async(req, res) =>{
    try {
        mongoose.connect(URI)
    } catch (error) {
        console.log(error)
    }

}

export default Connect