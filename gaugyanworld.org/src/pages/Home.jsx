import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileQuestion, GraduationCap, Music, Mic, ShoppingBag, ArrowRight, Home as HomeIcon, Newspaper } from 'lucide-react';
import ModernBannerSlider from '../components/ModernBannerSlider';
import BannerGrid from '../components/BannerGrid';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import { contentService } from '../services/api';
import { useData } from '../context/useData';
import { useCurrency } from '../context/CurrencyContext';
import { getImageUrl, handleImgError } from '../utils/imageHelper';

// Static Browse Categories (Can be dynamic later)
const BROWSE_CATS = [
    { id: 1, label: 'Exams', icon: <FileQuestion size={24} />, to: '/exams' },
    { id: 2, label: 'Quizzes', icon: <BookOpen size={24} />, to: '/quizzes' },
    { id: 3, label: 'Courses', icon: <GraduationCap size={24} />, to: '/courses' },
    { id: 4, label: 'Music', icon: <Music size={24} />, to: '/entertainment' },
    { id: 5, label: 'Podcasts', icon: <Mic size={24} />, to: '/entertainment' },
    { id: 6, label: 'Shop', icon: <ShoppingBag size={24} />, to: '/shop' },
    { id: 7, label: 'Gaushala', icon: <HomeIcon size={24} />, to: '/gaushala' },
    { id: 8, label: 'Panchang', icon: <Newspaper size={24} />, to: '/panchang' },
    { id: 9, label: 'Astrology', icon: <FileQuestion size={24} />, to: '/astrology' },
    { id: 10, label: 'News', icon: <Newspaper size={24} />, to: '/news' },
    { id: 11, label: 'Knowledge', icon: <BookOpen size={24} />, to: '/knowledgebase' },
];

