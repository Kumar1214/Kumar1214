import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Clock } from 'lucide-react';

const QuizSearch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['All', 'Ayurveda', 'Yoga', 'Vedic Studies', 'Sanskrit', 'General Knowledge'];
    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

    const allQuizzes = [
        { id: 1, title: 'Daily Ayurveda Quiz', category: 'Ayurveda', duration: '10 min', questions: 20, difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'Yoga Asanas Identification', category: 'Yoga', duration: '15 min', questions: 30, difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'Sanskrit Vocabulary Test', category: 'Sanskrit', duration: '12 min', questions: 25, difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200' },
        { id: 4, title: 'Vedic Mathematics Quick Quiz', category: 'Vedic Studies', duration: '8 min', questions: 15, difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=200' },
        { id: 5, title: 'Indian Culture Trivia', category: 'General Knowledge', duration: '10 min', questions: 20, difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=200' },
    ];

    const filteredQuizzes = allQuizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || quiz.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    return (
        <div className="container mt-lg">
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)' }}>Search Quizzes</h1>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search quizzes..." style={{ width: '100%', padding: '14px 50px 14px 20px', borderRadius: 'var(--radius-md)', border: '2px solid #E5E7EB', fontSize: '1rem' }} />
                    <Search size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '250px 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>
                <button onClick={() => setShowFilters(!showFilters)} style={{ display: showFilters ? 'none' : 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #E5E7EB', backgroundColor: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-lg)', width: 'fit-content' }}>
                    <Filter size={18} /> Show Filters
                </button>

                {showFilters && (
                    <div className="card" style={{ padding: 'var(--spacing-lg)', height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>Filters</h3>
                            <button onClick={() => setShowFilters(false)} style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Category</h4>
                            {categories.map(cat => (
                                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: 'var(--spacing-sm)' }}>
                                    <input type="radio" name="category" checked={selectedCategory === cat.toLowerCase()} onChange={() => setSelectedCategory(cat.toLowerCase())} />
                                    {cat}
                                </label>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Difficulty</h4>
                            {difficulties.map(diff => (
                                <label key={diff} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: 'var(--spacing-sm)' }}>
                                    <input type="radio" name="difficulty" checked={selectedDifficulty === diff.toLowerCase()} onChange={() => setSelectedDifficulty(diff.toLowerCase())} />
                                    {diff}
                                </label>
                            ))}
                        </div>
                        <button onClick={() => { setSelectedCategory('all'); setSelectedDifficulty('all'); setSearchQuery(''); }} style={{ marginTop: 'var(--spacing-lg)', width: '100%', padding: '10px', border: '1px solid #F59E0B', backgroundColor: 'white', color: '#F59E0B', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
                            Clear All Filters
                        </button>
                    </div>
                )}

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>{filteredQuizzes.length} Results</h2>
                    {filteredQuizzes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                            <Search size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.3 }} />
                            <h3>No quizzes found</h3>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {filteredQuizzes.map(quiz => (
                                <div key={quiz.id} onClick={() => navigate(`/quizzes/${quiz.id}`)} className="card" style={{ padding: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={quiz.image} alt={quiz.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{quiz.title}</h3>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                                            <span style={{ padding: '2px 8px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>{quiz.category}</span>
                                            <span style={{ padding: '2px 8px', backgroundColor: '#DBEAFE', color: '#1E40AF', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>{quiz.difficulty}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {quiz.duration}</span>
                                            <span>{quiz.questions} questions</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizSearch;
