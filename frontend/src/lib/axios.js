import axios from 'axios';


// Some of the URL we use again n again mean we need to create a instance ,It make our life more easier :

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? 'http://localhost:5000/api' : '/api',
    withCredentials: true,  // It help uo to send the cookie to server for each n every request

})

export default axiosInstance;