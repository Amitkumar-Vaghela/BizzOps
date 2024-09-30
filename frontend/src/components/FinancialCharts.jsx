import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const FinancialChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  // Fetching data from all APIs
  const fetchData = async () => {
    try {
      const [profitResponse, costResponse, salesResponse, expenseResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/v1/sales/get-daily-profit-30Day", { withCredentials: true }),
        axios.get("http://localhost:8000/api/v1/sales/get-daily-cost-30Day", { withCredentials: true }),
        axios.get("http://localhost:8000/api/v1/sales/get-daily-sale-30Day", { withCredentials: true }),
        axios.get("http://localhost:8000/api/v1/expense/get-daily-expense", { withCredentials: true }), // Add your expense API endpoint here
      ]);

      const profitData = profitResponse.data.data;
      const costData = costResponse.data.data;
      const salesData = salesResponse.data.data;
      const expenseData = expenseResponse.data.data;

      const combinedData = Object.keys(profitData).reduce((acc, date) => {
        acc[date] = {
          profit: profitData[date] || 0,
          cost: costData[date] || 0,
          sales: salesData[date] || 0,
          expense: expenseData[date] || 0,
        };
        return acc;
      }, {});

      setChartData({
        labels: Object.keys(combinedData),
        datasets: [
          {
            label: "Profit",
            data: Object.values(combinedData).map((d) => d.profit),
            borderColor: "rgba(31, 244, 3, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
          },
          {
            label: "Cost",
            data: Object.values(combinedData).map((d) => d.cost),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
          },
          {
            label: "Sales",
            data: Object.values(combinedData).map((d) => d.sales),
            borderColor: "rgba(0, 123, 255, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
          },
          {
            label: "Expenses",
            data: Object.values(combinedData).map((d) => d.expense),
            borderColor: "rgba(255, 206, 86, 1)",
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        chartData && (
          <Line
            data={chartData}
            options={{
              scales: {
                x: { display: false },
                y: {
                  beginAtZero: false,
                  grid: {
                    display: false, // Remove grid lines
                  },
                },
              },
            }}
          />
        )
      )}
    </div>
  );
};

export default FinancialChart;
