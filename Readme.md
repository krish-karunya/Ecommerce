# Mistakes to Avoid :

1. Don't use async and await while creating jwt token ,If you use undefined will store in cookie token value
2. while building a logout feature ,beaware you should use plural => res.cookies
3. In login after emailId and password validation is done If the user is exists , we need to create token (accessToken,RefreshToken)=> save refreshToken in redis => send the cookie as response

# Stripe creation Steps :

# stripe Flow :

**Flow Summary**

1. User Clicks Checkout: The frontend makes a request to the backend to create a checkout session.
2. Backend Creates Checkout Session: The backend talks to Stripe to create a session with all the line items (products) the user wants to buy.
3. Frontend Redirects to Stripe Checkout: The frontend receives the session ID and redirects the user to Stripe's secure checkout page.
4. User Pays on Stripe Checkout: The user enters their card details on Stripe’s checkout page.
5. Stripe Redirects to Success/Cancel Page: Depending on the payment result, Stripe redirects the user back to your site.

# Stripe Configuration :

import Stripe from "stripe";
import dotenv from 'dotenv'

dotenv.config()

export const = new Stripe(process.env.STRIPE_KEY)

# get the product data and couponCode from req.body

import { stripe } from "../db/stripe.js";

export const createCheckoutSession = async (req, res) => {

    		const { products, couponCode } = req.body;
            if (!Array.isArray(products) || products.length === 0) {
    		return res.status(400).json({ error: "Invalid or empty products array" });
    	}

# Calculate the price and the quantity => also calculate total Price

    	let totalAmount = 0;

    	const lineItems = products.map((product) => {
    		const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
    		totalAmount += amount * product.quantity;

**Predefined Fields:**
The fields **price_data, currency, product_data, name, images, unit_amount, and quantity** are required and predefined by Stripe. You cannot change the names of these fields, as they are part of Stripe’s API specification for defining line items in a checkout session.

    		return {                                          // stripe want this kind of structure that's why we are return like this
    			price_data: {
    				currency: "usd",
    				product_data: {
    					name: product.name,
    					images: [product.image],
    				},
    				unit_amount: amount,
    			},
    			quantity: product.quantity || 1,
    		};
    	});

# create lineItems using map method help us to get above code result and store it like object having {price_data : ,{product_data}}which will use when we creating a strip session

    let totalAmount = 0;

    	const lineItems = products.map((product) => {
    		const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
    		totalAmount += amount * product.quantity;

    		return {
    			price_data: {
    				currency: "usd",
    				product_data: {
    					name: product.name,
    					images: [product.image],
    				},
    				unit_amount: amount,
    			},
    			quantity: product.quantity || 1,
    		};
    	});

# subtract the totalAmount to coupon discount % to show in UI

    	let coupon = null;
    	if (couponCode) {
    		coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
    		if (coupon) {
    			totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
    		}
    	}

# create a session for stripe using stripe API => await stripe.checkout.sessions.create({})

    const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
                discounts: coupon
                    ? [
                            {
                                coupon: await createStripeCoupon(coupon.discountPercentage),
                            },
                    ]
                    : [],
                metadata: {
                    userId: req.user._id.toString(),
                    couponCode: couponCode || "",
                    products: JSON.stringify(
                        products.map((p) => ({
                            id: p._id,
                            quantity: p.quantity,
                            price: p.price,
                        }))
                    ),
                },
            });

# while creating session we need add discount were we need to create a stripeDiscount fun()

    async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
    	percent_off: discountPercentage,
    	duration: "once",
    });

    return coupon.id;

}

# Those whose totalAmount greaterthan 20000 we will create a new coupon for the particular user and user can use the coupon to next purchase

    async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
    	code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    	discountPercentage: 10,
    	expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    	userId: userId,
    });

    await newCoupon.save();

    return newCoupon;

}

