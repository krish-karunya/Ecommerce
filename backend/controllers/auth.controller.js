import { User } from "../model/user.model.js"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { redis } from "../db/redis.js";

dotenv.config()


const generateTokens = (userId) => {

    // generating access token :
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: '15m' })

    // generating refresh token :
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' })

    return { accessToken, refreshToken }

}

// Storing the refresh token to redis :
const storeRefreshTokenToRedis = async (userId, refreshToken) => {


    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60)  // expire on 7 days 
}

// setting up the cookie and send the response :

const Setcookies = (res, accessToken, refreshToken) => {


    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent xss attacks, cross site scripting attack
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict", //prevent CSRF attack, cross-site request forgery attack
        maxAge: 15 * 60 * 1000, // 15min - millisecond
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent xss attacks, cross site scripting attack
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict", //prevent CSRF attack, cross-site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days - millisecond
    });
}

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "Already user exists" })
        }

        // creating new model :
        const newUser = new User({
            name,
            email,
            password,
        })
        // saving data in DB :
        const savedUser = await newUser.save()




        const { accessToken, refreshToken } = generateTokens(savedUser._id)
        await storeRefreshTokenToRedis(savedUser._id, refreshToken)

        Setcookies(res, accessToken, refreshToken)

        // 201 is status code for created a new user :
        res.status(201).json({

            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role

        })

    } catch (error) {
        console.log(`Error in signup controller, ${error.message}`);

        res.status(500).json({ message: error.message })
    }

}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (user && await user.comparePassword(password)) {

            const { accessToken, refreshToken } = generateTokens(user._id)
            await storeRefreshTokenToRedis(user._id, refreshToken);
            Setcookies(res, accessToken, refreshToken)
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        } else {
            res.status(400).json({ message: "Invalid credential" })
        }
    } catch (error) {
        console.log(`Error in login controller, ${error.message}`);
        res.status(500).json({ message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        console.log(refreshToken);

        if (refreshToken) {
            const decode = await jwt.verify(refreshToken, process.env.REFRESH_SECRET)
            await redis.del(`refresh_token:${decode}`)
        }

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.json({ message: "Log out Successfully" })
    } catch (error) {
        // To Debug easily user console like below code
        console.log(`Error in logout controller, ${error.message}`);
        res.status(500).json({ message: "server error", error: error.message })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        console.log(refreshToken);

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" })
        }

        const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
        console.log(decode.userId);

        const redisStoredToken = await redis.get(`refresh_token:${decode.userId}`)
        console.log(redisStoredToken);

        if (refreshToken !== redisStoredToken) {
            return res.status(401).json({ message: "invalid refresh token" })
        }


        const accessToken = jwt.sign({ userId: decode.userId }, process.env.ACCESS_SECRET, { expiresIn: '15m' })
        res.cookie("accessToken", accessToken, {
            httpOnly: true, // prevent xss attacks, cross site scripting attack
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", //prevent CSRF attack, cross-site request forgery attack
            maxAge: 15 * 60 * 1000, // 15min - millisecond
        });

        res.json({ message: " Token Refreshed successfully" })

    } catch (error) {
        console.log(`Error in refresh controller, ${error.message}`);
        res.status(500).json({ message: "server error", error: error.message })
    }

}


export const getProfile = async (req, res) => {
    try {
        res.json(req.user)

    } catch (error) {
        console.log(`Error in getProfile controller, ${error.message}`);
        res.status(500).json({ message: "server error", error: error.message })
    }
}

