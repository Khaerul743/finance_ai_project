import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Button from '../components/elements/Button';
import DailyExpenseChart from '../components/fragments/DailyExpenseChart';
import TransactionChart from '../components/fragments/TransactionChart';
import TransactionFilters from '../components/fragments/TransactionFilters';
import TransactionFormModal from '../components/fragments/TransactionFormModal';
import TransactionTable from '../components/fragments/TransactionTable';
import { useWallet } from '../context/WalletContext';
import { transactionService } from '../services/transactionService';
import walletService from '../services/walletService';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Transaction = () => {
    const navigate = useNavigate();
    const { activeWallet, setWallet } = useWallet();
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
    const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
    const [transactionType, setTransactionType] = useState('all');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [monthlyChartData, setMonthlyChartData] = useState({ labels: [], income: [], expense: [] });
    const [isFetchingEmails, setIsFetchingEmails] = useState(false);
    const [fetchMessage, setFetchMessage] = useState(null);

    const checkWalletExists = async () => {
        if (!activeWallet) return false;
        
        try {
            const wallets = await walletService.getMyWallets();
            const walletExists = wallets.some(wallet => wallet.id === activeWallet.id);
            
            if (!walletExists) {
                setWallet(null); // Clear the active wallet
                return false;
            }
            return true;
        } catch (err) {
            console.error('Error checking wallet:', err);
            return false;
        }
    };

    const fetchTransactions = async () => {
        if (!activeWallet) return;
        
        try {
            setLoading(true);
            const walletExists = await checkWalletExists();
            
            if (!walletExists) {
                navigate('/wallet');
                return;
            }

            const data = await transactionService.getAllTransactions(activeWallet.id);
            setTransactions(data);
            setError(null);

            // Ambil summary untuk chart bulanan
            const summaryData = await transactionService.getTransactionSummary(activeWallet.id);
            // Group by month
            const monthMap = {};
            summaryData.forEach(item => {
                const date = new Date(item.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthMap[monthKey]) {
                    monthMap[monthKey] = { income: 0, expense: 0 };
                }
                monthMap[monthKey].income += item.total_income || 0;
                monthMap[monthKey].expense += item.total_expense || 0;
            });
            const sortedMonths = Object.keys(monthMap).sort();
            // Format label bulan menjadi 'Mei 2024'
            const monthLabels = sortedMonths.map(m => {
                const [year, month] = m.split('-');
                const date = new Date(Number(year), Number(month) - 1);
                return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
            });
            setMonthlyChartData({
                labels: monthLabels,
                income: sortedMonths.map(m => monthMap[m].income),
                expense: sortedMonths.map(m => monthMap[m].expense)
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [activeWallet]);

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchType = transactionType === 'all' || transaction.type === transactionType;
        const [year, month] = transaction.date.split('T')[0].split('-');
        const matchDate = year === selectedYear && month === selectedMonth;
        return matchType && matchDate;
    });

    const handleAddTransaction = () => {
        setTransactionToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditTransaction = (transaction) => {
        setTransactionToEdit(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTransactionToEdit(null);
    };

    const handleTransactionCreated = () => {
        fetchTransactions();
        setIsModalOpen(false);
        setTransactionToEdit(null);
    };

    const handleTransactionDeleted = () => {
        fetchTransactions();
    };

    const handleFetchEmails = async () => {
        if (!activeWallet || isFetchingEmails) return;
        
        try {
            setIsFetchingEmails(true);
            setFetchMessage(null);
            const response = await transactionService.fetchEmailsFromTransactions(activeWallet.id);
            
            if (response.success) {
                setFetchMessage({
                    type: 'success',
                    message: response.message
                });
            } else {
                throw new Error(response.message || 'Failed to fetch emails');
            }

            // Refresh transactions after fetching emails
            await fetchTransactions();
        } catch (error) {
            console.error('Error fetching emails:', error);
            setFetchMessage({
                type: 'error',
                message: error.response?.data?.message || error.message || 'Failed to fetch emails'
            });
        } finally {
            setIsFetchingEmails(false);
        }
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

    if (!activeWallet) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
                        <p className="text-yellow-400">Please select a wallet first</p>
                        <button
                            onClick={() => navigate('/wallet')}
                            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            Go to Wallets
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                <div className="mb-4 sm:mb-6 md:mb-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Transactions</h1>
                        <div className="flex flex-col items-center sm:flex-row sm:w-auto gap-2">
                            <Button onClick={handleAddTransaction} icon={PlusIcon} className="w-full max-w-xs mx-auto sm:w-auto flex items-center justify-center">
                                Add Transaction
                            </Button>
                            <Button 
                                onClick={handleFetchEmails} 
                                icon={PlusIcon}
                                disabled={isFetchingEmails}
                                className={`w-full max-w-xs mx-auto sm:w-auto flex items-center justify-center gap-2 ${isFetchingEmails ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isFetchingEmails ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Fetching...
                                    </>
                                ) : 'Fetch from Email'}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Fetch Message */}
                    {fetchMessage && (
                        <div className={`mt-4 p-4 rounded-lg ${
                            fetchMessage.type === 'success' 
                                ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
                                : 'bg-red-500/10 border border-red-500/50 text-red-400'
                        }`}>
                            {fetchMessage.message}
                        </div>
                    )}

                    {/* Filters */}
                    <TransactionFilters
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        transactionType={transactionType}
                        onMonthChange={(e) => setSelectedMonth(e.target.value)}
                        onYearChange={(e) => setSelectedYear(e.target.value)}
                        onTypeChange={(e) => setTransactionType(e.target.value)}
                    />
                </div>

                {/* Main Content */}
                <div className="grid gap-4 sm:gap-6 md:gap-8">
                    <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
                        <TransactionChart data={monthlyChartData} />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
                            <DailyExpenseChart transactions={filteredTransactions} />
                        </div>
                        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
                            <TransactionTable 
                                transactions={filteredTransactions} 
                                loading={loading}
                                error={error}
                                onTransactionDeleted={handleTransactionDeleted}
                                onEditTransaction={handleEditTransaction}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <TransactionFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onTransactionCreated={handleTransactionCreated}
                transactionToEdit={transactionToEdit}
            />
        </div>
    );
};

export default Transaction;