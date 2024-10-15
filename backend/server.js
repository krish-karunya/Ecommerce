import express from "express"
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import { connectdb } from "./db/connectdb.js"
import cartRouter from './routes/cart.router.js'
import couponRoutes from './routes/coupon.route.js'
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import cookieParser from "cookie-parser"
import path from 'path'

// To Access the env variable :
dotenv.config()



const app = express()


app.use(cookieParser())
app.use(express.json({ limit: "10mb" }))
// Routes :
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRouter)
app.use('/api/coupon', couponRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)



const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Database func call :
connectdb(process.env.MONGO_URL).then(() => {
    console.log("Database Connected successfully");
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })

}).catch((err) => {
    console.log(err.message);
})