const Home = () => {
    const { settings } = useData();
    const { formatPrice } = useCurrency();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [featuredQuiz, setFeaturedQuiz] = useState(null);
    const [featuredExam, setFeaturedExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Products
                const productRes = await contentService.getProducts({ limit: 10, sort: 'rating' });
                if (productRes.data.success) {
                    setFeaturedProducts(productRes.data.data);
                }

                // Fetch Courses
                const courseRes = await contentService.getCourses({ limit: 10, sort: 'popular' });
                if (courseRes.data.success) {
                    setFeaturedCourses(courseRes.data.data);
                }

                // Fetch Featured Quiz
                const quizRes = await contentService.getQuizzes({ limit: 1, featured: true });
                if (quizRes.data.success && quizRes.data.data.length > 0) {
                    setFeaturedQuiz(quizRes.data.data[0]);
                } else if (Array.isArray(quizRes.data) && quizRes.data.length > 0) {
                    setFeaturedQuiz(quizRes.data[0]);
                }

                // Fetch Featured Exam
                const examRes = await contentService.getExams({ limit: 1, featured: true });
                if (examRes.data.success && examRes.data.data.length > 0) {
                    setFeaturedExam(examRes.data.data[0]);
                } else if (Array.isArray(examRes.data) && examRes.data.length > 0) {
                    setFeaturedExam(examRes.data[0]);
                }


            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="container">
                {/* 1. Hero Slider - Using home-top for main slider */}
                <ModernBannerSlider placement="home" />

                {/* 2. Browse By Categories */}
                {/* 2. Browse By Categories */}
                <div style={{ marginTop: 'var(--spacing-3xl)', marginBottom: 'var(--spacing-3xl)' }}>
                    <Carousel title="Browse By Categories">
                        {BROWSE_CATS.map(cat => (
                            <Link to={cat.to} key={cat.id} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                minWidth: '100px', // Changed width to minWidth for safety
                                flexShrink: 0,     // Essential for carousel
                                textDecoration: 'none'
                            }}>
                                <div style={{
                                    width: '70px',      // Slightly larger touch target
                                    height: '70px',
                                    borderRadius: '20px', // More modern rounded corners
                                    backgroundColor: 'white',
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-primary)',
                                    border: '1px solid #F3F4F6',
                                    transition: 'transform 0.2s',
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {cat.icon}
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-main)' }}>{cat.label}</span>
                            </Link>
                        ))}
                    </Carousel>
                </div>

                {/* 3. Featured Banners */}
                <BannerGrid featuredQuiz={featuredQuiz} featuredExam={featuredExam} />

                {/* 4. About Gaugyan Section */}
                <div style={{
                    marginTop: 'var(--spacing-3xl)',
                    marginBottom: 'var(--spacing-3xl)',
                    position: 'relative',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    {/* Background Banner */}
                    <div style={{
                        position: 'relative',
                        backgroundImage: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FDC830 100%)',
                        padding: 'var(--spacing-3xl) var(--spacing-2xl)',
                        color: 'white'
                    }}>
                        {/* Decorative Pattern Overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                            pointerEvents: 'none'
                        }}></div>

                        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                marginBottom: 'var(--spacing-lg)',
                                textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}>
                                About GauGyan
                            </h2>
                            <div style={{
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                opacity: 0.95,
                                marginBottom: 'var(--spacing-xl)'
                            }}>
                                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                                    {settings?.siteDescription || 'GauGyan is a comprehensive platform dedicated to preserving and promoting ancient Indian wisdom about cow welfare, sustainable living, and holistic health. We bring together knowledge, community, and commerce to create a sustainable ecosystem centered around Gau Seva (cow service).'}
                                </p>
                            </div>

                            {/* Key Features Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 'var(--spacing-lg)',
                                marginTop: 'var(--spacing-2xl)'
                            }}>
                                {[
                                    { emoji: '📚', title: 'Learn', subtitle: 'Courses, Exams & Knowledge', link: '/courses' },
                                    { emoji: '🛒', title: 'Shop', subtitle: 'Authentic Cow Products', link: '/shop' },
                                    { emoji: '🤝', title: 'Connect', subtitle: 'Join Our Community', link: '/community' },
                                    { emoji: '🧘', title: 'Wellness', subtitle: 'Music & Meditation', link: '/entertainment' }
                                ].map((feature, idx) => (
                                    <Link to={feature.link} key={feature.title} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(10px)',
                                            padding: 'var(--spacing-lg)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            height: '100%',
                                            transition: 'transform 0.2s, background-color 0.2s'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                            }}
                                        >
                                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{feature.emoji}</div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>{feature.title}</h4>
                                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{feature.subtitle}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Featured Video Section */}
                <div style={{
                    marginBottom: 'var(--spacing-3xl)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div style={{
                        position: 'relative',
                        paddingBottom: '56.25%', // 16:9 Aspect Ratio
                        height: 0,
                        backgroundColor: '#000'
                    }}>
                        <iframe
                            src="https://www.youtube.com/embed/JuSdIVCi6B4"
                            title="Baba Mohanram Bhiwadi ke chamatkar cow seva"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 0
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* 5. Featured Courses (Reordered: Courses First) */}
                <Carousel title="Popular Courses" linkTo="/courses">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} style={{ minWidth: '300px', height: '320px', background: '#f3f4f6', borderRadius: '12px' }} className="animate-pulse"></div>
                        ))
                    ) : featuredCourses.length > 0 ? (
                        featuredCourses.map(course => (
                            <div key={course.id} style={{ width: '300px', flexShrink: 0 }}>
                                <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card" style={{
                                        padding: 0,
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        border: '1px solid #E5E7EB'
                                    }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                                            <img
                                                src={getImageUrl(course.image)}
                                                alt={course.title}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={handleImgError}
                                            />
                                        </div>
                                        <div style={{ padding: 'var(--spacing-md)', flex: 1 }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.title}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{course.instructor?.displayName || 'Unknown Instructor'}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                                <span style={{ fontWeight: 700, color: '#F59E0B' }}>★ {course.rating?.toFixed(1) || '0.0'}</span>
                                                <span style={{ fontWeight: 700, color: course.price === 0 ? '#10B981' : 'var(--color-primary)' }}>
                                                    {course.price === 0 ? 'FREE' : formatPrice(course.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '20px', color: '#6B7280' }}>No courses found.</div>
                    )}
                </Carousel>

                {/* 6. Featured Products (Reordered: Products Second) */}
                <Carousel title="Featured Products" linkTo="/shop">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} style={{ minWidth: '280px', height: '350px', background: '#f3f4f6', borderRadius: '12px' }} className="animate-pulse"></div>
                        ))
                    ) : featuredProducts.length > 0 ? (
                        featuredProducts.map(product => (
                            <div key={product.id} style={{ width: '280px', flexShrink: 0 }}>
                                <ProductCard
                                    id={product.id}
                                    title={product.name}
                                    image={Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' && product.images.startsWith('[') ? JSON.parse(product.images)[0] : product.images) || 'https://via.placeholder.com/300'}
                                    price={product.price}
                                    originalPrice={product.originalPrice || product.price}
                                    rating={product.rating}
                                    reviews={product.reviews}
                                    isSale={product.isSale}
                                    vendor={product.vendor}
                                />
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '20px', color: '#6B7280' }}>No products found.</div>
                    )}
                </Carousel>

                {/* 7. Join Community Banner */}
                <div style={{
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-2xl)',
                    textAlign: 'center',
                    color: 'white',
                    marginBottom: 'var(--spacing-2xl)',
                    backgroundImage: 'linear-gradient(45deg, var(--color-primary) 0%, #EA580C 100%)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)', fontWeight: 800 }}>Join Our Community</h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xl)', opacity: 0.95, maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
                        Connect with thousands of like-minded individuals, share your knowledge, and contribute to the welfare of cows.
                    </p>
                    <Link to="/signup">
                        <button style={{
                            backgroundColor: 'white',
                            color: 'var(--color-primary)',
                            padding: '14px 36px',
                            borderRadius: 'var(--radius-full)',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Join Now
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
};
export default Home;
