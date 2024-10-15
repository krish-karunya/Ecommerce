import React, { useEffect, useState } from "react";
import { PlusCircle, ShoppingBasket, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import CreateProductForm from "./CreateProductForm";
import ProductLists from "./ProductLists";
import AnalyticsChart from "./AnalyticsChart";
import { useProductStore } from "../store/useProductStore";

const AdminDashBoard = () => {
  const [isActive, setIsActive] = useState("create");

  const { fetchProductData } = useProductStore();
  const tabs = [
    { id: "create", label: "Create Product", icon: PlusCircle },
    { id: "products", label: "Products", icon: ShoppingBasket },
    { id: "analytics", label: "Analytics", icon: BarChart },
  ];
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return (
    <div className='min-h-screen'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <h1 className='text-center text-3xl my-10 font-bold'>
          Admin Dashboard
        </h1>
      </motion.div>
      <div className='my-10 flex justify-center items-center '>
        <div className='text-center flex justify-center items-center '>
          {tabs.map((item) => {
            return (
              <div className='flex mr-2' key={item.id}>
                <button
                  className={` px-4 py-2 text-white rounded-lg outline-none flex font-medium transition-colors duration-300  items-center gap-3 ${
                    isActive === item.id ? "bg-emerald-600" : "bg-slate-900"
                  }`}
                  onClick={() => {
                    setIsActive(item.id);
                  }}>
                  <span>{<item.icon />}</span>
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className='text-center'>
        {isActive === "create" && <CreateProductForm />}
        {isActive === "products" && <ProductLists />}
        {isActive === "analytics" && <AnalyticsChart />}
      </div>
    </div>
  );
};

export default AdminDashBoard;
