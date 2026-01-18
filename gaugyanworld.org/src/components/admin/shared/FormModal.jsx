import React from 'react';
import { X } from 'lucide-react';

const FormModal = ({ isOpen, onClose, title, onSubmit, children, size = 'md', disabled = false }) => {
    if (!isOpen) return null;

    const maxWidthClass = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }[size];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div
                className={`bg-white rounded-xl shadow-2xl w-full ${maxWidthClass} transform transition-all animate-scale-in flex flex-col max-h-[90vh]`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 font-poppins">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="modal-form" onSubmit={onSubmit} className="space-y-5">
                        {children}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="modal-form"
                        disabled={disabled}
                        className={`px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm shadow-indigo-200 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {disabled ? 'Processing...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormModal;
