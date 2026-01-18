import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, BookOpen, Clock, Star } from 'lucide-react';

const CourseSearch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['All', 'Ayurveda', 'Yoga', 'Vedic Studies', 'Sanskrit', 'Spirituality'];
    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    const allCourses = [
        { id: 1, title: 'Introduction to Ayurveda', instructor: 'Dr. Vasant Lad', category: 'Ayurveda', level: 'Beginner', duration: '8 weeks', students: '12.5K', rating: 4.8, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'Advanced Yoga Philosophy', instructor: 'Swami Ramdev', category: 'Yoga', level: 'Advanced', duration: '12 weeks', students: '8.2K', rating: 4.9, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'Sanskrit for Beginners', instructor: 'Prof. Sharma', category: 'Sanskrit', level: 'Beginner', duration: '10 weeks', students: '15K', rating: 4.7, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200' },
        { id: 4, title: 'Vedic Mathematics', instructor: 'Dr. Amit Kumar', category: 'Vedic Studies', level: 'Intermediate', duration: '6 weeks', students: '9.8K', rating: 4.6, image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=200' },
        { id: 5, title: 'Meditation & Mindfulness', instructor: 'Guru Sunita', category: 'Spirituality', level: 'Beginner', duration: '4 weeks', students: '20K', rating: 4.9, image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=200' },
    ];

    const filteredCourses = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || course.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase();

        return matchesSearch && matchesCategory && matchesLevel;
    });

    return (
        <div className="container mt-lg">
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)' }}>Search Courses</h1>

            {/* Search Bar */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, instructor, or category..."
                        style={{
                            width: '100%',
                            padding: '14px 50px 14px 20px',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid #E5E7EB',
                            fontSize: '1rem'
                        }}
                    />
                    <Search size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '250px 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>

                {/* Filter Toggle */}
                <button onClick={() => setShowFilters(!showFilters)} style={{ display: showFilters ? 'none' : 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #E5E7EB', backgroundColor: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-lg)', width: 'fit-content' }}>
                    <Filter size={18} /> Show Filters
                </button>

                {/* Filters Sidebar */}
                {showFilters && (
                    <div className="card" style={{ padding: 'var(--spacing-lg)', height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>Filters</h3>
                            <button onClick={() => setShowFilters(false)} style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Category</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {categories.map(cat => (
                                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" name="category" checked={selectedCategory === cat.toLowerCase()} onChange={() => setSelectedCategory(cat.toLowerCase())} />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Level</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {levels.map(level => (
                                    <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" name="level" checked={selectedLevel === level.toLowerCase()} onChange={() => setSelectedLevel(level.toLowerCase())} />
                                        {level}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button onClick={() => { setSelectedCategory('all'); setSelectedLevel('all'); setSearchQuery(''); }} style={{ marginTop: 'var(--spacing-lg)', width: '100%', padding: '10px', border: '1px solid var(--color-primary)', backgroundColor: 'white', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Results */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>
                        {filteredCourses.length} {filteredCourses.length === 1 ? 'Result' : 'Results'}
                    </h2>

                    {filteredCourses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                            <Search size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.3 }} />
                            <h3>No courses found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {filteredCourses.map(course => (
                                <div key={course.id} onClick={() => navigate(`/courses/${course.id}`)} className="card" style={{ padding: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{course.title}</h3>
                                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>by {course.instructor}</p>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', marginBottom: '8px' }}>
                                            <span style={{ padding: '2px 8px', backgroundColor: '#FFF7ED', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>{course.category}</span>
                                            <span style={{ padding: '2px 8px', backgroundColor: '#DBEAFE', color: '#1E40AF', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>{course.level}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {course.duration}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={14} /> {course.students} students</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Star size={16} fill="#F59E0B" color="#F59E0B" />
                                                <span style={{ fontWeight: 600 }}>{course.rating}</span>
                                            </div>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10B981', backgroundColor: '#D1FAE5', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>FREE</span>
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

export default CourseSearch;
