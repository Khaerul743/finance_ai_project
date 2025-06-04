import React from 'react';

const FinancialCard = ({ title, amount, percentage, cardNumber, className }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value).replace('IDR', 'Rp');
  };

  // Clamp percentage between -100 and 100
  const displayPercent = percentage !== null && percentage !== undefined
    ? Math.max(-100, Math.min(100, percentage))
    : null;

  // Pilih ikon sesuai nilai persentase
  let percentIcon = null;
  let percentColor = '';
  if (displayPercent > 0) {
    percentIcon = <span className="mr-1">▲</span>;
    percentColor = 'text-green-400';
  } else if (displayPercent < 0) {
    percentIcon = <span className="mr-1">▼</span>;
    percentColor = 'text-red-400';
  } else if (displayPercent === 0) {
    percentIcon = <span className="mr-1">–</span>;
    percentColor = 'text-gray-400';
  }

  return (
    <div className={`relative rounded-2xl p-6 backdrop-blur-lg transform transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden ${className}`}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-slate-900/50 to-slate-950/50"></div>
      
      {/* Glass effect border */}
      <div className="absolute inset-0 rounded-2xl border border-white/10"></div>

      {/* Content */}
      <div className="relative space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-300 font-medium">{title}</h3>
          {displayPercent !== null && (
            <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-110 border ${
              displayPercent > 0
                ? 'bg-green-500/10 border-green-500/20'
                : displayPercent < 0
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-gray-700/30 border-gray-500/20'
            } ${percentColor}`}>
              {percentIcon}{Math.abs(displayPercent)}%
            </span>
          )}
        </div>
        
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-white transition-all duration-300 hover:text-green-400">{formatCurrency(amount)}</span>
          <span className="text-sm text-gray-500">Rp</span>
        </div>

        {cardNumber && (
          <div className="text-gray-500 text-sm mt-2 transition-opacity duration-300 hover:opacity-75">
            {cardNumber}
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
    </div>
  );
};

export default FinancialCard; 