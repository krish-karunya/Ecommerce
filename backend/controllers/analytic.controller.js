import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";

export const getAnalyticsData = async () => {

    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            }
        }
    ])

    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 }

    return { users: totalUsers, products: totalProducts, totalSales, totalRevenue }


}


export const getDailySalesData = async (startDate, endDate) => {
    try {
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                }

            },
            { $sort: { _id: 1 } }
        ])


        // example of dailySalesData
        // [
        // 	{
        // 		_id: "2024-08-18",
        // 		sales: 12,
        // 		revenue: 1450.75
        // 	},
        // ]

        const dateArray = getDatesInRange(startDate, endDate);
        // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]


        return dateArray.map((date) => {
            const foundData = dailySalesData.find((item) => item._id === date);
            // console.log(foundData, "Result");

            return {
                date,
                sales: foundData?.totalSales || 0,
                revenue: foundData?.totalRevenue || 0,
            };
        });
    } catch (error) {
        throw error
    }
}

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        // Inside the loop, the current date is formatted into a string in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ), and the part before the "T" (i.e., YYYY-MM-DD) is extracted using .split("T")[0].
        // If currentDate is 2024-10-07T12:00:00Z, currentDate.toISOString().split("T")[0] will return "2024-10-07".
        dates.push(currentDate.toISOString().split("T")[0]);

        // This line increments currentDate by one day.
        // currentDate.getDate() returns the day of the month for currentDate, and setDate() updates it by adding 1.
        // For example, if currentDate is October 7, it becomes October 8 after this line.

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}