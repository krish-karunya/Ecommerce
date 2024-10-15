# Library list which i used in this project :

1. axios - To make a api call
2. @stripe/stripe-js - used for Stripe payment
3. framer-motion - used animation
4. lucide-react - Icon with light-weight and very optimise icon library
5. react-confetti - After make a payment we can show celebrate kind of stuff using this library
6. react-hot-toast - Notification
7. react-router-dom - Router to navigate one page to another without reloading our whole page
8. recharts - Used to create a beautiful charts
9. zustand - It is kind common store like redux

# Route :

- install react-router-dom
- Wrap the root component using <BrowserRouter>
- Using <Routes> => inside that create a <Route path = '/' element = {<Home/>} /> => Using Route create a Multiple Path based on requirement

# Axios :

- Axios is a tool to make requests to a server.
- You can use axios.get() for getting data and axios.post() for sending data.
- By creating an Axios instance, you can set up default settings (like a base URL or headers) and reuse them across your app.
- This makes your code cleaner and easier to manage when making multiple requests.
  **Example :**

         const axiosInstance = axios.create({
             baseURL: import.meta.mode === "development" ? 'http://localhost:5000/api' : '/api',
             withCredentials: true,  // It help uo to send the cookie to server for each n every request

         })
