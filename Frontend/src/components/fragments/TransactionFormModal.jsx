import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useWallet } from '../../context/WalletContext';
import { transactionService } from '../../services/transactionService';
import walletService from '../../services/walletService';

const categories = {
    pemasukan: [
        'gaji',
        'bonus',
        'investasi',
        'penjualan',
        'hadiah',
        'refund',
        'hibah',
        'dividen',
        'lainnya'
    ],
    pengeluaran: [
        'belanja',
        'keperluan pribadi',
        'hiburan',
        'donasi',
        'investasi',
        'makanan dan minuman',
        'kesehatan',
        'pendidikan',
        'tagihan',
        'transportasi',
        'transfer',
        'lainnya'
    ]
};

const TransactionFormModal = ({ isOpen, onClose, onTransactionCreated, transactionToEdit }) => {
    const { activeWallet } = useWallet();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (activeWallet) {
                try {
                    const balanceData = await walletService.getWalletBalance(activeWallet.id);
                    setWalletBalance(balanceData.balance);
                } catch (err) {
                    console.error('Failed to fetch wallet balance:', err);
                }
            }
        };
        fetchWalletBalance();
    }, [activeWallet]);

    useEffect(() => {
        if (transactionToEdit) {
            // Set form values when editing
            const form = document.querySelector('form');
            if (form) {
                form.amount.value = transactionToEdit.amount;
                form.type.value = transactionToEdit.type;
                form.category.value = transactionToEdit.category;
                form.description.value = transactionToEdit.description || '';
                form.date.value = transactionToEdit.date.split('T')[0];
            }
        }
    }, [transactionToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.target);
        const amount = parseInt(formData.get('amount'));
        const type = formData.get('type');

        // Cek saldo jika transaksi pengeluaran
        if (type === 'pengeluaran' && amount > walletBalance) {
            setError('Insufficient balance. Your current balance is not enough for this transaction.');
            setLoading(false);
            Swal.fire({
                title: 'Insufficient Balance!',
                text: `Your current balance (${walletBalance}) is not enough for this transaction.`,
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
            return;
        }

        const transactionData = {
            wallet_id: activeWallet.id,
            amount: amount,
            type: type,
            category: formData.get('category'),
            description: formData.get('description'),
            date: formData.get('date') || new Date().toISOString().split('T')[0]
        };

        try {
            if (transactionToEdit) {
                await transactionService.updateTransaction(transactionToEdit.id, transactionData);
                Swal.fire({
                    title: 'Updated!',
                    text: 'Transaction has been updated.',
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
            } else {
                await transactionService.createTransaction(transactionData);
                Swal.fire({
                    title: 'Created!',
                    text: 'Transaction has been created.',
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
            }
            onTransactionCreated();
        } catch (err) {
            setError(err.message || 'Failed to save transaction');
            Swal.fire({
                title: 'Error!',
                text: err.message || 'Failed to save transaction',
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
            setLoading(false);
        }
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        // Reset category when type changes
        const form = document.querySelector('form');
        if (form) {
            form.category.value = '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">
                        {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            required
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter amount"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            required
                            onChange={handleTypeChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select type</option>
                            <option value="pemasukan">Pemasukan</option>
                            <option value="pengeluaran">Pengeluaran</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            required
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select a category</option>
                            {selectedType && categories[selectedType]?.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter description"
                            required
                            rows="3"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : transactionToEdit ? 'Update Transaction' : 'Save Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionFormModal; 