# Also create metadata it is part of session addition information about our product it will store in stripe server after make the payment session create and stored, => we will in checkout routes :

    export const checkoutSuccess = async (req, res) => {
    try {
    	const { sessionId } = req.body;
    	const session = await stripe.checkout.sessions.retrieve(sessionId);

    	if (session.payment_status === "paid") {
    		if (session.metadata.couponCode) {
    			await Coupon.findOneAndUpdate(
    				{
    					code: session.metadata.couponCode,
    					userId: session.metadata.userId,
    				},
    				{
    					isActive: false,
    				}
    			);
    		}

# using the session id we will get the meta deata from stripe server it container all information about(product,user) using that we will create a **New order**

    		// create a new Order
    		const products = JSON.parse(session.metadata.products);
    		const newOrder = new Order({
    			user: session.metadata.userId,
    			products: products.map((product) => ({
    				product: product.id,
    				quantity: product.quantity,
    				price: product.price,
    			})),
    			totalAmount: session.amount_total / 100, // convert from cents to dollars,
    			stripeSessionId: sessionId,
    		});

    		await newOrder.save();

    		res.status(200).json({
    			success: true,
    			message: "Payment successful, order created, and coupon deactivated if used.",
    			orderId: newOrder._id,
    		});
    	}
    } catch (error) {
    	console.error("Error processing successful checkout:", error);
    	res.status(500).json({ message: "Error processing successful checkout", error: error.message });
    }

};

// we show then ordered product to user ,it used for shipping ,tracking ,

# Axios :

- In axios we allow you user dynamic path like this '/Product/:id' => instead we need to use provide like this
  `/product/${id}` => we need use backtick

# Zustand Store :

**Zustand Implementation is very easy compare to redux**

**step 1:**

import {create} from 'zustand'

**step 2**

- create is Method which is given to us zustand using that we can create a Store
  const useUserStore = create((set,get)=>({
  user : {name : shanmuga}
  //Logic => key and value pair similar like object => this object we can access it any where inside our componenet
  }))

  **step 3**

  import useUserStore from './store/useUserStore'

  const {user} = useUserStore

  - this is we will access another component using import the store

  **step 4**

### In Zustand, while creating a store inside that we can access the prevState same like useState

set((prevState)=>({
user : prevState.user
}))

Best Practise is always create a global store fetch the data and store it in global store and we can access the store all across any of component

- update,delete,separate by category or any change while fetching axios will hit the server make a change in server side data using mongoDb , In client side you update the main store

# axios Interceptor :(Step by Step)

## How exactly client use refresh token to get new access token ? How the axios interceptor Work ?

- When the user login or sign up server will create a access token and referesh token send as response to browser or client ,this both token is stored in browser cookie , access token expired within 15 min and refresh toke expired in 7 days ,

- with the help of axios interceptor using refresh token we can get new access token from server , But we need to know how exactly axios interceptor work ? - **there are two type of axios interceptor** - In our case we use axios response interceptor to create new token

1. **Request Interceptor:**

A request interceptorruns before Axios sends the request to the server. This is useful when you need to modify or add something to the request, like:

Attaching authentication tokens (e.g., a Bearer token) to every request.
Logging requests for debugging purposes.
Modifying headers or parameters.

2. **Response Interceptor**
   A response interceptor runs before the server's response reaches your application. This is helpful for:

Handling errors globally, like checking for 401 Unauthorized or 500 Server Errors.
Modifying the response data (e.g., formatting or transforming data).
Handling token expiration (as we saw earlier).

Let's see the implementation :

# Detailed Breakdown

## step :1

**axios.interceptors.response.use(...)**
This is like placing a security guard at the door to check every response that comes from the server. The interceptor listens to both successful and failed responses.

**.response.use((response) => response, async (error) => {...})**
This takes two things:

- A function to handle successful responses ((response) => response), which means "if the response is good, just let it pass."
- A function to handle errors (async (error) => {...}), which we'll break down further.

## step :2

**const originalRequest = error.config;**
Imagine this is the original order form you sent to the server (API). If something goes wrong, the interceptor keeps a copy of the form (request) so we can try sending it again later.

## step :3

**if (error.response?.status === 401 && !originalRequest.\_retry)**
Here’s the part where we check for a specific error.
If the error status is 401, that means you are Unauthorized—maybe your access token expired.
The code also checks if we’ve already tried to retry this request using \_retry (so we don’t retry endlessly).

