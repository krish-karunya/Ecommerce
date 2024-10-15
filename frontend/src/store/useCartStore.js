import { create } from 'zustand';
import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'


export const useCartStore = create((set, get) => ({

    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    // Clear cart :
    clearCart: async () => {
        try {
            set({ cart: [], coupon: null, total: 0, subtotal: 0 })
            await axios.delete('cart')
        } catch (error) {
            console.log("Error in clear cart function");

        }
    },

    // get coupon :
    getCoupon: async () => {
        try {
            const response = await axios.get('/coupon')
            console.log(response.data);
            get().calculateTotals();
            set({ coupon: response.data })
        } catch (error) {
            console.error("Error fetching coupon:", error);

        }
    },


    removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed");
    },

    // Apply Coupon :
    applyCoupon: async (code) => {
        console.log(code);

        try {
            const response = await axios.post("/coupon/validate", { code });
            console.log(response);

            set({ coupon: response.data, isCouponApplied: true });
            get().calculateTotals();
            toast.success("Coupon applied successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply coupon");
        }
    },


    // Remove all theitems from cart :
    removeItemFromCart: async (productId) => {


        await axios.delete('/cart', { data: { productId } })
        set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
        get().calculateTotals()

    },
    // get the all the cart items :
    getAllCartItems: async () => {
        try {
            const res = await axios.get('/cart')


            set({ cart: res.data })
            get().calculateTotals();
        } catch (error) {
            // console.log(error);

            set({ cart: [] })
            toast.error(error.response.data.message || "Error in fetching all get cart Items")
        }
    },


    // add item to cart :there is a edge case if you add new product it will update the cart count , but if you add the existing product it will add the quantity of product not a cart count 

    addCartItem: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            // console.log(error);

            toast.error(error.response.data.message || "An error occurred");
        }
    },
    // Update Quantity :
    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeItemFromCart(productId)
            return
        }

        await axios.patch(`/cart/${productId}`, { quantity })
        set((prevState) => ({ cart: prevState.cart.map((item) => item._id === productId ? { ...item, quantity } : item) }))
        get().calculateTotals();
    },


    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        let total = subtotal


        if (coupon) {


            const discount = subtotal * (coupon.discountPercentage / 100);


            total = subtotal - discount;
        }
        console.log(total, subtotal);

        set({ subtotal, total });
    },
}));