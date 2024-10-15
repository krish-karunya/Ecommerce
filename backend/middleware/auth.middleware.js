import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { User } from "../model/user.model.js";
dotenv.config()

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Access token not found" })
        }

        try {
            const decode = jwt.verify(accessToken, process.env.ACCESS_SECRET)
            const user = await User.findById(decode.userId)
            if (!user) {
                return res.status(401).json({ message: "User Unauthorised" })
            }

            req.user = user
            next()
        } catch (error) {
            if (error.name === "TokenExpireError") {
                return res.status(401).json({ message: "Unauthorised token expires" })
            }
            throw error
        }
    } catch (error) {
        console.log("Product routes Error", error.message);
        res.status(500).json({ message: `Server Error:${error.message}` })

    }

}


export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        return res.status(401).json({ message: "Unauthorized - only Admin" })
    }
}