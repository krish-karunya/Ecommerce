import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore.js";
import ProductCard from "./ProductCard.jsx";
import { motion } from "framer-motion";
const FeaturedProduct = () => {
  const { FetchFeatureProduct, products } = useProductStore();

  useEffect(() => {
    FetchFeatureProduct();
  }, []);
  console.log(products);
  if (products.length === 0)
    return <span className='loading loading-spinner loading-lg'></span>;
  return (
    <div>
      <motion.h1
        className='text-3xl font-semibold mb-4 text-emerald-600 text-center'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}>
        FeaturedProduct
      </motion.h1>

      <motion.div
        className='flex gap-2 h-72 mb-10 overflow-hidden mx-auto '
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        {products.map((product) => (
          <ProductCard product={product} />
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedProduct;