## step:4

originalRequest.\_retry = true;
If we haven't retried yet, we mark this request as "already tried" by setting \_retry = true. This ensures we don’t try to refresh and retry the request over and over in a loop. this will prevent the same request retry again again

**originalRequest.\_retry Explanation**
The originalRequest.\_retry flag ensures that the same request doesn't keep retrying endlessly after getting a 401 error.

**For example:**

The original request fails with a 401 status.
The code retries the request after refreshing the token.
If the token refresh fails, we don't want the code to try refreshing and retrying the same request again and again. So, we mark it with \_retry = true.
**This prevents an infinite retry loop.** Without this flag, the request would keep getting 401, retrying, and failing, which could cause an endless loop of retries.

## step:5

**Token Refresh Logic**
This is where the code tries to refresh the token.

if (refreshPromise)
Before starting a new refresh process, it checks if there’s already a token refresh happening (maybe another request already triggered it).
Think of this as checking if the cashier is already helping someone, so you wait in line.

await refreshPromise;
If there’s already a refresh happening, we wait for it to finish before continuing.

return axios(originalRequest);
Once the refresh is done, we try sending the original request again with the fresh token.

refreshPromise = useUserStore.getState().refreshToken();
If no refresh is in progress, we start the process of refreshing the token. The refreshToken() function will get a new token from the server. This is like asking for a new ticket to access the club after your old one expired.

await refreshPromise; refreshPromise = null;
Once the refresh is complete, we set refreshPromise back to null, meaning the refresh process is done, so other requests won’t wait for it anymore.

**if (refreshPromise) Explanation**
The if (refreshPromise) block is **specifically to handle multiple requests** that all fail at the same time due to the expired token. It ensures that only one token refresh happens, and other requests wait for it.

Here’s the difference in purpose:

**originalRequest.\_retry:**
Prevents the same request from endlessly retrying if the token refresh fails.

**if (refreshPromise):**
Prevents multiple requests from starting multiple refreshes of the token at the same time. It ensures that all requests wait for the same refresh rather than triggering their own.

## Step: 6

**What if refreshing the token fails?**

catch (refreshError)
This catches any errors during the refresh process.

useUserStore.getState().logout();
If the token refresh fails (e.g., your session is invalid or expired for good), we log the user out of the system. This is like saying, "Sorry, you’re not allowed in anymore, please leave the club and log in again."

return Promise.reject(refreshError);
Here, the error is returned, and the system can decide how to handle it further, like showing a login page.

## step : 7

**return Promise.reject(error);**
If the error isn’t a 401 or something else fails, we just reject the error. This means we pass the error to the rest of the app, and it can handle the failure however it wants.

axios.interceptors.response.use(
(response) => response,
async (error) => {
const originalRequest = error.config;
if (error.response?.status === 401 && !originalRequest.\_retry) {
originalRequest.\_retry = true;

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
    		} catch (refreshError) {
    			// If refresh fails, redirect to login or handle as needed
    			useUserStore.getState().logout();
    			return Promise.reject(refreshError);
    		}
    	}
    	return Promise.reject(error);
    }

);

    refreshToken: async () => {
    	// Prevent multiple simultaneous refresh attempts
    	if (get().checkingAuth) return; **overhere our checkAuth function will make the CheckingAuth as false when user face unauthorized error **

    	set({ checkingAuth: true });
    	try {
    		const response = await axios.post("/auth/refresh-token");
    		set({ checkingAuth: false });
    		return response.data;
    	} catch (error) {
    		set({ user: null, checkingAuth: false });
    		throw error;
    	}
    },

}));

**refreshPromise = useUserStore.getState().refreshToken();**

**useUserStore.getState():** You use this method to access the current Zustand store outside of React components. It returns the current state or allows you to call actions (functions) directly.

Global Access: Unlike some other state management tools, Zustand allows you to interact with the state globally, even outside of React’s context. This is useful for cases like:

Axios interceptors.
Utility functions.
Middleware logic that doesn’t involve React components.

You can directly access the **Zustand store **outside of React components by using **getState()** to retrieve both the state and actions of the store.
No need to use the useUserStore() hook inside non-component code, just use useUserStore.getState().

