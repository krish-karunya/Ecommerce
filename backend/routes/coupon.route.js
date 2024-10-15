import express from 'express';
import { getcoupon, validateCoupon } from '../controllers/coupon.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.get('/', protectRoute, getcoupon)
router.post('/validate', protectRoute, validateCoupon)

export default router


