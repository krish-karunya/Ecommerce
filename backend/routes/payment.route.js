import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'

import { createCheckOutSession, checkoutSuccess } from '../controllers/payment.controller.js'



const router = express.Router()

router.post('/create-checkout-session', protectRoute, createCheckOutSession)
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;