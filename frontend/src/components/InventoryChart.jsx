import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const InventoryChart = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [error, setError] = useState("");

  // Fetch inventory data from the API
  const fetchInventoryData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken"); // Get the token from localStorage

      if (!accessToken) {
        throw new Error("Access token not found. Please login again.");
      }

      const response = await axios.get("http://localhost:8000/api/v1/inventory/get-item",{withCredentials:true});

      if (response.status === 200) {
        setInventoryData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: inventoryData.map((item) => item.item), // Item names for labels
    datasets: [
      {
        label: "Stock Remaining",
        data: inventoryData.map((item) => item.stockRemain), // Stock data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Inventory Stock Levels</h2>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Bar height={30} width={30} data={chartData} />
      )}
    </div>
  );
};

export default InventoryChart;
