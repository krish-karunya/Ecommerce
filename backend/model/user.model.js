import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// User Schema : 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email id is required "],
        unique: true,
        lowerCase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is Required"]
    },
    cartItems: [{
        quantity: {
            type: Number,
            default: 1
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    }],
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {

    // Important step to optimise the performance : To Aviod re-hash password when the user update profile name,email 
    if (!this.isModified("password")) return next()
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next()

    } catch (error) {
        next(error)

    }

})


userSchema.methods.comparePassword = async function (password) {

    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw new Error("Password is invalid ")
    }

}

export const User = mongoose.model("User", userSchema)