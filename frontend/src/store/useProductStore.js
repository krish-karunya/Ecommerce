import axios from '../lib/axios.js'
import { toast } from 'react-hot-toast'
import { create } from 'zustand'


// Create method in Zustand is used to creating a store :
export const useProductStore = create((set) => ({

    products: [],
    setProducts: (products) => set({ products: products }),
    loading: false,



    // FetchFeatureProduct :
    FetchFeatureProduct: async () => {
        set({ loading: true })
        try {
            const res = await axios.get('/products/featured')
            set({ products: res.data, loading: false })
        } catch (error) {
            console.log("Error in fetching featured products");

        }
    },

    // Creating a new Products :
    createProduct: async (productData) => {
        set({ loading: true });

        try {
            const res = await axios.post('/products', productData);
            console.log(res.data);


            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))


        } catch (error) {
            set({ loading: false })
            console.log(error);
            toast.error(error.response.data.error);

        }
    },

    // Fetch all the Products from server :
    fetchProductData: async () => {
        set({ loading: true })
        try {
            const res = await axios.get('/products')
            console.log(res);

            set({ products: res?.data?.product, loading: false })


        } catch (error) {
            set({ loading: false })
            toast.error(error.productData.data.error || "Failed to fetch the data ")

        }
    },
    // Delete the product based on Id :
    deleteProduct: async (id) => {
        set({ loading: true })
        try {
            await axios.delete(`/products/${id}`)
            set((prevProduct) => ({
                products: prevProduct.products.filter((product) => (
                    product.id !== id
                ))
            }))
            set({ loading: false })
        } catch (error) {
            set({ loading: false })
            toast.error(error.response.data.error || "Failed to delete product");
        }
    },
    // Toggle the featured producted :
    toggleFeaturedProduct: async (productId) => {
        set({ loading: true })
        try {
            const res = await axios.patch(`/products/${productId}`)

            set((prevProduct) => ({
                products: prevProduct.products.map((product) => (
                    product.id === productId ? { ...product, isFeatured: res.data.isFeatured } : product
                )), loading: false
            }))
        } catch (error) {
            console.log(error);

            set({ loading: false })
            toast.error(error.response.data.error || "Failed to update product");
        }
    },

    // Get data by category :
    getProductByCategory: async (category) => {
        set({ loading: true })
        try {
            const res = await axios.get(`products/category/${category}`)
            set({ products: res.data.products, loading: false })

        } catch (error) {
            console.log(error);

            set({ loading: false })
            toast.error(error.response.data.error || "Failed to get category product");
        }
    },

    addToCart: async () => {
        set({ loading: true })
        try {



        } catch (error) {
            console.log(error);
            set({ loading: false })
            toast.error(error.response.data.error || "Failed to add product to cart ");
        }
    }

}))


