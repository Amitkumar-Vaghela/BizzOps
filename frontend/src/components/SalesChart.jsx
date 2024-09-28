import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const SalesChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/sales/get-daily-sale-30Day", { withCredentials: true });

                // Log the received data for debugging
                console.log('Sales Data:', response.data.data);

                const labels = Object.keys(response.data.data); // Extract date labels
                const salesValues = Object.values(response.data.data); // Extract corresponding sales values

                // Destroy the previous chart instance if it exists
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                // Create the chart instance
                chartInstanceRef.current = new Chart(chartRef.current, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Total Sales',
                                data: salesValues,
                                fill: false,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                tension: 0.1,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color under the line (if fill is true)
                                pointRadius: 5, // Size of data points
                                pointBackgroundColor: 'rgba(1, 1, 1, 1)', // Color of data points
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true, // Set to false if you want to hide the legend
                            },
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false, // Hide x-axis grid lines
                                },
                                title: {
                                    display: false, // Hide the x-axis title
                                },
                                ticks: {
                                    display: false, // Hide the x-axis labels
                                },
                            },
                            y: {
                                grid: {
                                    display: false, // Hide y-axis grid lines
                                },
                                title: {
                                    display: false, // Hide the y-axis title
                                },
                                ticks: {
                                    display: false, // Hide the y-axis labels
                                },
                            },
                        },
                    },
                });
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchSalesData();

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <canvas
            ref={chartRef}
            className="w-80 h-80"
            style={{ backgroundColor: 'transparent' }} // Set background color to transparent
        />
    );
};

export default SalesChart;
