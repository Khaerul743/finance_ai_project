import React from 'react';
import Select from '../elements/Select';

const TransactionFilters = ({ 
    selectedMonth, 
    selectedYear, 
    transactionType,
    onMonthChange,
    onYearChange,
    onTypeChange 
}) => {
    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return {
            value: month,
            label: new Date(2024, i).toLocaleString('default', { month: 'long' })
        };
    });

    const yearOptions = [2023, 2024, 2025].map(year => ({
        value: year.toString(),
        label: year.toString()
    }));

    const typeOptions = [
        { value: 'all', label: 'All Transactions' },
        { value: 'pemasukan', label: 'Pemasukan' },
        { value: 'pengeluaran', label: 'Pengeluaran' }
    ];

    return (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                    value={selectedMonth}
                    onChange={onMonthChange}
                    options={monthOptions}
                />
                <Select
                    value={selectedYear}
                    onChange={onYearChange}
                    options={yearOptions}
                />
                <Select
                    value={transactionType}
                    onChange={onTypeChange}
                    options={typeOptions}
                />
            </div>
        </div>
    );
};

export default TransactionFilters; 