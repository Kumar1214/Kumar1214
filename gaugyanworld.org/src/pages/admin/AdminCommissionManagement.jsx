import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '../../components/Button';

const AdminCommissionManagement = () => {
    const [commissions, setCommissions] = useState([
        { id: 1, category: 'Food & Nutrition', rate: 10 },
        { id: 2, category: 'Pooja Essentials', rate: 15 },
        { id: 3, category: 'Personal Care', rate: 12 },
        { id: 4, category: 'Books & Literature', rate: 8 },
        { id: 5, category: 'Clothing', rate: 18 },
    ]);

    const handleRateChange = (id, newRate) => {
        setCommissions(commissions.map(c => c.id === id ? { ...c, rate: newRate } : c));
    };

    const handleSave = () => {
        alert('Commission rates updated successfully!');
        // In real app, make API call to save
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1F2937', marginBottom: '2rem' }}>Commission Management</h1>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '800px' }}>
                <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                    Set the commission percentage for each product category. This percentage will be deducted from vendor sales.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {commissions.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 600, color: '#374151', fontSize: '1.1rem' }}>{item.category}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={item.rate}
                                    onChange={(e) => handleRateChange(item.id, parseFloat(e.target.value))}
                                    style={{
                                        width: '80px',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #D1D5DB',
                                        textAlign: 'center',
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}
                                />
                                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#6B7280' }}>%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Save size={20} /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminCommissionManagement;
