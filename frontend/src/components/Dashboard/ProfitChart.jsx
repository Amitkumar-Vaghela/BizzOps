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

                const labels = Object.keys(response.data.data);
                const profitValues = Object.values(response.data.data);
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                chartInstanceRef.current = new Chart(chartRef.current, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Daily Profit',
                                data: profitValues,
                                fill: true,
                                borderColor: 'rgba(31, 244, 3, 1)',
                                tension: 0.1,
                                pointRadius: 2,
                                pointBackgroundColor: 'rgba(31, 244, 3, 1)',
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
                                    text: 'Profit',
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
        <canvas
            ref={chartRef}
            className="w-80 h-80"
            style={{ backgroundColor: 'transparent' }} 
        />
    );
};

export default ProfitChart;
