import { Coupon } from '../model/coupon.model.js'
import { stripe } from '../db/stripe.js'
import { Order } from '../model/order.model.js'
import dotenv from 'dotenv'
dotenv.config()


export const createCheckOutSession = async (req, res) => {
    try {
        const { couponCode, products } = req.body
        // Checking products is array or not using normal js method
        // console.log(couponCode, products);

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' })
        }
        let totalAmount = 0
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100) // stripe wants u to send in the format of cents
            totalAmount += amount * product.quantity
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.image]
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1

            }
        });
        console.log(lineItems);

        let coupon = null
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, isActive: true, userId: req.user._id })
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100)
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon ? [{
                coupon: await createStripeCoupon(coupon.discountPercentage)
            }] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || '',
                products: JSON.stringify(products.map((p) => ({
                    id: p._id,
                    quantity: p.quantity,
                    price: p.price
                })))
            }
        })

        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id)
        }
        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 })
    } catch (error) {
        console.log("Error in createCheckOutSession", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}

//  Creating stripe coupon ,to tell the stripe to use this coupon using stripe API
const createStripeCoupon = async (discountPercentage) => {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: 'once',
    })
    return coupon.id
}

// creating a new coupon those who have purchase morethan 20000 addition new coupon user will use it for next purchase :
const createNewCoupon = async (userId) => {

    await Coupon.findOneAndDelete({ userId })
    // creating a new coupon
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
        isActive: true

    })
    await newCoupon.save()
    return newCoupon
}


export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body
        console.log(sessionId);

        // Important step to retrieve the meta-data from stripe 
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                }, {
                    isActive: false
                })
            }


            const products = JSON.parse(session.metadata.products)
            const newOrder = new Order({
                userId: session.metadata.userId,
                products: products.map((product) => ({
                    productId: product.id,
                    quantity: product.quantity,
                    price: product.price,

                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: sessionId
            })

            await newOrder.save()

            res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id
            })
        }
    } catch (error) {
        console.log("Error in checkoutSuccess", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}



