import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogInPage from "./pages/LogInPage";
import NavBar from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./store/useUserStore";
import AdminDashBoard from "./components/AdminDashBoard";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./store/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

const App = () => {
  const { user, checkAuth, checkInAuth } = useUserStore();
  const { getAllCartItems } = useCartStore();

  useEffect(() => {
    // As soon as our app run this useEffect will call , if there is any issue this function set({checkAuth:false}) in zustand store and throw error
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    getAllCartItems();
  }, [getAllCartItems, user]);
  // if (checkInAuth) {
  // }
  return checkInAuth ? (
    <>
      <div className='flex justify-center items-center mt-60'>
        <span className='loading loading-spinner loading-lg'></span>
      </div>
    </>
  ) : (
    <div className='min-h-screen relative overflow-hidden z-50 '>
      <div>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/signup'
            element={!user ? <SignUp /> : <Navigate to='/' />}
          />
          <Route
            path='/loginpage'
            element={!user ? <LogInPage /> : <Navigate to='/' />}
          />
          <Route
            path='/secret-dashboard'
            element={
              user?.role === "admin" ? (
                <AdminDashBoard />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route
            path='/cart'
            element={user ? <CartPage /> : <Navigate to='/' />}
          />
          <Route
            path='/purchase-success'
            element={user ? <PurchaseSuccessPage /> : <Navigate to='/' />}
          />
          <Route
            path='/purchase-cancel'
            element={user ? <PurchaseCancelPage /> : <Navigate to='/' />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
