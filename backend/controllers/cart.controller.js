import { Product } from "../model/product.model.js";

export const getCartProduts = async (req, res) => {
    try {
        const user = req.user


        const products = await Product.find({ _id: { $in: req.user.cartItems } });


        //  we need to add quantity to each => refer the user.cartItem in model we need to create object 

        const cartItems = products.map((product) => {
            const item = user.cartItems.find((item) => item.id === product.id)
            return { ...product.toJSON(), quantity: item.quantity }
        })
        res.json(cartItems)



    } catch (error) {
        console.log("Error in getCartProduts controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}

export const removeAllCartProduct = async (req, res) => {
    try {

        const user = req.user
        const { productId } = req.body
        console.log(productId);

        if (productId) {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId)

        } else {
            user.cartItems = []
        }
        await user.save()
        res.json(user.cartItems)

    } catch (error) {
        console.log("Error in removeAllCartProduct controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user
        // console.log(user.cartItems);


        // Normal javascript find method it return first match for the condition
        const isExistsProduct = user.cartItems.find((item) => item.id === productId)
        if (isExistsProduct) {
            isExistsProduct.quantity += 1
        } else {
            user.cartItems.push(productId)
        }
        await user.save()

        res.json(user.cartItems)

    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const productId = req.params.id
        const { quantity } = req.body
        const user = req.user

        const isExistsProduct = user.cartItems.find(item => item.id === productId)

        if (isExistsProduct) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId)
                await user.save()
                return res.json(user.cartItems)
            }
            isExistsProduct.quantity = quantity
            await user.save()
            res.json(user.cartItems)
        } else {
            res.status(404).json({ message: "Product not found" });
        }



    } catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}  
