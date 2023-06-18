import Global from "../../../lib/models/Global";
import Connect from "../../../lib/utils/mongoose";

export default async function handler(req, res){
    await Connect()
    const result = await Global.find({organisation_code: "JANPAY"})
    if(!result){
        return res.status(404).json({message: 'Not Found!'})
    }
    res.status(200).json(result)
}