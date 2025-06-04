import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinancialCard from '../components/FinancialCard';
import Navbar from '../components/Navbar';
import { useWallet } from '../hooks/useWallet';
import { transactionService } from '../services/transactionService';
import userService from '../services/userService';
import walletService from '../services/walletService';
import { clampPercent } from '../utils/persentase';

const Dashboard = () => {
  const navigate = useNavigate();
  const { activeWallet } = useWallet();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [balance, setBalance] = useState(null);
  const [income, setIncome] = useState(null);
  const [expense, setExpense] = useState(null);
  const [incomePercent, setIncomePercent] = useState(null);
  const [expensePercent, setExpensePercent] = useState(null);
  const [balancePercent, setBalancePercent] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const isAuthenticated = await userService.isAuthenticated();
        setIsAuth(isAuthenticated);

        if (!isAuthenticated) {
          navigate('/auth/login', { replace: true });
          return;
        }

        const data = await userService.getProfile();
        if (data) {
          setUserData(data);
        } else {
          navigate('/auth/login', { replace: true });
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/auth/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!activeWallet) {
        setBalance(null);
        setIncome(null);
        setExpense(null);
        setIncomePercent(null);
        setExpensePercent(null);
        setBalancePercent(null);
        return;
      }
      setSummaryLoading(true);
      try {
        // Fetch balance
        const balanceData = await walletService.getWalletBalance(activeWallet.id);
        setBalance(balanceData.balance);
        // Fetch summary
        const summary = await transactionService.getTransactionSummary(activeWallet.id);
        let totalIncome = 0;
        let totalExpense = 0;
        if (Array.isArray(summary) && summary.length > 0) {
          // Sort by date ascending
          const sorted = [...summary].sort((a, b) => new Date(a.date) - new Date(b.date));
          // Sum all
          sorted.forEach(item => {
            totalIncome += item.total_income || 0;
            totalExpense += item.total_expense || 0;
          });
        }
        setIncome(totalIncome);
        setExpense(totalExpense);

        // Hitung saldo awal (saldo saat ini - pemasukan + pengeluaran)
        const initialBalance = balanceData.balance - totalIncome + totalExpense;

        // Hitung persentase berdasarkan saldo awal pakai clampPercent
        const incomePercent = clampPercent(totalIncome, initialBalance);
        const expensePercent = clampPercent(totalExpense, initialBalance);
        const balancePercent = clampPercent(balanceData.balance - initialBalance, initialBalance);

        setIncomePercent(incomePercent);
        setExpensePercent(expensePercent);
        setBalancePercent(balancePercent);
      } catch {
        setBalance(null);
        setIncome(null);
        setExpense(null);
        setIncomePercent(null);
        setExpensePercent(null);
        setBalancePercent(null);
      } finally {
        setSummaryLoading(false);
      }
    };
    fetchWalletData();
  }, [activeWallet]);

  // Show nothing while checking auth
  if (loading || !isAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-800/30 rounded-full px-4 py-2 transition-all duration-300 hover:bg-gray-800/50 hover:scale-105 cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Automated Saving Solution</span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl text-white font-bold transition-all duration-300 hover:text-green-400 cursor-default">Welcome</h1>
              <h2 className="text-3xl text-white transition-all duration-300 hover:text-green-400 cursor-default">
                Hi, {userData?.name}!
              </h2>
              <p className="text-gray-400 max-w-md transition-all duration-300 hover:text-gray-300">
                Take control of your finances with our smart saving solution. Track expenses, manage budgets, and achieve your financial goals with ease.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/chatbot')}
                  className="px-6 py-2 bg-green-500 text-white rounded-full transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 transform active:scale-95"
                >
                  Ask AI Assistant
                </button>
                <button 
                  onClick={() => navigate('/transaction')}
                  className="px-6 py-2 bg-gray-700 text-white rounded-full transition-all duration-300 hover:bg-gray-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transform active:scale-95"
                >
                  View Transactions
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <FinancialCard
              title="Your Balance"
              amount={balance ?? 0}
              percentage={balancePercent}
              isPositive={true}
              cardNumber={activeWallet ? activeWallet.card_number || activeWallet.id : ''}
              className="bg-gradient-to-br from-gray-800/50 to-purple-900/30"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialCard
                title="Income"
                amount={income ?? 0}
                percentage={incomePercent}
                isPositive={true}
              />
              <FinancialCard
                title="Expense"
                amount={expense ?? 0}
                percentage={expensePercent}
                isPositive={false}
              />
            </div>

            <button
              className="w-full h-32 rounded-2xl bg-gray-800/30 flex flex-col items-center justify-center space-y-2 transition-all duration-300 hover:bg-gray-800/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none"
              onClick={() => navigate('/transaction')}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2M8 17v-6m4 6V7m4 10v-3" />
              </svg>
              <span className="text-purple-300 font-semibold text-lg">Lihat Laporan Keuangan</span>
            </button>
          </div>
        </div>
        {/* Show a message if no wallet is selected */}
        {!activeWallet && (
          <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-yellow-400 text-center">
            Please select a wallet to see your financial summary.
          </div>
        )}
        {/* Show loading state for summary */}
        {summaryLoading && (
          <div className="mt-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 