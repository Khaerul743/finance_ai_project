import React from 'react';
import { Line } from 'react-chartjs-2';

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: '#9CA3AF'
            }
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                        }).format(context.parsed.y);
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(75, 85, 99, 0.2)'
            },
            ticks: {
                color: '#9CA3AF'
            }
        },
        y: {
            grid: {
                color: 'rgba(75, 85, 99, 0.2)'
            },
            ticks: {
                color: '#9CA3AF',
                callback: function(value) {
                    return new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                    }).format(value);
                }
            }
        }
    }
};

const TransactionChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Income',
                data: data.income,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                tension: 0.4
            },
            {
                label: 'Expense',
                data: data.expense,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.4
            }
        ]
    };

    return (
        <div className="h-full w-full bg-gray-800/50 backdrop-blur-md rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700/50">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">Transaction Trends</h2>
            <div className="h-[calc(100%-2rem)] w-full">
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};

export default TransactionChart; 