import React, { useState } from "react";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useProductStore } from "../store/useProductStore";

const CreateProductForm = () => {
  const categories = [
    "jeans",
    "t-shirts",
    "shoes",
    "glasses",
    "jackets",
    "suits",
    "bags",
  ];
  const { createProduct, loading } = useProductStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await createProduct(formData);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.log("Error in creating a products");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file); // this function reading the image URL and convert it as base64 format ,once it readed it will trigger the above onload function that function will setData
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}>
      <div className='w-full sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-5/12 m-auto bg-slate-900 rounded-lg p-10  '>
        <div>
          <h1 className='text-2xl text-teal-500 font-bold text-left'>
            Create New Product
          </h1>
        </div>

        <form className='flex flex-col gap-3 mt-5' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name' className='block text-left mb-2 font-medium'>
              Product
            </label>
            <input
              type='text'
              name='name'
              id='name'
              className='w-full rounded-lg py-2 px-4 bg-slate-400 font-medium text-black outline-none border-0'
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor='description'
              className='block text-left mb-2 font-medium'>
              description
            </label>
            <textarea
              type='text'
              name='description'
              id='description'
              className='w-full rounded-lg py-2 px-4 bg-slate-400 font-medium text-black outline-none border-0'
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='price' className='block text-left mb-2 font-medium'>
              Price
            </label>
            <input
              type='number'
              name='price'
              id='price'
              className='w-full rounded-lg py-2 px-4 bg-slate-400 font-medium text-black outline-none border-0'
              required
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className='text-left w-full mb-2'>
            <p className=' text-left mb-2 font-medium'>Categorys</p>
            <select
              name='category'
              id='category'
              value={formData.category}
              className='w-full p-2 rounded-lg bg-slate-400 text-black font-medium'
              required
              onChange={handleChange}>
              <option>select option</option>
              {categories.map((category) => {
                return (
                  <option value={category} key={category}>
                    {category}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='mt-1 flex items-center'>
            <input
              type='file'
              id='image'
              name='image'
              className='sr-only'
              accept='image/*'
              required
              onChange={handleImageChange}
            />
            <label
              htmlFor='image'
              className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'>
              <Upload className='h-5 w-5 inline-block mr-2' />
              Upload Image
            </label>
            {formData.image != "" && (
              <span className='ml-3 text-sm text-gray-400  '>
                Image uploaded
              </span>
            )}
          </div>
          <button
            className='rounded-lg outline-0 w-full bg-teal-400 py-2 text-black font-medium mt-4'
            type='submit'>
            {loading ? (
              <div className='flex justify-center items-center'>
                <Loader
                  className='mr-2 h-5 w-5 animate-spin'
                  aria-hidden='true'
                />{" "}
                <p> Loading...</p>
              </div>
            ) : (
              <div className='flex justify-center items-center'>
                <PlusCircle className='mr-2 h-5 w-5 ' aria-hidden='true' />
                <p> Create Product</p>
              </div>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateProductForm;
