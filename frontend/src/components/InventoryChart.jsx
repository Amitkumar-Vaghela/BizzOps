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

      const response = await axios.get("http://localhost:8000/api/v1/inventory/get-item", { withCredentials: true });

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

  // Generate an array of random colors for each bar
  const generateColors = (length) => {
    const colors = [];
    for (let i = 0; i < length; i++) {
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.6)`;
      colors.push(color);
    }
    return colors;
  };

  // Prepare data for the chart
  const chartData = {
    labels: inventoryData.map((item) => item.item), // Item names for labels
    datasets: [
      {
        label: "Stock Remaining",
        data: inventoryData.map((item) => item.stockRemain), // Stock data
        backgroundColor: generateColors(inventoryData.length), // Different colors for each bar
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Bar
          height={10}
          width={15}
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Items",
                  font: {
                    family: "Helvetica",
                    size: 14,
                    style: "normal",
                    weight: "bold",
                  },
                  color: "rgba(0, 0, 0, 0.87)",
                },
                grid: {
                  display: false,
                },
                ticks: {
                  display: true,
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Stock Remaining",
                  font: {
                    family: "Helvetica",
                    size: 14,
                    style: "normal",
                    weight: "bold",
                  },
                  color: "rgba(0, 0, 0, 0.87)",
                },
                grid: {
                  display: false,
                },
                ticks: {
                  display: true,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default InventoryChart;
