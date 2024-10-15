import { redis } from "../db/redis.js"
import { Product } from "../model/product.model.js"
import cloudinary from '../db/cloudinary.js'


export const getAllProduct = async (req, res) => {
    try {
        const product = await Product.find({})
        res.json({ product })
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }

}


export const getFeaturedProduct = async (req, res) => {
    try {
        // redis is more fast that's why we storing the data in redis,Only string can store in redis 
        let featuredProducts = await redis.get("featuredProduct")
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts))
        }

        // If no data in redis we can get from mongoDB :
        // lean gonna return plain javascript object instead of mongodb document .which improve performance
        featuredProducts = await Product.find({ isFeatured: true }).lean()
        if (!featuredProducts) {
            return res.status(404).json({ message: "No Featured product is founded " })
        }

        await redis.set("featuredProduct", JSON.stringify(featuredProducts))
        res.json(featuredProducts)
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }

}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body
        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }
        const newProduct = new Product({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        })

        await newProduct.save()

        res.status(201).json(newProduct)
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        // validation to check whether it is valid it or not 

        // Below based on id find the the product , uisng that deleting image from cloudinary 
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" })
        }

        const publicId = product.image.split('/').pop().split(".")[0]
        try {
            await cloudinary.uploader.destroy(`products/${publicId}`)
            console.log("Image has been deleted from cloudinary");

        } catch (error) {
            console.log("Error in deleting image from cloudinary ");
        }
        await Product.findByIdAndDelete(id)
        res.json({ message: "Product has been deleted successfully " })

    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}


export const getRecommendedProduct = async (req, res) => {
    try {
        const recommendedProduct = await Product.aggregate([
            { $sample: { size: 4 } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    price: 1,
                    description: 1
                }
            }

        ])
        res.json(recommendedProduct)
    } catch (error) {
        console.log("Error in getRecommendedProduct controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}


export const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params
        const products = await Product.find({ category })
        res.json({ products })
    } catch (error) {
        console.log("Error in getProductByCategory controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}


export const toggleFeaturedProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        product.isFeatured = !product.isFeatured
        const updatedProduct = await product.save()
        // updated in redis cache:
        await updateFeaturedProductsCache();

        res.json(updatedProduct)
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }
}


const updateFeaturedProductsCache = async () => {
    try {
        const isFeaturedProduct = await Product.find({ isFeatured: true }).lean()
        await redis.set("featuredProduct", JSON.stringify(isFeaturedProduct))
    } catch (error) {
        console.log("Error in storing to redis in toggleFeaturedController");

    }
}