import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { transactionService } from '../../services/transactionService';

const TransactionTable = ({ transactions, onTransactionDeleted, onEditTransaction }) => {
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = async (transactionId) => {
        const result = await Swal.fire({
            title: 'Delete Transaction',
            text: 'Are you sure you want to delete this transaction?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#1f2937',
            color: '#fff',
            customClass: {
                title: 'text-white',
                content: 'text-gray-300',
                confirmButton: 'bg-red-500 hover:bg-red-600',
                cancelButton: 'bg-gray-600 hover:bg-gray-700'
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        setDeletingId(transactionId);
        setError(null);

        try {
            await transactionService.deleteTransaction(transactionId);
            onTransactionDeleted();
            
            // Show success message
            Swal.fire({
                title: 'Deleted!',
                text: 'Transaction has been deleted.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1f2937',
                color: '#fff',
                customClass: {
                    title: 'text-white',
                    content: 'text-gray-300'
                }
            });
        } catch (err) {
            setError(err.message || 'Failed to delete transaction');
            
            // Show error message
            Swal.fire({
                title: 'Error!',
                text: err.message || 'Failed to delete transaction',
                icon: 'error',
                confirmButtonColor: '#ef4444',
                background: '#1f2937',
                color: '#fff',
                customClass: {
                    title: 'text-white',
                    content: 'text-gray-300',
                    confirmButton: 'bg-red-500 hover:bg-red-600'
                }
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="h-full w-full bg-gray-800/50 backdrop-blur-md rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700/50">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">Transaction List</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
                    {error}
                </div>
            )}

            <div className="relative h-[calc(100%-3rem)]">
                {/* Table Header - Fixed */}
                <table className="w-full">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 bg-gray-800/50 text-sm sm:text-base">Name</th>
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 bg-gray-800/50 text-sm sm:text-base">Category</th>
                            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 bg-gray-800/50 text-sm sm:text-base">Amount</th>
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 bg-gray-800/50 text-sm sm:text-base">Date</th>
                            <th className="text-center py-2 sm:py-3 px-2 sm:px-4 bg-gray-800/50 text-sm sm:text-base">Action</th>
                        </tr>
                    </thead>
                </table>

                {/* Table Body - Scrollable */}
                <div className="overflow-y-auto h-[calc(100%-2rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50">
                    <table className="w-full">
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr 
                                    key={transaction.id}
                                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200"
                                >
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-sm sm:text-base">{transaction.description || '-'}</td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${
                                            transaction.type === 'pemasukan' 
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                            {transaction.category}
                                        </span>
                                    </td>
                                    <td className={`py-2 sm:py-3 px-2 sm:px-4 text-right text-sm sm:text-base ${
                                        transaction.type === 'pemasukan' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-400 text-sm sm:text-base">
                                        {new Date(transaction.date).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => onEditTransaction(transaction)}
                                                className="text-blue-400 hover:text-blue-300"
                                                title="Edit transaction"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                disabled={deletingId === transaction.id}
                                                className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Delete transaction"
                                            >
                                                {deletingId === transaction.id ? (
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionTable; 