import { NextResponse, NextRequest } from "next/server";
 
const Middleware = (req) => {
    
    const verified = req.cookies.get("verified")

    const url = req.url
    
    if(!verified && url.includes("/dashboard")){
        return NextResponse.redirect(process.env.FRONTEND_URL+"/auth/login")
    }
    else if(verified && url.includes("/auth")){
        return NextResponse.redirect(process.env.FRONTEND_URL+"/dashboard")
    }
}

export default Middleware