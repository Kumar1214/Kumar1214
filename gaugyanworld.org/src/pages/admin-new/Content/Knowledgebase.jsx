import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Video, Eye, EyeOff, BookOpen, X } from 'lucide-react';
import { useData } from '../../../context/useData';
import ImageUploader from '../../../components/ImageUploader';
import RichTextEditor from '../../../components/RichTextEditor';

const AdminKnowledgebaseManagement = () => {
    const {
        filteredKnowledgebase,
        addKnowledgebase,
        deleteKnowledgebase,
        updateKnowledgebase,
        knowledgebaseCategories,
        addKnowledgebaseCategory,
        deleteKnowledgebaseCategory
    } = useData();

    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [formData, setFormData] = useState({
        category: '',
        title: '',
        videoUrl: '',
        videoName: '',
        image: '',
        status: 'active',
        description: '',
        author: '',
        lastUpdated: new Date().toISOString().split('T')[0]
    });

    const [newCategory, setNewCategory] = useState({
        name: '',
        icon: '📚',
        description: ''
    });

    const filteredArticles = (filteredKnowledgebase || [])
        .filter(article =>
            (filterCategory === 'all' || article.category === filterCategory) &&
            (filterStatus === 'all' || article.status === filterStatus) &&
            (article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    const resetForm = () => {
        setFormData({
            category: knowledgebaseCategories[0]?.name || '',
            title: '',
            videoUrl: '',
            videoName: '',
            image: '',
            status: 'active',
            description: '',
            author: '',
            lastUpdated: new Date().toISOString().split('T')[0]
        });
        setEditingArticle(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingArticle) {
            updateKnowledgebase(editingArticle.id, formData);
        } else {
            addKnowledgebase(formData);
        }
        setShowModal(false);
        resetForm();
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setFormData({
            category: article.category || '',
            title: article.title || '',
            videoUrl: article.videoUrl || '',
            videoName: article.videoName || '',
            image: article.image || '',
            status: article.status || 'active',
            description: article.description || '',
            author: article.author || '',
            lastUpdated: article.lastUpdated || new Date().toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const handleDelete = (article) => {
        if (window.confirm(`Delete article "${article.title}"?`)) {
            deleteKnowledgebase(article.id);
        }
    };

    const handleToggleStatus = (article) => {
        updateKnowledgebase(article.id, {
            ...article,
            status: article.status === 'active' ? 'inactive' : 'active'
        });
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        addKnowledgebaseCategory(newCategory);
        setShowCategoryModal(false);
        setNewCategory({ name: '', icon: '📚', description: '' });
    };

    return (
        <div style={{ padding: window.innerWidth > 768 ? '32px' : '16px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Knowledgebase Management
                    </h1>
                    <p style={{ color: '#6B7280' }}>Manage knowledgebase articles and categories</p>
                </div>

                {/* Actions Bar */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: window.innerWidth > 768 ? '24px' : '16px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: window.innerWidth > 768 ? 'row' : 'column',
                    gap: '16px',
                    alignItems: window.innerWidth > 768 ? 'center' : 'stretch',
                    justifyContent: 'space-between'
                }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1, maxWidth: window.innerWidth > 768 ? '400px' : '100%' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#F97316'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            style={{
                                padding: '10px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all">All Categories</option>
                            {knowledgebaseCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: '10px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            onClick={() => setShowCategoryModal(true)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Manage Categories
                        </button>

                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                        >
                            <Plus size={16} />
                            Add Article
                        </button>
                    </div>
                </div>

                {/* Articles Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? 'repeat(3, 1fr)' : window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr', gap: '24px' }}>
                    {filteredArticles.map((article) => (
                        <div key={article.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer'
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
                            {/* Image */}
                            <div style={{ width: '100%', height: '180px', backgroundColor: '#F3F4F6', position: 'relative' }}>
                                {article.image ? (
                                    <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                                        <BookOpen size={48} />
                                    </div>
                                )}
                                {article.videoUrl && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Video size={14} />
                                        Video
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: '#EEF2FF',
                                        color: '#4F46E5'
                                    }}>
                                        {knowledgebaseCategories.find(c => c.name === article.category)?.icon} {article.category}
                                    </span>
                                    <button
                                        onClick={() => handleToggleStatus(article)}
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: article.status === 'active' ? '#10B98120' : '#EF444420',
                                            color: article.status === 'active' ? '#10B981' : '#EF4444',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {article.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </div>

                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '8px', lineHeight: '1.4' }}>
                                    {article.title}
                                </h3>

                                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '16px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {article.description}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                        <div>By {article.author}</div>
                                        <div>{article.views?.toLocaleString() || 0} views</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEdit(article)}
                                            style={{
                                                padding: '8px',
                                                backgroundColor: 'white',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                color: '#374151',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article)}
                                            style={{
                                                padding: '8px',
                                                backgroundColor: 'white',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                color: '#EF4444',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '60px 20px',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        <BookOpen size={48} style={{ opacity: 0.5, margin: '0 auto 16px', color: '#9CA3AF' }} />
                        <p style={{ color: '#9CA3AF', fontSize: '1.125rem' }}>No articles found</p>
                    </div>
                )}
            </div>

            {/* Article Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '32px',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
                            {editingArticle ? 'Edit Article' : 'Add New Article'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="">Select Category</option>
                                        {knowledgebaseCategories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                    placeholder="Enter article title"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Video URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Video Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.videoName}
                                        onChange={(e) => setFormData({ ...formData, videoName: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                        placeholder="Video title"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Featured Image
                                </label>
                                <ImageUploader
                                    label=""
                                    value={formData.image ? [formData.image] : []}
                                    onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Description *
                                </label>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(content) => setFormData({ ...formData, description: content })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Author *
                                </label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                    placeholder="Author name"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: '#F97316',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingArticle ? 'Update Article' : 'Add Article'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#F3F4F6',
                                        color: '#374151',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '32px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Categories</h2>
                            <button onClick={() => setShowCategoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCategorySubmit} style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '12px', alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Icon
                                    </label>
                                    <input
                                        type="text"
                                        value={newCategory.icon}
                                        onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '1.5rem',
                                            textAlign: 'center'
                                        }}
                                        placeholder="📚"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                        placeholder="Category name"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#F97316',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </form>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {knowledgebaseCategories.map(cat => (
                                <div key={cat.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{cat.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{cat.description}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteKnowledgebaseCategory(cat.id)}
                                        style={{
                                            padding: '6px 12px',
                                            border: '1px solid #FCA5A5',
                                            color: '#B91C1C',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            background: '#FEF2F2',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminKnowledgebaseManagement;
