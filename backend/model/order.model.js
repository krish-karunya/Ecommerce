import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0

            }
        }],
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        stripeSessionId: {
            type: String,
            unique: true,
        },

    }, { timestamps: true })


export const Order = mongoose.model('Order', orderSchema)