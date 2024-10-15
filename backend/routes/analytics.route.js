import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytic.controller.js'



const router = express.Router();



router.get('/', protectRoute, adminRoute, async (req, res) => {
    try {
        // Data for analytics data top portion of page :
        const analyticsData = await getAnalyticsData();

        // Data for graph data :
        const endDate = new Date();


        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);  // 7days back 
        // console.log(startDate);

        const dailySalesData = await getDailySalesData(startDate, endDate);
        console.log(dailySalesData);

        res.json({
            analyticsData,
            dailySalesData
        })

    } catch (error) {
        console.log("Error in getAnalyticsData routes", error.message);
        res.status(500).json({ message: `Server Error: ${error.message}` })
    }

});
export default router