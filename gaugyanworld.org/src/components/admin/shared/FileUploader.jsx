import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Trash2, FileText } from 'lucide-react';
import { mediaService } from '../../../services/api';

const FileUploader = ({ label, value, onChange, accept = "image/*", onUploadStart, onUploadEnd }) => {
    const [preview, setPreview] = useState(value);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Sync preview with value when it changes externally
    React.useEffect(() => {
        setPreview(value);
    }, [value]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            try {
                setUploading(true);
                if (onUploadStart) onUploadStart();

                // Determine folder based on accept type or specific folder
                const folder = accept.includes('image') ? 'images' : 'files';
                const response = await mediaService.uploadFile(file, folder);

                if (response.success || response.data) {
                    const url = response.data?.url || response.media?.url;
                    onChange(url);
                    // Update preview with the remote URL to ensure consistency
                    setPreview(url);
                }
            } catch (error) {
                console.error("Upload failed", error);
                alert("Failed to upload file. " + (error.response?.data?.message || error.message));
                // Revert on failure
                setPreview(value || ''); // Revert to previous value
                onChange(value || '');
                if (fileInputRef.current) fileInputRef.current.value = '';
            } finally {
                setUploading(false);
                if (onUploadEnd) onUploadEnd();
            }
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group"
                >
                    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-indigo-100 transition-colors mb-3">
                        <Upload className="text-gray-500 group-hover:text-indigo-600" size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
                </div>
            ) : (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 group bg-gray-50">
                    {uploading ? (
                        <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-50">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-2"></div>
                            <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                    ) : (
                        <>
                            {preview?.toLowerCase().endsWith('.pdf') || accept.includes('pdf') ? (
                                <div className="w-full h-48 flex flex-col items-center justify-center bg-indigo-50/50">
                                    <FileText className="text-indigo-600 mb-2" size={48} />
                                    <p className="text-sm font-medium text-indigo-900 px-4 text-center truncate w-full">
                                        {preview?.split('/').pop() || 'PDF Document'}
                                    </p>
                                    <p className="text-xs text-indigo-500 mt-1">Uploaded Successfully</p>
                                </div>
                            ) : (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        // Fallback for non-image files that might not end in .pdf but are selected
                                        e.target.style.display = 'none';
                                        e.target.parentElement.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
                                        e.target.parentElement.innerHTML = '<div class="flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg><span class="text-sm font-medium text-indigo-900">File Uploaded</span></div>';
                                    }}
                                />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
            />

            {/* Fallback URL input */}
            <div className="mt-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Or enter URL:</span>
                    <input
                        type="text"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => {
                            setPreview(e.target.value);
                            onChange(e.target.value);
                        }}
                        className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                        placeholder="https://..."
                    />
                </div>
            </div>
        </div>
    );
};


export default FileUploader;
