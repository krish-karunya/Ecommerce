import mongoose from "mongoose"

export const connectdb = async (MONGO_URL) => {
    await mongoose.connect(MONGO_URL)
}