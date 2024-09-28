import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const ProfitChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const fetchProfitData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/sales/get-daily-profit-30Day", { withCredentials: true });

                // Log the received data for debugging
                console.log('Profit Data:', response.data.data);

                const labels = Object.keys(response.data.data); // Extract date labels
                const profitValues = Object.values(response.data.data); // Extract corresponding profit values

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
                                label: 'Daily Profit',
                                data: profitValues,
                                fill: false,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                tension: 0.1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Profit Value',
                                },
                            },
                        },
                    },
                });
            } catch (error) {
                console.error('Error fetching profit data:', error.response ? error.response.data : error.message);
            }
        };

        fetchProfitData();

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <canvas ref={chartRef} className="w-80 h-80" />
    );
};

export default ProfitChart;
