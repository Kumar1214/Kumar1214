import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { mediaService } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import toast from 'react-hot-toast';

const ImageUploader = ({ value = [], onChange, multiple = false, loading = false }) => {
    const [dragActive, setDragActive] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [uploading, setUploading] = useState(false); // Added from instruction's code edit

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files);
            const newUrls = [];
            for (const file of files) {
                if (!file.type.startsWith('image/')) continue;
                try {
                    const response = await mediaService.uploadFile(file, 'images');
                    if (response.success) {
                        newUrls.push(response.media.url);
                    }
                } catch (error) {
                    console.error("Image upload failed", error);
                    toast.error(`Failed to upload ${file.name}`);
                }
            }

            if (skippedFilesCount > 0) {
                toast.error(`Skipped ${skippedFilesCount} non-image file(s)`);
            }

            if (newUrls.length > 0) {
                if (multiple) {
                    onChange([...value, ...newUrls]);
                } else {
                    onChange(newUrls);
                }
            }
        }
    };

    const addImageUrl = () => {
        if (urlInput.trim()) {
            if (multiple) {
                onChange([...value, urlInput.trim()]);
            } else {
                onChange([urlInput.trim()]);
            }
            setUrlInput('');
        }
    };

    const removeImage = (index) => {
        const newImages = value.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                {label}
            </label>

            {/* Image Previews */}
            {value.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {value.map((url, index) => (
                        <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <img
                                src={getImageUrl(url)}
                                alt={`Preview ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #E5E7EB'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: '#EF4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Drag & Drop Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
                style={{
                    border: `2px dashed ${dragActive ? 'var(--color-primary)' : '#D1D5DB'}`,
                    borderRadius: '4px',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: dragActive ? '#F0F9FF' : '#F9FAFB',
                    marginBottom: '12px',
                    cursor: 'pointer'
                }}
            >
                <input
                    id="file-upload"
                    type="file"
                    multiple={multiple}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (files.length === 0) return;

                        // Create local previews immediately (optional, or wait for upload)
                        // For better UX, we'll try to upload immediately

                        const newUrls = [];
                        for (const file of files) {
                            try {
                                const response = await mediaService.uploadFile(file, 'images');
                                if (response.success) {
                                    newUrls.push(response.media.url);
                                }
                            } catch (error) {
                                console.error("Image upload failed", error);
                                toast.error(`Failed to upload ${file.name}`);
                            }
                        }

                        if (newUrls.length > 0) {
                            if (multiple) {
                                onChange([...value, ...newUrls]);
                            } else {
                                onChange(newUrls); // Pass array of one URL or multiple
                            }
                        }
                    }}
                />
                <Upload size={32} color="#9CA3AF" style={{ margin: '0 auto 8px' }} />
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '4px' }}>
                    Drag & drop images here or click to upload
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                    (Supports JPG, PNG, WEBP)
                </p>
            </div>

            {/* URL Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    placeholder="Or paste image URL here"
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                    }}
                />
                <button
                    type="button"
                    onClick={addImageUrl}
                    disabled={!urlInput.trim()}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: urlInput.trim() ? 'var(--color-primary)' : '#E5E7EB',
                        color: urlInput.trim() ? 'white' : '#9CA3AF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: urlInput.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}
                >
                    Add URL
                </button>
            </div>

            {multiple && (
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '8px' }}>
                    You can add multiple images
                </p>
            )}
        </div>
    );
};

export default ImageUploader;
