import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
const stripePromise = loadStripe(
  "pk_test_51Q6cE0Rrjni9DruEYUs71zuouj4mTkFZfyeCUFFQYm7vxR5NiPjWNtYH6VExvHxGAmjiQzlno4CIeMAxuWpATt0W00GUfA1dUf"
);

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  // LoadStripe is the method used to load the stripe page we need pass the public Key inside it

  const saving = subtotal - total;
  const FormattedTotal = total.toFixed(2);
  const FormattedSubTotal = subtotal.toFixed(2);
  const FormattedSaving = saving.toFixed(2);

  const handlePayment = async () => {
    // Used to reterive the stripe object ,this object used to interact with stripe you can do operation like creating payment session ,handle card...
    const stripe = await stripePromise;

    // Below api call will return a Object that object containe session id using that stripe will create a checkout session
    const res = await axios.post("/payment/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });
    const session = res.data;
    console.log(session);

    // overhere stripe is variable which we wrote above it holding stripe object and redirectToCheckout is function is given to us By stripe object it will redirect to stripe checkout page
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error:", result.error);
    }
  };

  return (
    cart && (
      <motion.div
        className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <p className='text-xl font-semibold text-emerald-400'>Order summary</p>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <dl className='flex items-center justify-between gap-4'>
              <dt className='text-base font-normal text-gray-300'>
                Original price
              </dt>
              <dd className='text-base font-medium text-white'>
                ${FormattedSubTotal}
              </dd>
            </dl>

            {saving > 0 && (
              <dl className='flex items-center justify-between gap-4'>
                <dt className='text-base font-normal text-gray-300'>Savings</dt>
                <dd className='text-base font-medium text-emerald-400'>
                  ${FormattedSaving}
                </dd>
              </dl>
            )}
            {coupon && isCouponApplied && (
              <dl className='flex items-center justify-between gap-4'>
                <dt className='text-base font-normal text-gray-300'>
                  Coupon ({coupon.code})
                </dt>
                <dd className='text-base font-medium text-emerald-400'>
                  -{coupon.discountPercentage}%
                </dd>
              </dl>
            )}

            <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
              <dt className='text-base font-bold text-white'>Total</dt>
              <dd className='text-base font-bold text-emerald-400'>
                ${FormattedTotal}
              </dd>
            </dl>
          </div>

          <motion.button
            className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePayment}>
            Proceed to Checkout
          </motion.button>

          <div className='flex items-center justify-center gap-2'>
            <span className='text-sm font-normal text-gray-400'>or</span>
            <Link
              to='/'
              className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'>
              Continue Shopping
              <MoveRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    )
  );
};
export default OrderSummary;