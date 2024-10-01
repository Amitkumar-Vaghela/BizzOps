import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SalesTable({ sales }) {
  const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
  };

  return (
      <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-poppins mb-4 text-gray-800">Sales Records</h2>
          <table className="min-w-full">
              <thead>
                  {/* Table headers */}
              </thead>
              <tbody>
                  {sales.length > 0 ? (
                      sales.map((sale) => (
                          <tr key={sale._id} className="border-b">
                              <td className="px-4 py-2">{formatDate(sale.date)}</td>
                              <td className="px-4 py-2">{sale.productName}</td>
                              <td className="px-4 py-2">₹{sale.price.toFixed(2)}</td>
                              <td className="px-4 py-2">{sale.qty}</td>
                              <td className="px-4 py-2">₹{(sale.price * sale.qty).toFixed(2)}</td>
                              <td className="px-4 py-2 text-green-400 font-bold">₹{sale.profit}</td>
                              <td className="px-4 py-2 text-red-400 font-medium">₹{sale.cost}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan="7" className="text-center px-4 py-2">No sales data available.</td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>
  );
}

export default SalesTable;


