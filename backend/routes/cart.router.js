import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getCartProduts, removeAllCartProduct, addToCart, updateQuantity } from '../controllers/cart.controller.js';

const router = express.Router()

router.get('/', protectRoute, getCartProduts)
router.delete('/', protectRoute, removeAllCartProduct)
router.post('/', protectRoute, addToCart)
router.patch('/:id', protectRoute, updateQuantity)



export default router;