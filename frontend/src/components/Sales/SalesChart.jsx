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


                const labels = Object.keys(response.data.data); 
                const salesValues = Object.values(response.data.data); 
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                chartInstanceRef.current = new Chart(chartRef.current, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Total Sales',
                                data: salesValues,
                                fill: true,
                                borderColor: 'rgba(0, 123, 255, 1)',
                                tension: 0.1,
                                pointRadius: 2,
                                pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                                labels: {
                                    color: 'rgba(0, 0, 0, 0.87)',
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date', 
                                    font: {
                                        family: 'Helvetica',
                                        size: 14,
                                        style: 'normal',
                                        weight: 'bold', 
                                    },
                                    color: 'rgba(0, 0, 0, 0.87)',
                                },
                                grid: {
                                    display: false,
                                },
                                ticks: {
                                    display: false, 
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Sale',
                                    font: {
                                        family: 'Helvetica',
                                        size: 14,
                                        style: 'normal',
                                        weight: 'bold', 
                                    },
                                    color: 'rgba(0, 0, 0, 0.87)', 
                                },
                                grid: {
                                    display: false,
                                },
                                ticks: {
                                    display: true,
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
            style={{ backgroundColor: 'transparent' }}
        />
    );
};

export default SalesChart;
