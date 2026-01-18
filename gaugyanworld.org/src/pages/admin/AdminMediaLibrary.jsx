import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Upload, Grid, List, Search, Filter, X, Copy, Trash2, Eye, Download,
    Calendar, FileType, HardDrive, FolderOpen, CheckSquare, Square, Image as ImageIcon,
    Video, Music as MusicIcon, FileText, File, SortAsc, SortDesc, RefreshCw
} from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

import api from '../../services/api';

const AdminMediaLibrary = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [selectedItems, setSelectedItems] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        dateFrom: '',
        dateTo: '',
        fileType: 'all',
        folder: 'all',
        sortBy: 'date',
        sortOrder: 'desc'
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 20;

    // Load media from backend
    const getMockMediaData = () => {
        return [
            {
                id: '1',
                filename: 'hero-banner.jpg',
                originalName: 'hero-banner.jpg',
                mimeType: 'image/jpeg',
                size: 245678,
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                folder: 'banners',
                createdAt: '2024-12-01T10:30:00Z',
                uploadedBy: { name: 'Admin User', email: 'admin@gaugyan.com' }
            },
            {
                id: '2',
                filename: 'product-image.png',
                originalName: 'product-image.png',
                mimeType: 'image/png',
                size: 512345,
                url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800',
                folder: 'products',
                createdAt: '2024-12-02T14:20:00Z',
                uploadedBy: { name: 'Admin User', email: 'admin@gaugyan.com' }
            },
            {
                id: '3',
                filename: 'gaushala-photo.jpg',
                originalName: 'gaushala-photo.jpg',
                mimeType: 'image/jpeg',
                size: 389012,
                url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
                folder: 'gaushala',
                createdAt: '2024-12-03T09:15:00Z',
                uploadedBy: { name: 'Admin User', email: 'admin@gaugyan.com' }
            }
        ];
    };

    // Load media from backend
    const loadMedia = useCallback(async () => {
        try {
            const queryParams = {
                page: currentPage,
                limit: itemsPerPage,
                ...(filters.folder !== 'all' && { folder: filters.folder })
            };

            const response = await api.get('/media', { params: queryParams });
            const data = response.data;

            setMediaItems(data.media || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error loading media:', error);
            // Fallback to mock data for demo
            setMediaItems(getMockMediaData());
        }
    }, [currentPage, filters]);

    useEffect(() => {
        // We use a flag to prevent setting state on unmounted component
        let isMounted = true;

        const fetchData = async () => {
            if (isMounted) {
                await loadMedia();
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [loadMedia]);

    // File upload handlers
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        uploadFiles(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        uploadFiles(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const uploadFiles = async (files) => {
        setUploading(true);
        setUploadProgress(0);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file
            if (file.size > 50 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Maximum size is 50MB.`);
                continue;
            }

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', filters.folder !== 'all' ? filters.folder : 'general');

                const response = await api.post('/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.status === 200 || response.status === 201) {
                    setUploadProgress(((i + 1) / files.length) * 100);
                } else {
                    console.error('Upload failed for', file.name);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        setUploading(false);
        setUploadProgress(0);
        loadMedia();
    };

    // Filter and sort media items
    const getFilteredMedia = () => {
        let filtered = [...mediaItems];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(item =>
                item.originalName.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // File type filter
        if (filters.fileType !== 'all') {
            filtered = filtered.filter(item => {
                if (filters.fileType === 'image') return item.mimeType.startsWith('image/');
                if (filters.fileType === 'video') return item.mimeType.startsWith('video/');
                if (filters.fileType === 'audio') return item.mimeType.startsWith('audio/');
                if (filters.fileType === 'document') return item.mimeType.includes('pdf') || item.mimeType.includes('document');
                return true;
            });
        }

        // Date filter
        if (filters.dateFrom) {
            filtered = filtered.filter(item => new Date(item.createdAt) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            filtered = filtered.filter(item => new Date(item.createdAt) <= new Date(filters.dateTo));
        }

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            if (filters.sortBy === 'date') {
                comparison = new Date(b.createdAt) - new Date(a.createdAt);
            } else if (filters.sortBy === 'name') {
                comparison = a.originalName.localeCompare(b.originalName);
            } else if (filters.sortBy === 'size') {
                comparison = b.size - a.size;
            }
            return filters.sortOrder === 'asc' ? -comparison : comparison;
        });

        return filtered;
    };

    // Selection handlers
    const toggleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredMedia.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredMedia.map(item => item.id));
        }
    };

    // Action handlers
    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };

    const deleteMedia = async (id) => {
        if (!window.confirm('Are you sure you want to delete this media?')) return;

        try {
            const response = await api.delete(`/media/${id}`);

            if (response.status === 200) {
                loadMedia();
                setSelectedItems(prev => prev.filter(i => i !== id));
            }
        } catch (error) {
            console.error('Error deleting media:', error);
        }
    };

    const bulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedItems.length} selected items?`)) return;

        for (const id of selectedItems) {
            await deleteMedia(id);
        }
        setSelectedItems([]);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            dateFrom: '',
            dateTo: '',
            fileType: 'all',
            folder: 'all',
            sortBy: 'date',
            sortOrder: 'desc'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) return <ImageIcon size={20} />;
        if (mimeType.startsWith('video/')) return <Video size={20} />;
        if (mimeType.startsWith('audio/')) return <MusicIcon size={20} />;
        if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText size={20} />;
        return <File size={20} />;
    };

    const filteredMedia = getFilteredMedia();

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: window.innerWidth > 768 ? '32px' : '16px' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Media Library
                    </h1>
                    <p style={{ color: '#6B7280' }}>Manage all your media assets in one place</p>
                </div>

                {/* Upload Area */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        marginBottom: '24px',
                        border: '2px dashed #E5E7EB',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={48} style={{ color: '#9CA3AF', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '8px' }}>
                        Upload Media Files
                    </h3>
                    <p style={{ color: '#6B7280', marginBottom: '16px' }}>
                        Drag and drop files here, or click to browse
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                        Supports: Images, Videos, Audio, Documents (Max 50MB per file)
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Upload Progress */}
                {uploading && (
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 600, color: '#1F2937' }}>Uploading...</span>
                            <span style={{ color: '#6B7280' }}>{Math.round(uploadProgress)}%</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', backgroundColor: '#4F46E5', width: `${uploadProgress}%`, transition: 'width 0.3s' }} />
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Search */}
                    <div style={{ flex: '1 1 300px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 40px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: showFilters ? '#4F46E5' : 'white',
                                color: showFilters ? 'white' : '#6B7280',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: 500
                            }}
                        >
                            <Filter size={18} />
                            Filters
                        </button>

                        <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: 'white',
                                color: '#6B7280',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
                        </button>

                        {selectedItems.length > 0 && (
                            <button
                                onClick={bulkDelete}
                                style={{
                                    padding: '10px 16px',
                                    backgroundColor: '#FEF2F2',
                                    color: '#EF4444',
                                    border: '1px solid #FCA5A5',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontWeight: 500
                                }}
                            >
                                <Trash2 size={18} />
                                Delete ({selectedItems.length})
                            </button>
                        )}

                        <button
                            onClick={loadMedia}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: 'white',
                                color: '#6B7280',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1F2937' }}>Filters</h3>
                            <button
                                onClick={clearFilters}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#F3F4F6',
                                    color: '#6B7280',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Clear All
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? 'repeat(4, 1fr)' : '1fr', gap: '16px' }}>
                            {/* File Type */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    File Type
                                </label>
                                <select
                                    value={filters.fileType}
                                    onChange={(e) => setFilters({ ...filters, fileType: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">All Types</option>
                                    <option value="image">Images</option>
                                    <option value="video">Videos</option>
                                    <option value="audio">Audio</option>
                                    <option value="document">Documents</option>
                                </select>
                            </div>

                            {/* Folder */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Folder
                                </label>
                                <select
                                    value={filters.folder}
                                    onChange={(e) => setFilters({ ...filters, folder: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">All Folders</option>
                                    <option value="general">General</option>
                                    <option value="banners">Banners</option>
                                    <option value="products">Products</option>
                                    <option value="gaushala">Gaushala</option>
                                    <option value="courses">Courses</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Sort By
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="date">Upload Date</option>
                                    <option value="name">File Name</option>
                                    <option value="size">File Size</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Order
                                </label>
                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr', gap: '16px', marginTop: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div style={{ marginBottom: '16px', color: '#6B7280', fontSize: '0.875rem' }}>
                    Showing {filteredMedia.length} of {mediaItems.length} files
                </div>

                {/* Media Grid/List */}
                {viewMode === 'grid' ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth > 1024 ? 'repeat(4, 1fr)' : window.innerWidth > 768 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                        gap: '16px'
                    }}>
                        {filteredMedia.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    border: selectedItems.includes(item.id) ? '2px solid #4F46E5' : '2px solid transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                }}
                            >
                                {/* Image Preview */}
                                <div
                                    onClick={() => toggleSelectItem(item.id)}
                                    style={{
                                        height: '160px',
                                        backgroundImage: item.mimeType.startsWith('image/') ? `url(${getImageUrl(item.url)})` : 'none',
                                        backgroundColor: '#F3F4F6',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}
                                >
                                    {!item.mimeType.startsWith('image/') && (
                                        <div style={{ color: '#9CA3AF' }}>
                                            {getFileIcon(item.mimeType)}
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                                        {selectedItems.includes(item.id) ? (
                                            <CheckSquare size={20} color="#4F46E5" fill="#4F46E5" />
                                        ) : (
                                            <Square size={20} color="white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div style={{ padding: '12px' }}>
                                    <div
                                        style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: '#1F2937',
                                            marginBottom: '4px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        title={item.originalName}
                                    >
                                        {item.originalName}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '8px' }}>
                                        {formatFileSize(item.size)}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={() => copyUrl(getImageUrl(item.url))}
                                            style={{
                                                flex: 1,
                                                padding: '6px',
                                                backgroundColor: '#F3F4F6',
                                                color: '#6B7280',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '4px',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedMedia(item);
                                                setShowDetailModal(true);
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '6px',
                                                backgroundColor: '#F3F4F6',
                                                color: '#6B7280',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '4px',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteMedia(item.id)}
                                            style={{
                                                flex: 1,
                                                padding: '6px',
                                                backgroundColor: '#FEF2F2',
                                                color: '#EF4444',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '4px',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#F9FAFB' }}>
                                <tr>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === filteredMedia.length && filteredMedia.length > 0}
                                            onChange={toggleSelectAll}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Preview</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>File Name</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Type</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Size</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Uploaded</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedia.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '8px',
                                                backgroundImage: item.mimeType.startsWith('image/') ? `url(${getImageUrl(item.url)})` : 'none',
                                                backgroundColor: '#F3F4F6',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {!item.mimeType.startsWith('image/') && (
                                                    <div style={{ color: '#9CA3AF' }}>
                                                        {getFileIcon(item.mimeType)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#1F2937', fontWeight: 500 }}>
                                            {item.originalName}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                            {item.mimeType.split('/')[1]?.toUpperCase()}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                            {formatFileSize(item.size)}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button
                                                    onClick={() => copyUrl(getImageUrl(item.url))}
                                                    style={{
                                                        padding: '6px 10px',
                                                        backgroundColor: '#F3F4F6',
                                                        color: '#6B7280',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem'
                                                    }}
                                                    title="Copy URL"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedMedia(item);
                                                        setShowDetailModal(true);
                                                    }}
                                                    style={{
                                                        padding: '6px 10px',
                                                        backgroundColor: '#F3F4F6',
                                                        color: '#6B7280',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem'
                                                    }}
                                                    title="View Details"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => deleteMedia(item.id)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        backgroundColor: '#FEF2F2',
                                                        color: '#EF4444',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Empty State */}
                {filteredMedia.length === 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '64px 32px',
                        textAlign: 'center'
                    }}>
                        <ImageIcon size={64} style={{ color: '#E5E7EB', margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '8px' }}>
                            No media files found
                        </h3>
                        <p style={{ color: '#6B7280' }}>
                            Upload some files to get started
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    marginTop: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: currentPage === 1 ? '#F3F4F6' : 'white',
                            color: currentPage === 1 ? '#9CA3AF' : '#6B7280',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontWeight: 500
                        }}
                    >
                        Previous
                    </button>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        color: '#6B7280',
                        fontSize: '0.875rem'
                    }}>
                        Page {currentPage} of {totalPages}
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: currentPage === totalPages ? '#F3F4F6' : 'white',
                            color: currentPage === totalPages ? '#9CA3AF' : '#6B7280',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontWeight: 500
                        }}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedMedia && (
                <div
                    onClick={() => setShowDetailModal(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid #E5E7EB',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937' }}>
                                Media Details
                            </h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6B7280'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Preview */}
                        <div style={{ padding: '24px', backgroundColor: '#F9FAFB' }}>
                            {selectedMedia.mimeType.startsWith('image/') ? (
                                <img
                                    src={getImageUrl(selectedMedia.url)}
                                    alt={selectedMedia.originalName}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '12px',
                                        maxHeight: '400px',
                                        objectFit: 'contain'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    height: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: '12px'
                                }}>
                                    {getFileIcon(selectedMedia.mimeType)}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '4px' }}>FILE NAME</div>
                                    <div style={{ fontSize: '0.875rem', color: '#1F2937' }}>{selectedMedia.originalName}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '4px' }}>FILE TYPE</div>
                                    <div style={{ fontSize: '0.875rem', color: '#1F2937' }}>{selectedMedia.mimeType}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '4px' }}>FILE SIZE</div>
                                    <div style={{ fontSize: '0.875rem', color: '#1F2937' }}>{formatFileSize(selectedMedia.size)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '4px' }}>FOLDER</div>
                                    <div style={{ fontSize: '0.875rem', color: '#1F2937' }}>{selectedMedia.folder}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '4px' }}>UPLOADED</div>
                                    <div style={{ fontSize: '0.875rem', color: '#1F2937' }}>
                                        {new Date(selectedMedia.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '4px' }}>UPLOADED BY</div>
                                    <div style={{ fontSize: '0.875rem', color: '#1F2937' }}>
                                        {selectedMedia.uploadedBy?.name || 'Unknown'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '4px' }}>URL</div>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        color: '#1F2937',
                                        backgroundColor: '#F3F4F6',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        wordBreak: 'break-all'
                                    }}>
                                        {getImageUrl(selectedMedia.url)}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button
                                    onClick={() => copyUrl(getImageUrl(selectedMedia.url))}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: '#4F46E5',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Copy size={18} />
                                    Copy URL
                                </button>
                                <a
                                    href={getImageUrl(selectedMedia.url)}
                                    download
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: '#10B981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <Download size={18} />
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMediaLibrary;
