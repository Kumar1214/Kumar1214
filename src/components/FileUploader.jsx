import React, { useState } from 'react';
import { Upload, X, File, FileText, Video, Music } from 'lucide-react';
import { mediaService } from '../services/api';

const FileUploader = ({ value, onChange, accept = '*', label = 'Upload File', multiple = false }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = async (files) => {
        const fileList = Array.from(files);
        if (fileList.length === 0) return;

        const newUrls = [];
        for (const file of fileList) {
            try {
                // Determine folder based on file type or generic 'files'
                let folder = 'files';
                if (file.type.startsWith('video/')) folder = 'videos';
                else if (file.type.startsWith('audio/')) folder = 'audio';
                else if (file.type.startsWith('image/')) folder = 'images';
                else if (file.type.includes('pdf') || file.type.includes('document')) folder = 'documents';

                const response = await mediaService.uploadFile(file, folder);
                if (response.success) {
                    newUrls.push(response.media.url);
                }
            } catch (error) {
                console.error("File upload failed", error);
                alert(`Failed to upload ${file.name}`);
            }
        }

        if (newUrls.length > 0) {
            if (multiple) {
                onChange(value ? [...(Array.isArray(value) ? value : [value]), ...newUrls] : newUrls);
            } else {
                onChange(newUrls[0]);
            }
        }
    };

    const getIcon = (url) => {
        const isImage = url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || (typeof url === 'string' && url.startsWith('blob:'));

        if (isImage) {
            return <img src={url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />;
        }
        return <File size={24} />;
    };

    return (
        <div className="file-uploader">
            {label && <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>{label}</label>}

            {/* Preview Area */}
            {value && (
                <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(Array.isArray(value) ? value : [value]).map((url, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: '#F3F4F6',
                            borderRadius: '6px',
                            border: '1px solid #E5E7EB'
                        }}>
                            {getIcon(url)}
                            <span style={{ fontSize: '0.9rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {url.split('/').pop()} (Local Preview)
                            </span>
                            <button
                                onClick={() => {
                                    if (Array.isArray(value)) {
                                        const newValue = value.filter((_, idx) => idx !== i);
                                        onChange(newValue);
                                    } else {
                                        onChange('');
                                    }
                                }}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById(`file-upload-${label}`).click()}
                style={{
                    border: `2px dashed ${dragActive ? 'var(--color-primary)' : '#D1D5DB'}`,
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: dragActive ? '#F0F9FF' : '#F9FAFB',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <input
                    id={`file-upload-${label}`}
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFiles(e.target.files)}
                />
                <Upload size={24} color="#9CA3AF" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280' }}>
                    Click to upload or drag and drop
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#9CA3AF' }}>
                    {accept === '*' ? 'All files accepted' : accept}
                </p>
            </div>
        </div>
    );
};

export default FileUploader;
