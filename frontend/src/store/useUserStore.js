import { create } from 'zustand';
import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'


export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkInAuth: true,

    signUp: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false })
            return toast.error("Password do not Match ")

        }

        try {
            const res = await axios.post('/auth/signup', { name, email, password })
            set({ user: res.data.user, loading: false })
            // console.log(user);

        } catch (error) {
            set({ loading: false })
            toast.error(error.response.data.message || "An error Occured")
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true });
        try {
            const res = await axios.post('/auth/login', { email, password })
            // console.log(res);

            set({ user: res.data, loading: false })
        } catch (error) {
            set({ loading: false })
            toast.error(error.response.data.message || "An error Occured")
        }
    },

    checkAuth: async () => {
        set({ checkInAuth: true })
        try {
            const res = await axios.get('/auth/profile')
            // console.log(res);
            set({ user: res.data, checkInAuth: false })
        } catch (error) {
            console.log(error);

            set({ checkInAuth: false, user: null })
            toast.error(error.response.data.message || "An error Occured")
        }
    },


    logOut: async () => {

        try {
            await axios.post('/auth/logout')
            set({ user: null })

        } catch (error) {
            set({ loading: false })
            toast.error(error.response.data.message || "An error Occured")

        }
    },

    refreshToken: async () => {

        try {
            // Prevent multiple simultaneous refresh attempts
            if (get().checkingAuth) return;
            // when request failed checkAuth func which the there in App.js in root it will make this checkingAuth:false
            set({ checkingAuth: true });
            const response = await axios.get('/auth/refreshtoken')
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });

            console.log("Error", error.response.data.error);
            throw error

        }
    }
}))



// Todo implement a axios interceptor for refreshing the access token :

let refreshPromise = null;
axios.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // If a refresh is already in progress, wait for it to complete

                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }
                // Start a new refresh process
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;


                return axios(originalRequest);


            }
            catch (refreshError) {
                // If refresh fails, redirect to login or handle as needed
                useUserStore.getState().logOut();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);

    })