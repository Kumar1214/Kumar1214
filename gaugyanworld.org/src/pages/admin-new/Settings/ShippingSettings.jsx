import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import Button from '../../../components/Button';
import toast from 'react-hot-toast';

const ShippingSettings = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [currentRule, setCurrentRule] = useState({
        zoneName: '',
        states: '', // Comma separated for input
        baseCharge: 50,
        perKgCharge: 20,
        freeShippingThreshold: 1000,
        isActive: true
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const res = await api.get('/shipping/rules');
            if (res.data.success) {
                setRules(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load shipping rules');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Process states string to array
            const ruleData = {
                ...currentRule,
                states: currentRule.states.split(',').map(s => s.trim()).filter(s => s)
            };

            if (currentRule.id) {
                await api.put(`/shipping/rules/${currentRule.id}`, ruleData);
                toast.success('Rule updated');
            } else {
                await api.post('/shipping/rules', ruleData);
                toast.success('Rule created');
            }
            setIsEditing(false);
            fetchRules();
            resetForm();
        } catch (error) {
            console.error('Save rule error:', error);
            toast.error('Failed to save rule');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this rule?')) return;
        try {
            await api.delete(`/shipping/rules/${id}`);
            toast.success('Rule deleted');
            fetchRules();
        } catch (error) {
            console.error('Delete rule error:', error);
            toast.error('Failed to delete rule');
        }
    };

    const handleEdit = (rule) => {
        setCurrentRule({
            ...rule,
            states: Array.isArray(rule.states) ? rule.states.join(', ') : (rule.states || '')
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentRule({
            zoneName: '',
            states: '',
            baseCharge: 50,
            perKgCharge: 20,
            freeShippingThreshold: 1000,
            isActive: true
        });
        setIsEditing(false);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Shipping Configuration</h1>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                        <Plus size={18} className="mr-2" /> Add Zone Rule
                    </Button>
                )}
            </div>

            {/* Form */}
            {isEditing && (
                <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
                    <h2 className="text-lg font-bold mb-4">{currentRule.id ? 'Edit Rule' : 'New Rule'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Zone Name</label>
                            <input
                                className="w-full p-2 border rounded"
                                value={currentRule.zoneName}
                                onChange={e => setCurrentRule({ ...currentRule, zoneName: e.target.value })}
                                placeholder="e.g. North India"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">States (comma separated)</label>
                            <input
                                className="w-full p-2 border rounded"
                                value={currentRule.states}
                                onChange={e => setCurrentRule({ ...currentRule, states: e.target.value })}
                                placeholder="Delhi, Punjab, Haryana..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Base Charge (₹)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={currentRule.baseCharge}
                                onChange={e => setCurrentRule({ ...currentRule, baseCharge: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Per Kg Charge (₹)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={currentRule.perKgCharge}
                                onChange={e => setCurrentRule({ ...currentRule, perKgCharge: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Free Shipping Above (₹)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={currentRule.freeShippingThreshold}
                                onChange={e => setCurrentRule({ ...currentRule, freeShippingThreshold: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" onClick={resetForm} style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Rule
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Zone</th>
                            <th className="p-4 font-semibold text-sm">States</th>
                            <th className="p-4 font-semibold text-sm">Charges</th>
                            <th className="p-4 font-semibold text-sm">Free Above</th>
                            <th className="p-4 font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map(rule => (
                            <tr key={rule.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium">{rule.zoneName}</td>
                                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                    {Array.isArray(rule.states) ? rule.states.join(', ') : (rule.states || 'All')}
                                </td>
                                <td className="p-4 text-sm">
                                    ₹{rule.baseCharge} + ₹{rule.perKgCharge}/kg
                                </td>
                                <td className="p-4 text-sm text-green-600 font-medium">
                                    {rule.freeShippingThreshold ? `₹${rule.freeShippingThreshold}` : '-'}
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleEdit(rule)} className="p-1 hover:text-blue-600"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(rule.id)} className="p-1 hover:text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {rules.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">No shipping rules defined.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShippingSettings;
