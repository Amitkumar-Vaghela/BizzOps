import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Sales } from "../models/sales.model.js";
import { Inventory } from "../models/inventory.model.js";

const addSale = asyncHandler(async (req, res) => {
    const { product, price, profitInPercent, qty, date } = req.body;
    const owner = req.user?._id;

    if (!product || !price || !profitInPercent || !qty || !date) {
        throw new ApiError(400, "All fields are required");
    }

    const inventoryItem = await Inventory.findById(product);
    if (!inventoryItem) {
        throw new ApiError(404, "Product not found in inventory");
    }

    if (inventoryItem.stockRemain < qty) {
        throw new ApiError(400, "Not enough stock available");
    }

    const totalSale = (price*qty);
    const totalProfit = (totalSale*profitInPercent)/100;

    const newSale = await Sales.create({
        owner,
        product,
        price,
        profitInPercent,
        qty,
        sale: totalSale,
        profit: totalProfit,
        date: new Date(date)
    });


    return res
    .status(201)
    .json(new ApiResponse(201, newSale, "Sale added successfully"));
});

const getSales = asyncHandler(async(req,res)=>{
    const { timeFilter } = req.params; 
    const ownerId = req.user?._id;

    let filter = { owner: ownerId }; 


    switch (timeFilter) {
        case 'oneday':
            const oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1));
            filter.date = { $gte: oneDayAgo };
            break;
        case 'past30days':
            const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
            filter.date = { $gte: thirtyDaysAgo };
            break;
        case 'alltime':
        default:
            break;
    }

    const sales = await Sales.find(filter);
    return res
    .status(200)
    .json(new ApiResponse(200,sales,"sales get successfull"));
})

const getTotalSalesValueOneDay = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const result = await Sales.aggregate([
        { $match: { owner: ownerId, date: { $gte: startOfToday } } },
        { 
            $group: {
                _id: null,
                totalSalesValue: { $sum: "$sale" },
            },
        },
    ]);

    console.log(result)

    const totalSalesValue = result.length > 0 ? result[0].totalSalesValue : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { totalSalesValue }, "Total sales value for one day retrieved successfully"));
});

const getTotalSalesValueLast30Days = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;

    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));

    const result = await Sales.aggregate([
        { $match: { owner: ownerId, date: { $gte: thirtyDaysAgo } } },
        { 
            $group: {
                _id: null,
                totalSalesValue: { $sum: "$sale" }
            }
        }
    ]);

    const totalSalesValue = result.length > 0 ? result[0].totalSalesValue : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { totalSalesValue }, "Total sales value for past 30 days retrieved successfully"));
});

const getTotalSalesValueAllTime = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;

    const result = await Sales.aggregate([
        { $match: { owner: ownerId } },
        { 
            $group: {
                _id: null,
                totalSalesValue: { $sum: "$sale" }
            }
        }
    ]);

    const totalSalesValue = result.length > 0 ? result[0].totalSalesValue : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { totalSalesValue }, "Total sales value for all time retrieved successfully"));
});

const getTotalProfitValueOneDay = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const result = await Sales.aggregate([
        { $match: { owner: ownerId, date: { $gte: startOfToday } } },
        { 
            $group: {
                _id: null,
                totalProfitValue: { $sum: "$profit" }, // Summing the profit field
            },
        },
    ]);

    const totalProfitValue = result.length > 0 ? result[0].totalProfitValue : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { totalProfitValue }, "Total profit value for one day retrieved successfully"));
});

const getTotalProfitValueLast30Days = asyncHandler(async(req, res)=>{
    const ownerId = req.user?._id
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    
    const result = await Sales.aggregate([
        {$match:{owner:ownerId, date:{$gte:thirtyDaysAgo}}},
        {
            $group:{
                _id:null,
                totalProfitValue : {$sum:"$profit"}
            }
        }
    ])

    const totalProfitValue = result.length > 0 ? result[0].totalProfitValue : 0 

    return res
    .status(200)
    .json(new ApiResponse(200,{totalProfitValue},"Total profit value for last 30 days retrived successfull"))
})


export { 
    addSale,
    getSales,
    getTotalSalesValueOneDay,
    getTotalSalesValueAllTime,
    getTotalSalesValueLast30Days,
    getTotalProfitValueOneDay,
    getTotalProfitValueLast30Days,
};




/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesForm = () => {
    const [inventory, setInventory] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [profitPercentage, setProfitPercentage] = useState(0);
    const [sales, setSales] = useState([]);
    const [timeFilter, setTimeFilter] = useState('alltime');

    // Fetch inventory items when the component mounts
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('/api/inventory');
                setInventory(response.data);
            } catch (error) {
                console.error('Failed to fetch inventory items:', error);
            }
        };
        fetchInventory();
    }, []);

    // Fetch sales based on the selected time filter
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get(`/api/sales/${timeFilter}`);
                setSales(response.data);
            } catch (error) {
                console.error('Failed to fetch sales:', error);
            }
        };
        fetchSales();
    }, [timeFilter]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const saleData = {
            product: selectedProduct,
            qty: quantity,
            Price: price,
            ProfitInPercent: profitPercentage,
            date: new Date()
        };

        try {
            await axios.post('/api/sales', saleData);
            alert('Sale recorded successfully');
        } catch (error) {
            console.error('Failed to record sale:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="product">Product:</label>
                <select 
                    id="product" 
                    value={selectedProduct} 
                    onChange={(e) => setSelectedProduct(e.target.value)} 
                    required
                >
                    <option value="" disabled>Select a product</option>
                    {inventory.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.item} - {item.category} (Stock: {item.stockRemain})
                        </option>
                    ))}
                </select>

                <label htmlFor="quantity">Quantity:</label>
                <input 
                    type="number" 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    min="1" 
                    required 
                />

                <label htmlFor="price">Price:</label>
                <input 
                    type="number" 
                    id="price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    min="0" 
                    required 
                />

                <label htmlFor="profitPercentage">Profit Percentage:</label>
                <input 
                    type="number" 
                    id="profitPercentage" 
                    value={profitPercentage} 
                    onChange={(e) => setProfitPercentage(e.target.value)} 
                    min="0" 
                    required 
                />

                <button type="submit">Submit Sale</button>
            </form>

            <div>
                <button onClick={() => setTimeFilter('oneday')}>One Day Sale</button>
                <button onClick={() => setTimeFilter('past30days')}>Past 30 Days</button>
                <button onClick={() => setTimeFilter('alltime')}>All Time</button>
            </div>

            <h2>Sales List</h2>
            <ul>
                {sales.map((sale) => (
                    <li key={sale._id}>
                        {sale.productName} - {sale.qty} units - ${sale.Price}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default SalesForm;

*/