# flow => This is how retry_flag protect from Subsequent Requests (or Infinite Loop Prevention)

- First Request with Token Expired (401):
- The user makes a request with an expired token.
- The server responds with 401 Unauthorized.
- The error interceptor catches the error.
- The code checks if (error.response?.status === 401 && !originalRequest.\_retry).
- At this point, originalRequest.\_retry is undefined (or false), so the request hasn’t been retried yet.
- originalRequest.\_retry = true; is set to prevent future retries for this specific request.
- Token refresh logic occurs.
- The original request is retried with the new token using axios(originalRequest).
- Retry Request with New Token:
- The original request configuration (originalRequest) is retried after the token refresh, using the new token in its headers.
- The response that comes back from the server after retrying is completely new.
- The **interceptor logic that checks originalRequest**(using this only we are making request ).\_retry is still based on the preserved original request configuration (not the response object).
- If this retried request fails again with another 401, the \_retry flag is now true, so the request will not be retried again.

**Final Workflow Example:**
User makes a request → token is expired → 401 Unauthorized.
Check if \_retry is false → It is, so set \_retry = true → attempt token refresh → retry original request with new token.
If still 401 Unauthorized → no retry (since \_retry = true) → return the error to the user.

# Promise.reject(error);

- Promise.reject(error) is used to create and return a rejected promise.
- It allows error handling mechanisms like .catch() or try...catch to be aware of the failure in the asynchronous flow.
- It provides a clean way to propagate errors in promise chains.

# Step to Deploy Projects:

## Step 1 :

Frist we need to push all our code in git-hub before pushing chack every is working perfect or not , clear all the consoleLog and check whether it is any error in console.log and also check all .env file all the key are present or not , Before pushing our code to git hub , we need to follow some steps :

- create a script for npm install for both front end and backend , why because we are not going to push the nodemodule folder in git-hub,we need to install dependency in production environment , that's reason we need to create a script

"start":node backend/server.js,
"build" : npm install && npm install --prefix frontend && npm run build --prefix frontend

As you already knoew that when we run the npm run build it will create a **disct folder** , optimise version of our app and all our application code will converted in to three file, js,css,html in to dist folder

## Step 2:

import path from 'path';
const \_\_dirname = path.resolve(); => this command gives the root path our application

**After all the Endpoint**

we need the check currently our application is running in which Environment mode "development" or "production"

    if(process.env.NODE_ENV === 'production'){
    	app.use(express.static(path.join(\_\_dirname,"/frontend/dist")))

- this is the way we are telling to the express use this file as a static, server will sever this file when it required

  app.get("\*",(req,res)=>{
  res.sendFile(\_\_dirname,"frontend","dist","index.html")
  })

In my understanding , first user coming to our side , definitely it is going to get request , no matter whatever the path might be , server will send the response as index.html page of our react app , once the user receive the index.html of our react app using that user can make request to the server and also he can navigate different page with the help of react router dom with reloading our whole page . user make any request using our react application to server
}

## Step 3 :

Create NODE_ENV = " development"

- In production we make them as production

## step 4:

- Makesure mention the .env and node_module in .ignore file
- Intilisize the git using git command

git add .
git commit -m "project completed "

create a repo in git-hub push all our application code to git-hub(Git-hud will provide the code just copy and paste it)

## Step 5:

- We are using render.com to deploy our MERN stack application => In render.com via open our git-hub ecommerce code after that create a build field command => npm run build

- To start => npm run start
- Select add from .env file option paste all our .env code overhere
- delete the NODE_ENV

- once it loading you will get the **link**

But how it running ,while creating axios instance we have provided the path see the below code example

const axiosInstance = axios.create({
**baseURL: import.meta.mode === "development" ? 'http://localhost:5000/api' : '/api',**
withCredentials: true, // It help uo to send the cookie to server for each n every request

})

## step 6 :

once we get the link we need to make change in CLIENT_URL = "production code url", why we need to change in stripe payment code when the payment is success file will move to success page there we provide the CLIENT_URL ,indevelopement it is perfectly fine , but in production we need to change the URl
