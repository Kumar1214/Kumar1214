import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit, Trash2, Eye, BarChart2 } from 'lucide-react';

const DataTable = ({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    onAnalytics,
    searchable = true,
    pagination = true,
    itemsPerPage = 10
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data based on search term
    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = pagination ? filteredData.slice(startIndex, startIndex + itemsPerPage) : filteredData;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header / Search */}
            {searchable && (
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {filteredData.length} entries
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 border-b border-gray-100">{col.header}</th>
                            ))}
                            {(onEdit || onDelete || onView || onAnalytics) && <th className="p-4 border-b border-gray-100 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                        {currentData.length > 0 ? (
                            currentData.map((item, rowIdx) => (
                                <tr key={item.id || rowIdx} className="hover:bg-gray-50/80 transition-colors duration-150">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="p-4">
                                            {col.render ? col.render(item) : item[col.accessor]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView || onAnalytics) && (
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {onAnalytics && (
                                                    <button
                                                        onClick={() => onAnalytics(item)}
                                                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                                                        title="View Analytics"
                                                    >
                                                        <BarChart2 size={16} />
                                                    </button>
                                                )}
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(item)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="p-8 text-center text-gray-400">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataTable;
