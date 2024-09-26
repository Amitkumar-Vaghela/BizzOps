import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SalesTable() {
  const [sales, setSales] = useState([]);
  const [timeFilter, setTimeFilter] = useState('alltime');

  useEffect(() => {
    const fetchSales = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/v1/sales/get-sale?timeFilter=${timeFilter}`,{withCredentials:true});
          if (response.data.success && Array.isArray(response.data.data)) {
            setSales(response.data.data);
          } else {
            console.error('Unexpected response structure:', response.data);
          }
        } catch (error) {
          console.error('Failed to fetch sales:', error);
        }
      };
      
    fetchSales();
  }, [timeFilter]);

  const handleFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-poppins mb-4 text-gray-800">
        Sales Records
      </h2>
      <div className="mb-4 flex gap-2">
        <button onClick={() => handleFilterChange('oneday')} className="bg-blue-500 text-white px-4 py-2 rounded">
          One Day Sale
        </button>
        <button onClick={() => handleFilterChange('past30days')} className="bg-blue-500 text-white px-4 py-2 rounded">
          Past 30 Days
        </button>
        <button onClick={() => handleFilterChange('alltime')} className="bg-blue-500 text-white px-4 py-2 rounded">
          All Time
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Product </th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Total Sale</th>
            <th className="px-4 py-2">Profit</th>
            <th className="px-4 py-2">Cost</th >
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale._id} className="border-b">
                <td className="px-4 py-2">{formatDate(sale.date)}</td>
                <td className="px-4 py-2">{sale.productName}</td>
                <td className="px-4 py-2">₹{sale.price.toFixed(2)}</td>
                <td className="px-4 py-2">{sale.qty}</td>
                <td className="px-4 py-2">₹{sale.sale ? sale.sale.toFixed(2) : (sale.price * sale.qty).toFixed(2)}</td>
                <td className="px-4 py-2 text-green-400 font-bold">₹{sale.profit ? sale.profit.toFixed(2) : 'N/A'}</td>
                <td className="px-4 py-2 text-red-400 font-medium">₹{sale.cost ? sale.cost.toFixed(2) : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center px-4 py-2">
                No sales data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


export default SalesTable;