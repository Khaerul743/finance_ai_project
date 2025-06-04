import React, { createContext, useContext, useState } from 'react';

export const WalletContext = createContext(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    const [activeWallet, setActiveWallet] = useState(null);

    const setWallet = (wallet) => {
        setActiveWallet(wallet);
    };

    const value = {
        activeWallet,
        setWallet
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}; 