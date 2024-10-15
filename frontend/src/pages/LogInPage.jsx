import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import ParticlesComponent from "../components/particles";

const LogInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, loading } = useUserStore();
  const HandleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
    login(formData);
    // setFormData({
    //   email: "",
    //   password: "",
    // });
  };
  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='min-h-screen flex items-center justify-center '>
      <ParticlesComponent id='particles' />
      <div className='flex flex-col my-2 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/4 xl:w-5/12 mb-20 overflow-hidden  '>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <h1 className='text-3xl font-bold text-center m-5 text-emerald-600'>
            Login
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <form
            className='flex flex-col justify-center items-center mx-auto w-full sm:w-3/4 md:w-1/2 lg:w-3/4 xl:w-3/4 px-10 py-10 gap-4 rounded-lg bg-slate-200 pb-5'
            onSubmit={HandleSubmit}>
            <div className='w-full '>
              <label htmlFor='email' className='block text-sm font-medium'>
                Email
              </label>
              <div className='relative flex w-full '>
                <div className='absolute inset-y-0 left-0 flex items-center pl-2 '>
                  <Mail className='h-5 w-5 text-gray-400 ' aria-hidden='true' />
                </div>
                <div className='w-full'>
                  <input
                    required
                    type='email'
                    name='email'
                    id='email'
                    className='w-full  px-10 outline-none  my-1 rounded-lg py-2 focus:outline-green-400 '
                    placeholder='Email'
                    onChange={HandleChange}
                  />
                </div>
              </div>
            </div>
            <div className='w-full '>
              <label htmlFor='password' className='block text-sm font-medium'>
                Password
              </label>
              <div className='relative flex w-full '>
                <div className='absolute inset-y-0 left-0 flex items-center pl-2 '>
                  <Lock className='h-5 w-5 text-gray-400 ' aria-hidden='true' />
                </div>
                <div className='w-full'>
                  <input
                    required
                    type='password'
                    name='password'
                    id='password'
                    className='w-full   px-10 outline-none  my-1 rounded-lg py-2 focus:outline-green-400 '
                    placeholder='Password'
                    onChange={HandleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='bg-emerald-600 hover:bg-emerald-700 text-white flex justify-center items-center py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:scale-90 my-4 w-full font-medium text-xl '>
              {loading ? (
                <>
                  <Loader
                    className='mr-2 h-5 w-5 animate-spin'
                    aria-hidden='true'
                  />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
                  Login
                </>
              )}
            </button>
            <p className=' text-center text-sm'>
              Not a member?{" "}
              <Link
                to='/signup'
                className='font-medium text-emerald-400 hover:text-emerald-300'>
                Sign up now <ArrowRight className='inline h-4 w-4' />
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LogInPage;
