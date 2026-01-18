import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Newspaper, Eye, Calendar, X } from 'lucide-react';
import { useData } from '../../../context/useData';
import ImageUploader from '../../../components/ImageUploader';
import RichTextEditor from '../../../components/RichTextEditor';
import { getImageUrl } from '../../../utils/imageHelper';

const AdminNewsManagement = () => {
    const {
        filteredNews: contextNews,
        addNews,
        deleteNews,
        updateNews,
        newsCategories,
        addNewsCategory,
        deleteNewsCategory
    } = useData();

    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        category: '',
        tags: [],
        author: '',
        publishDate: new Date().toISOString().split('T')[0],
        status: 'draft'
    });

    const [newCategory, setNewCategory] = useState({
        name: '',
        icon: '📰',
        description: ''
    });

    const [tagInput, setTagInput] = useState('');

    const filteredNews = (contextNews || [])
        .filter(article =>
            (filterCategory === 'all' || article.category === filterCategory) &&
            (filterStatus === 'all' || article.status === filterStatus) &&
            (article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            excerpt: '',
            featuredImage: '',
            category: newsCategories[0]?.name || '',
            tags: [],
            author: '',
            publishDate: new Date().toISOString().split('T')[0],
            status: 'draft'
        });
        setTagInput('');
        setEditingArticle(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingArticle) {
            updateNews(editingArticle.id, formData);
        } else {
            addNews(formData);
        }
        setShowModal(false);
        resetForm();
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setFormData({
            title: article.title || '',
            content: article.content || '',
            excerpt: article.excerpt || '',
            featuredImage: article.featuredImage || '',
            category: article.category || '',
            tags: article.tags || [],
            author: article.author || '',
            publishDate: article.publishDate || new Date().toISOString().split('T')[0],
            status: article.status || 'draft'
        });
        setShowModal(true);
    };

    const handleDelete = (article) => {
        if (window.confirm(`Delete article "${article.title}"?`)) {
            deleteNews(article.id);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        addNewsCategory(newCategory);
        setShowCategoryModal(false);
        setNewCategory({ name: '', icon: '📰', description: '' });
    };

    return (
        <div style={{ padding: window.innerWidth > 768 ? '32px' : '16px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        News Management
                    </h1>
                    <p style={{ color: '#6B7280' }}>Manage news articles and categories</p>
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
                    <div style={{ position: 'relative', flex: 1, maxWidth: window.innerWidth > 768 ? '400px' : '100%' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search news..."
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
                            {newsCategories.map(cat => (
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
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
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
                                cursor: 'pointer'
                            }}
                        >
                            Categories
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
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <Plus size={16} />
                            Add Article
                        </button>
                    </div>
                </div>

                {/* News Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Article</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Category</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Author</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Date</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Views</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNews.length > 0 ? (
                                    filteredNews.map((article) => (
                                        <tr key={article.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F3F4F6', flexShrink: 0 }}>
                                                        {article.featuredImage ? (
                                                            <img src={getImageUrl(article.featuredImage)} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                                                                <Newspaper size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: '#1F2937', marginBottom: '4px' }}>{article.title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: '1.4' }}>{article.excerpt}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    backgroundColor: '#EEF2FF',
                                                    color: '#4F46E5'
                                                }}>
                                                    {article.category}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#6B7280' }}>{article.author}</td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Calendar size={14} />
                                                    {article.publishDate}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                                {article.views?.toLocaleString() || 0}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    backgroundColor: article.status === 'published' ? '#10B98120' : '#FEF3C7',
                                                    color: article.status === 'published' ? '#10B981' : '#92400E'
                                                }}>
                                                    {article.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleEdit(article)}
                                                        style={{
                                                            padding: '8px 16px',
                                                            backgroundColor: 'white',
                                                            border: '1px solid #E5E7EB',
                                                            borderRadius: '6px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500,
                                                            color: '#374151',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(article)}
                                                        style={{
                                                            padding: '8px',
                                                            backgroundColor: 'white',
                                                            border: '1px solid #E5E7EB',
                                                            borderRadius: '6px',
                                                            color: '#EF4444',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                <Newspaper size={40} style={{ opacity: 0.5 }} />
                                                <span>No news articles found</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
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
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
                            {editingArticle ? 'Edit News Article' : 'Add News Article'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Excerpt *
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    required
                                    rows={2}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Brief summary of the article"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
                                        {newsCategories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                                        ))}
                                    </select>
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
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Featured Image
                                </label>
                                <ImageUploader
                                    label=""
                                    value={formData.featuredImage ? [formData.featuredImage] : []}
                                    onChange={(urls) => setFormData({ ...formData, featuredImage: urls[0] || '' })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Tags
                                </label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                        placeholder="Add tag and press Enter"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#F3F4F6',
                                            color: '#374151',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {formData.tags.map((tag, index) => (
                                        <span key={index} style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#EEF2FF',
                                            color: '#4F46E5',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Content *
                                </label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
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
                                    {editingArticle ? 'Update Article' : 'Publish Article'}
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
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>News Categories</h2>
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
                                        placeholder="📰"
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
                            {newsCategories.map(cat => (
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
                                        onClick={() => deleteNewsCategory(cat.id)}
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

export default AdminNewsManagement;
