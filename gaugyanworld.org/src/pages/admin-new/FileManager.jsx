import React, { useState, useEffect } from 'react';
import { FiFolder, FiFile, FiCornerDownRight, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import api from '../../services/api';

const FileTreeItem = ({ item, level, onSelect }) => {
    return (
        <div
            className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 text-sm ${level > 0 ? 'ml-4' : ''}`}
            onClick={() => onSelect(item)}
        >
            {item.type === 'directory' ?
                <FiFolder className="text-yellow-500 mr-2" /> :
                <FiFile className="text-gray-400 mr-2" />
            }
            <span className="truncate">{item.name}</span>
            {item.type === 'file' && <span className="ml-auto text-xs text-gray-400">{(item.size / 1024).toFixed(1)} KB</span>}
        </div>
    );
};

const FileManager = () => {
    const [currentPath, setCurrentPath] = useState('/');
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFiles = async (path) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/file-manager/files?dir=${encodeURIComponent(path === '/' ? '' : path)}`);
            if (data.success) {
                setFiles(data.data); // data.data is the array directly in file-manager routes
                setCurrentPath(data.currentPath || path);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFileContent = async (path) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/file-manager/content?filePath=${encodeURIComponent(path)}`);
            if (data.success) {
                setFileContent(data.data);
            }
        } catch (err) {
            setFileContent(`Error reading file: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles('/');
    }, []);

    const handleItemClick = (item) => {
        if (item.type === 'directory') {
            const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
            fetchFiles(newPath);
        } else {
            const filePath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
            setSelectedFile(item);
            fetchFileContent(filePath);
        }
    };

    const handleBack = () => {
        const parts = currentPath.split('/');
        parts.pop();
        const parentPath = parts.join('/') || '/';
        fetchFiles(parentPath);
    };

    return (
        <div className="p-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gaugyan AI Dashboard & System Files</h1>
                    <p className="text-sm text-gray-500">
                        {currentPath} {selectedFile && `> ${selectedFile.name}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => fetchFiles(currentPath)}
                        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                        title="Refresh"
                    >
                        <FiRefreshCw />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 flex items-center">
                    <FiAlertTriangle className="mr-2" /> {error}
                </div>
            )}

            <div className="flex flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white">
                {/* Sidebar: File Tree */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="bg-gray-50 p-2 border-b flex items-center">
                        {currentPath !== '/' && (
                            <button
                                onClick={handleBack}
                                className="text-xs font-bold text-blue-600 hover:underline flex items-center"
                            >
                                <FiCornerDownRight className="transform rotate-180 mr-1" /> Back
                            </button>
                        )}
                        <span className="ml-auto text-xs text-gray-400">{files.length} items</span>
                    </div>
                    <div className="flex-1 overflow-auto p-2">
                        {files.map((item, idx) => (
                            <FileTreeItem key={idx} item={item} level={0} onSelect={handleItemClick} />
                        ))}
                        {files.length === 0 && !loading && (
                            <div className="text-center text-gray-400 py-8 text-sm">Empty Directory</div>
                        )}
                    </div>
                </div>

                {/* Main: Content Viewer */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {selectedFile ? (
                        <>
                            <div className="bg-white border-b p-3 flex justify-between items-center">
                                <span className="font-bold text-sm">{selectedFile.name}</span>
                                <span className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                <pre className="text-xs font-mono bg-white p-4 rounded border shadow-sm whitespace-pre-wrap break-all">
                                    {loading ? 'Loading content...' : fileContent}
                                </pre>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select a file to view content
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                <strong>Warning:</strong> This tool provides direct read access to the server filesystem. Use with caution.
                System sensitive files (.env) are hidden by default.
            </div>
        </div>
    );
};

export default FileManager;
