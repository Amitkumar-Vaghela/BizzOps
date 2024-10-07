import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Sidebar from "../Sidebar";
import CustomBtn from "../CustomBtn";
import axios from "axios";

function Report() {

    const [totalSale, setTotalSales] = useState(0)
    const [todaySale, setTodaySales] = useState(0)
    const [MonthSale, setMonthSales] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)
    const [todayProfit, setTodayProfit] = useState(0)
    const [monthProfit, setMonthProfit] = useState(0)
    const [totalCost, setTotalCost] = useState(0)
    const [totalNetIncome, setTotalNetIncome] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)
    const [orders, setOrders] = useState(0)
    const [pendingOrders, setPendingOrders] = useState(0)
    const [invoices, setInvoices] = useState(0)
    const [unpaidInvoices, setUnpaidInvoices] = useState(0)
    const [customers, setCustomers] = useState(0)

    const fetchData = async () => {
        try {
            const totalSaleResponse = await axios.get("http://localhost:8000/api/v1/sales/get-total-alltime-sale", { withCredentials: true })
            const monthSaleResponse = await axios.get("http://localhost:8000/api/v1/sales/get-total-last30Day-sale", { withCredentials: true })
            const todaySaleResponse = await axios.get("http://localhost:8000/api/v1/sales/get-total-oneday-sale", { withCredentials: true })
            const monthProfitResponse = await axios.get("http://localhost:8000/api/v1/sales/get-total-last30Day-profit", { withCredentials: true })
            const totalProfitResponse = await axios.get("http://localhost:8000/api/v1/sales/get-total-alltime-profit", { withCredentials: true })
            const todayProfitResponse = await axios.get("http://localhost:8000/api/v1/sales/get-total-one-profit", { withCredentials: true })
            const totalCostResponse = await axios.get("http://localhost:8000/api/v1/sales/get-total-alltime-cost", { withCredentials: true })
            const totalExpenseResponse = await axios.get("http://localhost:8000/api/v1/expense/get-alltime-expense", { withCredentials: true })
            const orderResponse = await axios.get("http://localhost:8000/api/v1/orders/count-order", { withCredentials: true })
            const pendingOrderResponse = await axios.get("http://localhost:8000/api/v1/orders/get-pending-order", { withCredentials: true })
            const invoicesResponse = await axios.get("http://localhost:8000/api/v1/invoice/count-invoice", { withCredentials: true })
            const unpaidInvoicesResponse = await axios.get("http://localhost:8000/api/v1/invoice/unpaid-invoice", { withCredentials: true })
            const customersResponse = await axios.get("http://localhost:8000/api/v1/customer/count-customer", { withCredentials: true })

            setTotalSales(totalSaleResponse.data.data.totalSalesValue)
            setMonthSales(monthSaleResponse.data.data.totalSalesValue)
            setTodaySales(todaySaleResponse.data.data.totalSalesValue)
            setTotalProfit(totalProfitResponse.data.data.totalProfitValue)
            setMonthProfit(monthProfitResponse.data.data.totalProfitValue)
            setTodayProfit(todayProfitResponse.data.data.totalProfitValue)
            setTotalCost(totalCostResponse.data.data.totalCostValue)
            setTotalExpense(totalExpenseResponse.data.data.totalExpenseValue)
            setTotalNetIncome(totalProfit - totalExpense)
            setOrders(orderResponse.data.data.totalOrders)
            setPendingOrders(pendingOrderResponse.data.data.pendingCount)
            setInvoices(invoicesResponse.data.data.invoiceCount)
            setUnpaidInvoices(unpaidInvoicesResponse.data.data.totalUnpaidAmount)
            setCustomers(customersResponse.data.data.count)

        } catch (error) {
            console.error("Error while fetching data: ", error)
        }

    }

    useEffect(() => {
        fetchData();
    }, [])

    const [grossProfitMargin, setGrossProfitMargin] = useState(0);
    const [netProfitMargin, setNetProfitMargin] = useState(0);
    const [avgSalePerOrder, setAvgSalePerOrder] = useState(0);
    const [profitPerOrder, setProfitPerOrder] = useState(0);
    const [expenseRatio, setExpenseRatio] = useState(0);
    const [pendingInvoiceRatio, setPendingInvoiceRatio] = useState(0);

    const [monthlyGrossProfitMargin, setMonthlyGrossProfitMargin] = useState(0);
    const [monthlyNetProfitMargin, setMonthlyNetProfitMargin] = useState(0);
    const [monthlyAvgSalePerOrder, setMonthlyAvgSalePerOrder] = useState(0);
    const [monthlyProfitPerOrder, setMonthlyProfitPerOrder] = useState(0);
    const [monthlyExpenseRatio, setMonthlyExpenseRatio] = useState(0);

    const [dailyGrossProfitMargin, setDailyGrossProfitMargin] = useState(0);
    const [dailyNetProfitMargin, setDailyNetProfitMargin] = useState(0);
    const [dailyAvgSalePerOrder, setDailyAvgSalePerOrder] = useState(0);
    const [dailyProfitPerOrder, setDailyProfitPerOrder] = useState(0);
    const [dailyExpenseRatio, setDailyExpenseRatio] = useState(0);

    useEffect(() => {
        if (totalSale > 0) {
            setGrossProfitMargin((totalProfit / totalSale) * 100);
            setNetProfitMargin((totalNetIncome / totalSale) * 100);
            setAvgSalePerOrder(totalSale / orders);
            setProfitPerOrder(totalProfit / orders);
            setExpenseRatio((totalExpense / totalSale) * 100);
            setPendingInvoiceRatio((unpaidInvoices / invoices) * 100);
        }
    }, [totalSale, totalProfit, totalNetIncome, totalExpense, orders, invoices, unpaidInvoices]);

    useEffect(() => {
        if (MonthSale > 0) {
            setMonthlyGrossProfitMargin((monthProfit / MonthSale) * 100);
            setMonthlyNetProfitMargin((monthProfit - totalExpense) / MonthSale * 100);
            setMonthlyAvgSalePerOrder(MonthSale / orders);
            setMonthlyProfitPerOrder(monthProfit / orders);
            setMonthlyExpenseRatio((totalExpense / MonthSale) * 100);
        }
    }, [MonthSale, monthProfit, totalExpense, orders]);

    useEffect(() => {
        if (todaySale > 0) {
            setDailyGrossProfitMargin((todayProfit / todaySale) * 100);
            setDailyNetProfitMargin((todayProfit - totalExpense) / todaySale * 100);
            setDailyAvgSalePerOrder(todaySale / orders);
            setDailyProfitPerOrder(todayProfit / orders);
            setDailyExpenseRatio((totalExpense / todaySale) * 100);
        }
    }, [todaySale, todayProfit, totalExpense, orders]);

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-200">
                    <CustomBtn />
                    <h1 className="m-10 text-2xl font-medium font-font4 flex items-center"> <FontAwesomeIcon icon={faArrowLeft} className="text-md pr-2" onClick={() => navigate('/dashboard')} /> Report</h1>
                    <div className="justify-center items-center flex flex-col">

                        <div className="m-5 w-5/6 bg-white rounded-xl">
                            <h1 className="text-base mt-2 font-medium font-font4 text-center">All Time Report</h1>
                            <div className="flex justify-center items-center gap-5 m-8">
                                <label className="m-2 font-font4 font-medium">Total Sale</label>
                                <input
                                    type="text"
                                    value={totalSale}
                                    readOnly
                                    className="w-1/6 text-center h-10 rounded-2xl bg-gray-200 font-font4 font-medium hover:border-black hover:border-2"
                                />
                                <label className="m-2 font-font4 font-medium">Total Profit</label>
                                <input
                                    type="text"
                                    value={totalProfit.toFixed(2)}
                                    readOnly
                                    className="w-1/6 font-medium text-center h-10 rounded-2xl bg-gray-200 font-font4 hover:border-black hover:border-2"
                                />
                                <label className="m-2 font-font4 font-medium">Total Cost</label>
                                <input
                                    type="text"
                                    value={totalCost.toFixed(2)}
                                    readOnly
                                    className="w-1/6 text-center h-10 rounded-2xl bg-gray-200 font-font4 font-medium hover:border-black hover:border-2"
                                />
                            </div>
                            <div className="flex justify-center items-center gap-5 m-8">
                                <label className="font-font4 font-medium">Gross Profit Margin</label>
                                <input
                                    type="text"
                                    value={grossProfitMargin.toFixed(0)}
                                    readOnly
                                    className="w-1/12 text-center h-10 rounded-2xl bg-gray-200 font-font4 font-medium hover:border-black hover:border-2"
                                />
                                <label className="font-font4 font-medium">Net Profit Margin</label>
                                <input
                                    type="text"
                                    value={netProfitMargin.toFixed(2)}
                                    readOnly
                                    className="w-1/12 font-medium text-center h-10 rounded-2xl bg-gray-200 font-font4 hover:border-black hover:border-2"
                                />
                                <label className="font-font4 font-medium">Avg Sale/Order</label>
                                <input
                                    type="text"
                                    value={avgSalePerOrder.toFixed(2)}
                                    readOnly
                                    className="w-1/6 text-center h-10 rounded-2xl bg-gray-200 font-font4 font-medium hover:border-black hover:border-2"
                                />
                            </div>
                        </div>

                        <div className="m-5 w-5/6">

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Report