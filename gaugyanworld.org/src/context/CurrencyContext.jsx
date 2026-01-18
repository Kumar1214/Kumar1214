import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    // Default to INR
    const [currency, setCurrency] = useState('INR');

    // Mock Exchange Rates (Base: INR)
    // In production, fetch these from an API
    const exchangeRates = {
        INR: 1,
        USD: 0.012, // 1 INR = 0.012 USD approx
        EUR: 0.011,
        GBP: 0.0095
    };

    const currencySymbols = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£'
    };

    // Helper to format price
    const formatPrice = (amountInINR) => {
        if (amountInINR === undefined || amountInINR === null) return '';

        const rate = exchangeRates[currency] || 1;
        const convertedAmount = amountInINR * rate;

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(convertedAmount);
    };

    // Helper to just get the value (for calculations if needed)
    const convertPrice = (amountInINR) => {
        const rate = exchangeRates[currency] || 1;
        return (amountInINR * rate).toFixed(2);
    };

    const value = React.useMemo(() => ({
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        allCurrencies: Object.keys(exchangeRates)
    }), [currency, formatPrice, convertPrice]);

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

CurrencyProvider.propTypes = {
    children: PropTypes.node.isRequired
};
