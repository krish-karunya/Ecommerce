import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";

const NavBar = () => {
  const { user, logOut } = useUserStore();
  const { cart } = useCartStore();
  // console.log(cart);

  // console.log(user);

  // const isAdmin = user.data.role === "admin";
  let isAdmin;
  if (user) {
    isAdmin = user.role === "admin";
    // console.log(isAdmin);
  }

  const HandleLogOut = () => {
    logOut();
  };

  return (
    <header className=' flex justify-between shadow-xl font-bold  bg-slate-800 w-full min-w-full '>
      <Link to='/' className='flex justify-center items-center'>
        <img
          src='https://t3.ftcdn.net/jpg/02/47/48/00/360_F_247480017_ST4hotATsrcErAja0VzdUsrrVBMIcE4u.jpg'
          className='h-20 w-20 rounded-full p-2'
        />
        <h1 className='font-bold text-2xl text-emerald-600'>E-commerce</h1>
      </Link>
      <nav className='flex flex-wrap justify-center items-center gap-5 mr-5'>
        <Link
          to='/'
          className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out hover:scale-90'>
          Home
        </Link>
        {user && (
          <Link to='/cart' className='flex'>
            (
            <span className='h-6 w-6 rounded-full bg-emerald-600 absolute  text-white flex items-center justify-center '>
              {cart?.length}
            </span>
            )
            <ShoppingCart size={40} />
            <span className='mt-3  hover:scale-90'>Cart</span>
          </Link>
        )}
        {isAdmin && (
          <Link
            to='/secret-dashboard'
            className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out hover:scale-90'>
            Dashboard
          </Link>
        )}
        {user ? (
          <button
            className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out hover:scale-90'
            onClick={HandleLogOut}>
            <LogOut /> <span className='ml-2'>Log Out</span>
          </button>
        ) : (
          <>
            <Link
              to={"/signup"}
              className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out hover:scale-90'>
              <UserPlus className='mr-2' size={18} />
              Sign Up
            </Link>
            <Link
              to={"/loginpage"}
              className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out hover:scale-90'>
              <LogIn className='mr-2' size={18} />
              LogIn
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
