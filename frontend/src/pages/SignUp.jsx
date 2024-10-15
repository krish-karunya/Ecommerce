import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../store/useUserStore";
import ParticlesComponent from "../components/particles";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { loading, signUp } = useUserStore();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);

    await signUp(formData);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  const HandleChange = (e) => {
    // console.log(e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className='w-4/12 flex flex-col  mx-auto   '>
      <ParticlesComponent id='particles' />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <h1 className='text-3xl font-bold text-center m-5 text-emerald-600'>
          Create a Account
        </h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <form
          className='flex flex-col justify-center items-center w-full px-10 py-6 gap-4 rounded-lg bg-slate-200 mb-10'
          onSubmit={HandleSubmit}>
          <div className='w-full '>
            <label htmlFor='name' className='block text-sm font-medium'>
              Full Name
            </label>
            <div className='relative flex w-full '>
              <div className='absolute inset-y-0 left-0 flex items-center pl-2 '>
                <UserPlus
                  className='h-5 w-5 text-gray-400 '
                  aria-hidden='true'
                />
              </div>
              <div className='w-full'>
                <input
                  required
                  type='text'
                  name='name'
                  id='name'
                  className='w-full  px-10 outline-none  my-1 rounded-lg py-2  focus:outline-green-400 '
                  placeholder='Full Name'
                  onChange={HandleChange}
                />
              </div>
            </div>
          </div>
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
                  className='w-full  px-10 outline-none  my-1 rounded-lg py-2  focus:outline-green-400 '
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
                  className='w-full   px-10 outline-none  my-1 rounded-lg py-2  focus:outline-green-400 '
                  placeholder='Password'
                  onChange={HandleChange}
                />
              </div>
            </div>
          </div>
          <div className='w-full '>
            <label htmlFor='c-password' className='block text-sm font-medium'>
              Confirm Password
            </label>
            <div className='relative flex w-full '>
              <div className='absolute inset-y-0 left-0 flex items-center pl-2 '>
                <Lock className='h-5 w-5 text-gray-400 ' aria-hidden='true' />
              </div>
              <div className='w-full'>
                <input
                  required
                  type='password'
                  name='confirmPassword'
                  id='c-password'
                  className='w-full   px-10 outline-none  my-1 rounded-lg py-2  focus:outline-green-400 '
                  placeholder='Confirm Password'
                  onChange={HandleChange}
                />
              </div>
            </div>
          </div>
          <button
            type='submit'
            className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:scale-90 my-4 w-full font-medium text-xl flex justify-center items-center '>
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
                <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                Sign up
              </>
            )}
          </button>
          <div className='flex justify-center items-center'>
            Already have an account ?{" "}
            <Link
              to='/loginpage'
              className='flex justify-center items-center text-green-700 font-bold'>
              Log in here{" "}
              <span className='ml-2 '>
                <ArrowRight />
              </span>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
