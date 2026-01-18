import { useContext } from 'react';
import { DataContext } from '../context/context';

export const useCows = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        throw new Error('useCows must be used within a DataProvider');
    }
    
    const { 
        cows, 
        addCow, 
        deleteCow, 
        updateCow, 
        adoptCow, 
        fetchCows 
    } = context;
    
    return { 
        cows, 
        addCow, 
        deleteCow, 
        updateCow, 
        adoptCow, 
        fetchCows 
    };
};