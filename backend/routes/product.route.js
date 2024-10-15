import express from "express";
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'
import { getAllProduct, getFeaturedProduct, createProduct, deleteProduct, getRecommendedProduct, getProductByCategory, toggleFeaturedProduct } from '../controllers/product.controller.js'

const router = express.Router()

router.get("/", protectRoute, adminRoute, getAllProduct)
router.get("/featured", getFeaturedProduct)
router.get("/category/:category", getProductByCategory)
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.post("/", protectRoute, adminRoute, createProduct)
router.get("/recommended", getRecommendedProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)


export default router;