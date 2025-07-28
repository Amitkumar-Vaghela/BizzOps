import axios from 'axios';
import * as XLSX from "xlsx";

function SalesTable({ sales }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };
    const fetchAndDownload = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/get-sale?timeFilter=alltime`, { withCredentials: true });
            const salesData = response.data.data;

            if (!salesData || salesData.length === 0) {
                alert("No data to download");
                return;
            }

            // Transform data if necessary
            const formattedData = salesData.map(item => ({
                Product: item.productName,
                Price: item.price,
                ProfitPercent: item.profitInPercent,
                Qty: item.qty,
                Date: new Date(item.date).toLocaleDateString(),
            }));

            // Convert data to Excel
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

            // Export Excel file
            XLSX.writeFile(workbook, "Sales.xlsx");
        } catch (error) {
            console.error("Error fetching or downloading sales data:", error);
            alert("Failed to download the file.");
        }
    };

    return (
        <div className="w-full bg-[#28282B] shadow-md rounded-lg p-6">
            <div className="flex gap-10 h-20 items-center">
                <h2 className="text-base font-poppins font-semibold mb-4 text-white">Sales Records</h2>
                <button
                    onClick={fetchAndDownload}
                    className="bg-white h-1/2 text-black py-2 px-4 rounded-xl"
                >
                    Download
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full ">
                    <thead>
                        <tr className="bg-zinc-900">
                            <th className="px-4 py-2 text-white font-poppins">Date</th>
                            <th className="px-4 py-2 text-white font-poppins">Product</th>
                            <th className="px-4 py-2 text-white font-poppins">Price</th>
                            <th className="px-4 py-2 text-white font-poppins">Quantity</th>
                            <th className="px-4 py-2 text-white font-poppins">Total</th>
                            <th className="px-4 py-2 text-white font-poppins">Profit</th>
                            <th className="px-4 py-2 text-white font-poppins">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length > 0 ? (
                            sales.map((sale) => (
                                <tr key={sale._id} className="text-center">
                                    <td className="px-4 py-4 text-white text-sm font-poppins">{formatDate(sale.date)}</td>
                                    <td className="px-4 py-4 text-white text-sm font-poppins">{sale.productName}</td>
                                    <td className="px-4 py-4 text-white text-sm font-poppins">₹{sale.price.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-white text-sm font-poppins">{sale.qty}</td>
                                    <td className="px-4 py-4 text-white font-poppins font-medium text-sm">₹{(sale.price * sale.qty).toFixed(2)}</td>
                                    <td className="px-4 py-4 text-[#87ff8b] font-poppins text-sm font-normal">₹ {sale.profit}</td>
                                    <td className="px-4 py-4 text-[#ff7676] font-poppins text-sm font-normal">₹ {sale.cost}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center px-4 py-2 border font-poppins">
                                    No sales data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SalesTable;