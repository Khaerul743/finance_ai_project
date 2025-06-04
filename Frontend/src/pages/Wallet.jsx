import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Button from '../components/elements/Button';
import { useWallet } from '../hooks/useWallet';
import walletService from '../services/walletService';

const walletTypes = ["Cash", "Bank", "E-wallet"];

// Wallet type icons
const WalletIcon = ({ type, className }) => {
    switch (type) {
        case 'Cash':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
                </svg>
            );
        case 'Bank':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-4 9 4M3 6v12l9 4 9-4V6" />
                </svg>
            );
        case 'E-wallet':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            );
        default:
            return null;
    }
};

const Wallet = () => {
    const navigate = useNavigate();
    const { setWallet } = useWallet();
    const [wallets, setWallets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Cash',
        balance: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWallets = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await walletService.getMyWallets();
            setWallets(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching wallets:', err);
            setError(err.message || 'Failed to fetch wallets');
            setWallets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const handleAddWallet = () => {
        setModalMode('add');
        setFormData({ name: '', type: 'Cash', balance: '' });
        setIsModalOpen(true);
    };

    const handleEditWallet = (wallet) => {
        setModalMode('edit');
        setSelectedWallet(wallet);
        setFormData({
            name: wallet.name,
            type: wallet.type,
            balance: wallet.balance
        });
        setIsModalOpen(true);
    };

    const handleDeleteWallet = (wallet) => {
        setModalMode('delete');
        setSelectedWallet(wallet);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (modalMode === 'add') {
                await walletService.createWallet({
                    ...formData,
                    balance: Number(formData.balance)
                });
            } else if (modalMode === 'edit' && selectedWallet) {
                await walletService.updateWallet(selectedWallet.id, {
                    ...formData,
                    balance: Number(formData.balance)
                });
            } else if (modalMode === 'delete' && selectedWallet) {
                await walletService.deleteWallet(selectedWallet.id);
            }
            
            await fetchWallets(); // Refresh wallets after operation
            setIsModalOpen(false);
        } catch (err) {
            console.error('Operation failed:', err);
            setError(err.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleUseWallet = (wallet) => {
        setWallet(wallet);
        navigate('/transaction');
    };

    const PlusIcon = ({ className }) => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={className}
            viewBox="0 0 20 20" 
            fill="currentColor"
        >
            <path fillRule="evenodd" 
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                  clipRule="evenodd" 
            />
        </svg>
    );

    if (loading && wallets.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (error && wallets.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center">
                        <p className="text-red-400">{error}</p>
                        <button
                            onClick={fetchWallets}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Wallets</h1>
                    <Button onClick={handleAddWallet} icon={PlusIcon}>
                        Add Wallet
                    </Button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                )}

                {/* Wallets Grid */}
                {!loading && (
                    wallets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/50">
                            <div className="p-4 bg-purple-500/20 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Wallets Yet</h3>
                            <p className="text-gray-400 text-center mb-6">You haven't added any wallets yet. Add your first wallet to start managing your finances.</p>
                            <Button onClick={handleAddWallet} icon={PlusIcon}>
                                Add Your First Wallet
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {wallets.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group relative"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                                <WalletIcon type={wallet.type} className="w-8 h-8 text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{wallet.name}</h3>
                                                <p className="text-sm text-gray-400">{wallet.type}</p>
                                                <p className="text-xs text-gray-500">ID: {wallet.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditWallet(wallet)}
                                                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWallet(wallet)}
                                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-sm text-gray-400">Balance</p>
                                        <p className="text-2xl font-bold text-white mt-1">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0
                                            }).format(wallet.balance)}
                                        </p>
                                    </div>
                                    {/* Use Button - appears on hover */}
                                    <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent rounded-b-2xl">
                                        <button
                                            onClick={() => handleUseWallet(wallet)}
                                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                                        >
                                            <span>Use</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={() => setIsModalOpen(false)} />
                        
                        <div className="relative inline-block p-4 overflow-hidden text-left align-bottom transition-all transform bg-gray-800 rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="pb-4 border-b border-gray-700">
                                <h3 className="text-xl font-semibold text-white">
                                    {modalMode === 'add' ? 'Add New Wallet' : 
                                     modalMode === 'edit' ? 'Edit Wallet' : 'Delete Wallet'}
                                </h3>
                            </div>

                            {modalMode === 'delete' ? (
                                <div className="mt-4">
                                    <p className="text-gray-300">
                                        Are you sure you want to delete wallet "{selectedWallet?.name}"?
                                        This action cannot be undone.
                                    </p>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300">
                                                Wallet Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300">
                                                Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-3 py-2"
                                            >
                                                {walletTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300">
                                                Balance
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.balance}
                                                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-3 py-2"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                                        >
                                            {modalMode === 'add' ? 'Add Wallet' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;
