import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    return new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                    }).format(context.raw);
                }
            }
        },
        annotation: {
            annotations: {
                meanLine: {
                    type: 'line',
                    yMin: 0,
                    yMax: 0,
                    borderColor: '#FCD34D',
                    borderWidth: 2,
                    borderDash: [6, 6],
                    label: {
                        enabled: true,
                        content: 'Mean',
                        position: 'start',
                        backgroundColor: '#FCD34D',
                        color: '#1F2937',
                        padding: 4,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: '#9CA3AF',
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 10,
                font: {
                    size: 10
                }
            }
        },
        y: {
            grid: {
                color: 'rgba(75, 85, 99, 0.2)'
            },
            ticks: {
                color: '#9CA3AF',
                font: {
                    size: 10
                },
                callback: function(value) {
                    return new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        notation: 'compact',
                        compactDisplay: 'short'
                    }).format(value);
                }
            }
        }
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const DailyExpenseChart = ({ transactions }) => {
    // Ambil tanggal dari transaksi pertama, fallback ke hari ini
    const currentDate = new Date(transactions?.[0]?.date || new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-based
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Buat array harian, isi 0 jika tidak ada pengeluaran
    const dailyExpenses = Array(daysInMonth).fill(0);
    transactions?.forEach(tx => {
        if (tx.type === 'pengeluaran') {
            const day = new Date(tx.date).getDate();
            dailyExpenses[day - 1] += tx.amount;
        }
    });

    // Calculate statistics
    const stats = useMemo(() => {
        const nonZeroExpenses = dailyExpenses.filter(amount => amount > 0);
        const max = Math.max(...dailyExpenses);
        const min = nonZeroExpenses.length > 0 ? Math.min(...nonZeroExpenses) : 0;
        const sum = dailyExpenses.reduce((acc, curr) => acc + curr, 0);
        const mean = nonZeroExpenses.length > 0 ? sum / nonZeroExpenses.length : 0;
        const sortedExpenses = [...nonZeroExpenses].sort((a, b) => a - b);
        const median = sortedExpenses.length % 2 === 0
            ? (sortedExpenses[sortedExpenses.length / 2 - 1] + sortedExpenses[sortedExpenses.length / 2]) / 2
            : sortedExpenses[Math.floor(sortedExpenses.length / 2)];

        return { max, min, mean, median, total: sum };
    }, [dailyExpenses]);

    // Create labels for all days
    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

    // Update chart options with mean line
    const options = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            annotation: {
                annotations: {
                    meanLine: {
                        type: 'line',
                        yMin: stats.mean,
                        yMax: stats.mean,
                        borderColor: '#FCD34D',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        label: {
                            enabled: true,
                            content: 'Mean',
                            position: 'start',
                            backgroundColor: '#FCD34D',
                            color: '#1F2937',
                            padding: 4
                        }
                    }
                }
            }
        }
    };

    // Prepare chart data
    const chartData = {
        labels: labels,
        datasets: [
            {
                data: dailyExpenses,
                backgroundColor: (context) => {
                    const value = context.raw || 0;
                    // Gradient based on amount
                    const alpha = Math.min(0.2 + (value / Math.max(...dailyExpenses) * 0.8), 1);
                    return `rgba(239, 68, 68, ${alpha})`;
                },
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: 'rgba(239, 68, 68, 0.7)',
                barThickness: 'flex',
                maxBarThickness: 20
            }
        ]
    };

    return (
        <div className="h-full w-full bg-gray-800/50 backdrop-blur-md rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700/50">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Daily Expenses</h2>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400">Total</span>
                            <span className="text-white font-medium">{formatCurrency(stats.total)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400">Mean</span>
                            <span className="text-yellow-400 font-medium">{formatCurrency(stats.mean)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400">Max</span>
                            <span className="text-red-400 font-medium">{formatCurrency(stats.max)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400">Min</span>
                            <span className="text-green-400 font-medium">{formatCurrency(stats.min)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1" style={{ height: '180px' }}>
                    <Bar options={options} data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default DailyExpenseChart; 