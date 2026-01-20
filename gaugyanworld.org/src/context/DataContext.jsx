import React, { useState, useEffect, useCallback } from 'react';
export const DataContext = React.createContext();
export const useData = () => React.useContext(DataContext);
import { useAuth } from './AuthContext';

import api, { contentService, bannerService } from '../services/api';

export const DataProvider = ({ children }) => {
    const auth = useAuth() || {};
    const { user: currentUser } = auth;

    // Helper to load from localStorage or use default
    const loadState = (key, defaultValue) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (error) {
            console.error(`Error loading state for ${key}:`, error);
            return defaultValue;
        }
    };



    // Helper to fetch data from API with fallback
    const useApiData = (endpoint, defaultData) => {
        const [data, setData] = useState(defaultData);
        const [loading, setLoading] = useState(true);

        const fetchData = useCallback(async () => {
            setLoading(true);
            try {
                // Remove localhost check and raw fetch - use configured api instance
                const response = await api.get(`/${endpoint}`);
                const result = response.data;

                // Handle different response structures
                if (result.success && result.data) {
                    setData(result.data);
                } else if (Array.isArray(result)) {
                    setData(result);
                } else if (result.settings) {
                    // Special case for settings
                    setData(prev => ({ ...prev, [endpoint]: result.settings }));
                } else {
                    // If structure matches expected data directly
                    setData(result);
                }
            } catch (error) {
                console.error(`Error fetching ${endpoint}:`, error);

                // If 401/403, we might want to handle it, but api interceptor does it.
                // We keep default data on error.
            } finally {
                setLoading(false);
            }
        }, [endpoint]);

        useEffect(() => {
            fetchData();
        }, [fetchData]);

        return [data, setData, loading, fetchData];
    };

    // Save to localStorage whenever state changes
    const usePersistedState = (key, defaultValue) => {
        const [state, setState] = useState(() => loadState(key, defaultValue));
        useEffect(() => {
            localStorage.setItem(key, JSON.stringify(state));
        }, [key, state]);
        return [state, setState];
    };

    // Initial Default Data (Removed dummy data to rely on API)
    const DEFAULT_COURSES = [];
    const DEFAULT_COURSE_CATEGORIES = [];
    const DEFAULT_EXAMS = [];
    const DEFAULT_EXAM_CATEGORIES = [];
    const DEFAULT_QUIZ_CATEGORIES = [];
    const DEFAULT_QUIZZES = [];

    const DEFAULT_PRODUCT_CATEGORIES = [
        { id: 1, name: 'Ayurvedic Products', description: 'Natural Ayurvedic remedies and supplements', icon: '🌿' },
        { id: 2, name: 'Yoga Equipment', description: 'Mats, blocks, and accessories', icon: '🧘' },
        { id: 3, name: 'Books & Literature', description: 'Spiritual and educational books', icon: '📚' },
        { id: 4, name: 'Organic Food', description: 'Healthy organic food products', icon: '🌾' }
    ];

    const DEFAULT_PRODUCTS = [
        { id: 1, name: 'Organic Turmeric Powder', description: 'Pure organic turmeric powder for health and wellness', price: 299, originalPrice: 399, category: 'Ayurvedic Products', stock: 150, sku: 'AYU-TUR-001', images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=400'], vendor: 'Organic Farms India', status: 'approved', rating: 4.5, reviews: 234 },
        { id: 2, name: 'Premium Yoga Mat', description: 'Eco-friendly non-slip yoga mat', price: 1299, originalPrice: 1799, category: 'Yoga Equipment', stock: 75, sku: 'YOG-MAT-001', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=400'], vendor: 'Yoga Essentials', status: 'approved', rating: 4.8, reviews: 456 },
        { id: 3, name: 'Bhagavad Gita (English)', description: 'Complete English translation with commentary', price: 499, originalPrice: 699, category: 'Books & Literature', stock: 200, sku: 'BOK-BG-001', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400'], vendor: 'Spiritual Books', status: 'approved', rating: 4.9, reviews: 789 },
        { id: 101, title: 'Pending Test Course', instructor: 'Test Instructor', category: 'Yoga', rating: 0, students: 0, price: 499, image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=400', level: 'Beginner', status: 'pending' },
    ];

    const DEFAULT_MUSIC = [
        { id: 1, title: 'Krishna Flute Meditation', artist: 'Pandit Hariprasad Chaurasia', album: 'Divine Melodies', genre: 'Classical', mood: 'Peaceful', duration: '8:45', audioUrl: '/audio/krishna-flute.mp3', coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=400', plays: 125000, likes: 8500, rating: 4.8, releaseDate: '2024-01-15', lyrics: '', status: 'approved' },
        { id: 2, title: 'Om Chanting', artist: 'Swami Anand', album: 'Sacred Sounds', genre: 'Meditation', mood: 'Spiritual', duration: '11:20', audioUrl: '/audio/om-chanting.mp3', coverArt: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&q=80&w=400', plays: 89000, likes: 6200, rating: 4.7, releaseDate: '2024-02-20', lyrics: 'Om...', status: 'approved' },
        { id: 3, title: 'Raag Bhairavi', artist: 'Ustad Zakir Hussain', album: 'Classical Ragas', genre: 'Classical', mood: 'Devotional', duration: '15:30', audioUrl: '/audio/raag-bhairavi.mp3', coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=400', plays: 67000, likes: 4800, rating: 4.9, releaseDate: '2024-03-10', lyrics: '', status: 'approved' },
        { id: 101, title: 'Pending Bhajan - Shri Ram Stuti', artist: 'Pandit Ravi Kumar', album: 'Devotional Collection', genre: 'Devotional', mood: 'Spiritual', duration: '12:30', audioUrl: '/audio/pending-bhajan.mp3', coverArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=400', plays: 0, likes: 0, rating: 0, releaseDate: '2024-11-29', lyrics: '', status: 'pending', description: 'A soulful devotional bhajan dedicated to Lord Ram' }
    ];

    const DEFAULT_MUSIC_ALBUMS = [
        { id: 1, name: 'Divine Melodies', description: 'Sacred flute compositions', artist: 'Pandit Hariprasad Chaurasia' },
        { id: 2, name: 'Sacred Sounds', description: 'Meditation and chanting', artist: 'Swami Anand' },
        { id: 3, name: 'Classical Ragas', description: 'Traditional Indian classical music', artist: 'Ustad Zakir Hussain' }
    ];

    const DEFAULT_MUSIC_GENRES = [
        { id: 1, name: 'Classical', description: 'Traditional Indian classical music', icon: '🎵' },
        { id: 2, name: 'Meditation', description: 'Peaceful meditation music', icon: '🧘' },
        { id: 3, name: 'Devotional', description: 'Devotional and bhajan music', icon: '🙏' },
        { id: 4, name: 'Folk', description: 'Traditional folk music', icon: '🎶' },
        { id: 5, name: 'Mantra', description: 'Sacred mantras and chants', icon: '🕉️' }
    ];

    const DEFAULT_MUSIC_MOODS = [
        { id: 1, name: 'Peaceful', description: 'Calm and serene', color: '#10B981' },
        { id: 2, name: 'Spiritual', description: 'Deeply spiritual and devotional', color: '#8B5CF6' },
        { id: 3, name: 'Energetic', description: 'Uplifting and energizing', color: '#F59E0B' },
        { id: 4, name: 'Relaxing', description: 'Soothing and relaxing', color: '#3B82F6' },
        { id: 5, name: 'Devotional', description: 'Devotional and prayerful', color: '#EC4899' }
    ];

    const DEFAULT_PODCAST_SERIES = [
        { id: 1, name: 'Wellness Wisdom', description: 'Health and wellness insights' },
        { id: 2, name: 'Mindful Living', description: 'Meditation and mindfulness practices' },
        { id: 3, name: 'Spiritual Journey', description: 'Exploring spiritual paths' }
    ];

    const DEFAULT_PODCAST_CATEGORIES = [
        { id: 1, name: 'Spirituality', description: 'Spiritual teachings and practices', icon: '🕉️' },
        { id: 2, name: 'Wellness', description: 'Health and wellness topics', icon: '🌿' },
        { id: 3, name: 'Culture', description: 'Cultural stories and traditions', icon: '🎭' },
        { id: 4, name: 'Education', description: 'Educational content', icon: '📚' }
    ];

    const DEFAULT_PODCASTS = [];
    const DEFAULT_MEDITATION = [];
    const DEFAULT_NEWS = [];
    const DEFAULT_KNOWLEDGEBASE = [];

    const DEFAULT_NEWS_CATEGORIES = [
        { id: 1, name: 'Announcements', description: 'Official system announcements', icon: '📢' },
        { id: 2, name: 'Events', description: 'Upcoming events and workshops', icon: '🗓️' },
        { id: 3, name: 'General', description: 'General news and updates', icon: '📰' }
    ];

    const DEFAULT_KNOWLEDGEBASE_CATEGORIES = [
        { id: 1, name: 'Platform Guide', description: 'How to use the platform', icon: '📖' },
        { id: 2, name: 'Technical Support', description: 'Troubleshooting and technical help', icon: '🔧' },
        { id: 3, name: 'Account & Billing', description: 'Account management and payments', icon: '💳' }
    ];





    const DEFAULT_GAUSHALAS = [
        {
            id: 1,
            name: 'Shri Krishna Gaushala',
            city: 'Mumbai',
            state: 'Maharashtra',
            address: '123 Gaushala Road, Andheri West, Mumbai - 400053',
            phone: '+91 98765 43210',
            email: 'contact@shrikrishnagaushala.org',
            website: 'www.shrikrishnagaushala.org',
            cows: 250,
            staff: 25,
            established: '2010',
            timings: 'Open Daily: 6:00 AM - 7:00 PM',
            description: 'Shri Krishna Gaushala is a premier cow shelter dedicated to the care and protection of indigenous Indian cows. We provide a safe haven for abandoned, injured, and aged cows, ensuring they receive proper nutrition, medical care, and love.',
            image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=1200',
            gallery: [
                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=400',
            ],
            services: [
                'Daily Cow Care & Feeding',
                'Veterinary Services',
                'Cow Adoption Program',
                'Organic Dairy Products',
                'Educational Tours',
                'Volunteer Opportunities'
            ],
            achievements: [
                'Rescued 500+ cows since inception',
                'Award for Best Gaushala 2023',
                'Certified Organic Dairy',
                'Zero-waste facility'
            ],
            featuredProducts: [
                { id: 1, name: 'Pure Desi Ghee', price: 899, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=200' },
                { id: 2, name: 'Fresh Cow Milk', price: 80, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200' },
                { id: 3, name: 'Organic Paneer', price: 120, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=200' },
            ],
            status: 'active'
        },
        {
            id: 2,
            name: 'Ganga Tier Gaushala',
            city: 'Varanasi',
            state: 'Uttar Pradesh',
            address: 'Ghat Road, Varanasi - 221001',
            phone: '+91 98765 43211',
            email: 'contact@gangatier.org',
            cows: 150,
            staff: 15,
            established: '2015',
            timings: 'Open Daily: 5:00 AM - 8:00 PM',
            description: 'Dedicated to serving cows on the banks of Ganga.',
            image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=1200',
            gallery: [],
            services: ['Cow Shelter', 'Medical Care'],
            achievements: [],
            featuredProducts: [],
            status: 'active'
        },
        {
            id: 3,
            name: 'Surabhi Seva Kendra',
            city: 'Vrindavan',
            state: 'Uttar Pradesh',
            address: 'Parikrama Marg, Vrindavan - 281121',
            latitude: '27.5650',
            longitude: '77.6593',
            phone: '+91 91234 56789',
            email: 'seva@surabhi.org',
            website: 'www.surabhi.org',
            cows: 500,
            staff: 40,
            established: '2005',
            timings: 'Open Daily: 5:00 AM - 8:00 PM',
            description: 'A sanctuary for spiritual connection and cow protection in the heart of Vrindavan.',
            image: 'https://images.unsplash.com/photo-1545644747-d31c4709d0cb?auto=format&fit=crop&q=80&w=1200',
            gallery: [
                'https://images.unsplash.com/photo-1596739268662-8e7c442438c8?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1598555232938-16447817b124?auto=format&fit=crop&q=80&w=400'
            ],
            services: ['Gau Puja', 'Gau Daan', 'Biogas Plant'],
            achievements: ['Best Management 2022', 'Largest Solar Powered Gaushala'],
            featuredProducts: [],
            status: 'active'
        },
        {
            id: 4,
            name: 'Kamadhenu Sanctuary',
            city: 'Jaipur',
            state: 'Rajasthan',
            address: 'Ajmer Road, Jaipur - 302006',
            latitude: '26.9124',
            longitude: '75.7873',
            phone: '+91 99887 76655',
            email: 'info@kamadhenu.com',
            website: 'www.kamadhenu.com',
            cows: 300,
            staff: 20,
            established: '2012',
            timings: 'Open Daily: 7:00 AM - 6:00 PM',
            description: 'Preserving the heritage of indigenous cattle breeds in Rajasthan.',
            image: 'https://images.unsplash.com/photo-1591543620760-46638a16dd18?auto=format&fit=crop&q=80&w=1200',
            gallery: [],
            services: ['Breed Conservation', 'Organic Farming Training'],
            achievements: ['State Award for Conservation'],
            featuredProducts: [],
            status: 'active'
        }
    ];

    const DEFAULT_COWS = [
        {
            id: 1,
            name: 'Gauri',
            breed: 'Gir',
            age: 5,
            gender: 'Female',
            color: 'Brown',
            description: 'Beautiful Gir breed cow, excellent milk producer',
            healthStatus: 'Good',
            currentLocation: 'Shri Krishna Gaushala',
            adoptionStatus: 'adopted',
            monthlyCost: 2500,
            gaushala: 1,
            gaushalaName: 'Shri Krishna Gaushala',
            gaushalaLocation: 'Mumbai, Maharashtra',
            milkProduction: '15 liters/day',
            temperament: 'Calm',
            vaccinated: true,
            image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400',
            healthRecords: [
                {
                    date: '2024-10-15',
                    treatment: 'Annual vaccination',
                    veterinarian: 'Dr. Sharma',
                    notes: 'All vaccines administered'
                }
            ],
            adoptionHistory: [
                {
                    adopterId: 5,
                    adopterName: 'Rajesh Kumar',
                    startDate: '2024-01-15',
                    status: 'active',
                    monthlyPayment: 2500
                }
            ]
        },
        {
            id: 2,
            name: 'Sundari',
            breed: 'Sahiwal',
            age: 3,
            gender: 'Female',
            color: 'Red',
            description: 'Young Sahiwal cow, gentle temperament',
            healthStatus: 'Excellent',
            currentLocation: 'Ganga Tier Gaushala',
            adoptionStatus: 'available',
            monthlyCost: 3000,
            gaushala: 2,
            gaushalaName: 'Ganga Tier Gaushala',
            gaushalaLocation: 'Varanasi, Uttar Pradesh',
            milkProduction: '12 liters/day',
            temperament: 'Friendly',
            vaccinated: true,
            image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400'
        }
    ];

    const DEFAULT_QUESTIONS = [
        { id: 1, text: 'What is the primary purpose of Ayurveda?', type: 'multiple-choice', difficulty: 'Easy', category: 'Ayurveda', options: ['To cure diseases', 'To maintain health in the healthy and cure disease in the sick', 'To perform surgery', 'To study herbs'], correctAnswer: 1, explanation: 'Ayurveda focuses on prevention and holistic health.' },
        { id: 2, text: 'What does "Yoga" mean?', type: 'multiple-choice', difficulty: 'Easy', category: 'Yoga', options: ['Exercise', 'Union', 'Stretching', 'Breathing'], correctAnswer: 1, explanation: 'Yoga means union of mind, body, and spirit.' },
        { id: 3, text: 'Which Veda contains Ayurvedic knowledge?', type: 'multiple-choice', difficulty: 'Medium', category: 'Ayurveda', options: ['Rig Veda', 'Sama Veda', 'Yajur Veda', 'Atharva Veda'], correctAnswer: 3, explanation: 'Atharva Veda contains Ayurvedic principles.' }
    ];

    const DEFAULT_QUIZ_QUESTIONS = [
        { id: 1, type: 'quiz', questionType: 'multiple_choice', text: 'What is the primary purpose of Ayurveda?', options: ['To cure diseases', 'To maintain health in the healthy and cure disease in the sick', 'To perform surgery', 'To study herbs'], correctAnswer: 1, difficulty: 'medium', tags: ['ayurveda', 'basics'] },
        { id: 2, type: 'quiz', questionType: 'multiple_choice', text: 'Which of the following is NOT a Dosha?', options: ['Vata', 'Pitta', 'Kapha', 'Prana'], correctAnswer: 3, difficulty: 'easy', tags: ['ayurveda', 'doshas'] }
    ];

    const DEFAULT_EXAM_QUESTIONS = [
        { id: 1, type: 'exam', questionType: 'essay', text: 'Explain the concept of Tridosha in detail.', marks: 10, timeLimit: 20, difficulty: 'hard', tags: ['ayurveda', 'tridosha'] },
        { id: 2, type: 'exam', questionType: 'long_answer', text: 'Describe the benefits of Surya Namaskar.', marks: 5, timeLimit: 10, difficulty: 'medium', tags: ['yoga', 'surya namaskar'] }
    ];

    const DEFAULT_QUESTION_BANKS = [
        { id: 1, title: 'Ayurveda Previous Year Papers 2023', category: 'Ayurveda', year: '2023', fileUrl: '', description: 'Collection of previous year question papers.' },
        { id: 2, title: 'Yoga Certification Model Questions', category: 'Yoga', year: '2024', fileUrl: '', description: 'Model questions for upcoming certification.' }
    ];

    const DEFAULT_USERS = [
        { id: 1, firstName: 'Admin', lastName: 'Mediocity', email: 'admin@mediocity.com', mobile: '+917777777', role: 'admin', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', loginAsUser: 'admin@mediocity.com', createdAt: '2024-01-15', lastLogin: '2024-11-28', password: 'admin123' },
        { id: 2, firstName: 'Instructor', lastName: 'Mediocity', email: 'instructor@mediocitygmail.com', mobile: '9876543229', role: 'instructor', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', loginAsUser: 'instructor@mediocity.com', createdAt: '2024-02-10', lastLogin: '2024-11-27', password: 'instructor123' },
        { id: 3, firstName: 'Gary', lastName: 'Oldman', email: 'gary7934@mail.com', mobile: '7894581217', role: 'instructor', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', loginAsUser: 'gary@mail.com', createdAt: '2024-03-05', lastLogin: '2024-11-26', password: 'password123' },
        { id: 4, firstName: 'Shine', lastName: 'Hardy', email: 'Shinehardy@mail.com', mobile: '6589741217', role: 'instructor', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', loginAsUser: 'shine@mail.com', createdAt: '2024-03-12', lastLogin: '2024-11-25', password: 'password123' },
        { id: 5, firstName: 'User', lastName: 'Mediocity', email: 'User.mediocity@mail.com', mobile: '9411111111', role: 'user', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', loginAsUser: 'user@mail.com', createdAt: '2024-04-01', lastLogin: '2024-11-28', password: 'password123' },
        { id: 6, firstName: 'Yog', lastName: 'Raj', email: 'yog@gmail.com', mobile: '', role: 'instructor', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', loginAsUser: 'yograj@mail.com', createdAt: '2024-04-15', lastLogin: '2024-11-24', password: 'password123' },
        { id: 7, firstName: 'Gary', lastName: 'Oldman', email: 'gary7934@mail.com', mobile: '7894581217', role: 'instructor', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', loginAsUser: 'gary2@mail.com', createdAt: '2024-05-01', lastLogin: '2024-11-23', password: 'password123' },
        { id: 8, firstName: 'Shine', lastName: 'Hardy', email: 'Shinehardy@mail.com', mobile: '6589741217', role: 'instructor', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', loginAsUser: 'shine2@mail.com', createdAt: '2024-05-10', lastLogin: '2024-11-22', password: 'password123' },
        { id: 9, firstName: 'User', lastName: 'Mediocity', email: 'User.mediocity@mail.com', mobile: '9411111111', role: 'user', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', loginAsUser: 'user2@mail.com', createdAt: '2024-06-01', lastLogin: '2024-11-21', password: 'password123' },
        { id: 10, firstName: 'Viru', lastName: 'Kumar', email: 'viru@gmail.com', mobile: '', role: 'user', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', loginAsUser: 'viru@mail.com', createdAt: '2024-06-15', lastLogin: '2024-11-20', password: 'password123' },
        { id: 11, firstName: 'User', lastName: 'User', email: 'user@mediocity.co.in', mobile: '9415060585', role: 'user', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', loginAsUser: 'user3@mail.com', createdAt: '2024-07-01', lastLogin: '2024-11-19', password: 'password123' }
    ];

    const DEFAULT_CONTACT_MESSAGES = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Course Inquiry',
            message: 'I would like to know more about the Ayurveda course and its duration.',
            date: new Date().toISOString(),
            status: 'unread'
        }
    ];

    const DEFAULT_HOME_SLIDERS = [
        {
            id: 1,
            title: 'Welcome to GauGyan',
            subtitle: 'Learn, Grow, Transform',
            description: 'Discover ancient wisdom and modern knowledge on our comprehensive learning platform',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
            buttonText: 'Explore Courses',
            buttonLink: '/courses',
            order: 1,
            active: true,
            location: 'home'
        }
    ];

    const DEFAULT_ADVERTISEMENTS = [
        {
            id: 1,
            title: 'Summer Yoga Retreat',
            description: 'Join us for a 7-day yoga retreat in the Himalayas.',
            image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=400',
            link: 'https://example.com/retreat',
            package: 'Premium',
            status: 'active',
            startDate: '2024-06-01',
            endDate: '2024-06-30',
            views: 1200,
            clicks: 45
        }
    ];

    // State Management
    // State Management - Switched from usePersistedState to useApiData or simple state for API
    const [settings, setSettings, , refreshSettings] = useApiData('settings', {});
    const [courses, setCourses, , refreshCourses] = useApiData('courses', []);
    const [courseCategories, setCourseCategories, , refreshCourseCategories] = useApiData('course-categories', []);
    const [exams, setExams, , refreshExams] = useApiData('exams', []);

    // Todo: If backend supports categories per module, use useApiData. For now we use local storage or hardcoded if endpoints missing.
    // However, user wants to fix "hardcoded" lists.
    // Since backend has no category routes for exams/quiz, we will keep them local but empty initially or fetch unique column values?
    // For now, let's keep them as PersistedState but initialized EMPTY so user can add custom ones
    const [examCategories, setExamCategories] = usePersistedState('examCategories', []);

    const [quizzes, setQuizzes, , refreshQuizzes] = useApiData('quizzes', []);
    const [quizCategories, setQuizCategories] = usePersistedState('quizCategories', []);
    const [results, setResults] = usePersistedState('results', []);
    const [productCategories, setProductCategories] = usePersistedState('productCategories', DEFAULT_PRODUCT_CATEGORIES);
    const [products, setProducts, , refreshProducts] = useApiData('products', []);
    const [music, setMusic, , refreshMusic] = useApiData('music', []);
    const [musicAlbums, setMusicAlbums] = usePersistedState('musicAlbums', DEFAULT_MUSIC_ALBUMS);
    const [musicGenres, setMusicGenres] = usePersistedState('musicGenres', DEFAULT_MUSIC_GENRES);
    const [musicMoods, setMusicMoods] = usePersistedState('musicMoods', DEFAULT_MUSIC_MOODS);
    const [podcasts, setPodcasts, , refreshPodcasts] = useApiData('podcasts', []);
    const [podcastSeries, setPodcastSeries] = usePersistedState('podcastSeries', DEFAULT_PODCAST_SERIES);
    const [podcastCategories, setPodcastCategories] = usePersistedState('podcastCategories', DEFAULT_PODCAST_CATEGORIES);
    const [meditation, setMeditation, , refreshMeditation] = useApiData('meditation', []);
    const [news, setNews, , refreshNews] = useApiData('news', []);

    const [knowledgebase, setKnowledgebase, , refreshKnowledgebase] = useApiData('v1/content/knowledgebase', []);



    // gaushalas state is now managed via API fetch below
    const [questions, setQuestions, , refreshQuestions] = useApiData('questions', []);
    const [quizQuestions, setQuizQuestions] = usePersistedState('quizQuestions', DEFAULT_QUIZ_QUESTIONS);
    const [examQuestions, setExamQuestions] = usePersistedState('examQuestions', DEFAULT_EXAM_QUESTIONS);
    const [questionBanks, setQuestionBanks, , refreshQuestionBanks] = useApiData('question-banks', []);
    const [users, setUsers, , refreshUsers] = useApiData('users', []);
    const [roles, setRoles, , refreshRoles] = useApiData('roles', []);
    const [contactMessages, setContactMessages] = usePersistedState('contactMessages', DEFAULT_CONTACT_MESSAGES);
    const [homeSliders, setHomeSliders] = usePersistedState('homeSliders', DEFAULT_HOME_SLIDERS);
    const [advertisements, setAdvertisements] = usePersistedState('advertisements', DEFAULT_ADVERTISEMENTS);

    const DEFAULT_ORDERS = [
        {
            id: 10426,
            orderNumber: '10426',
            date: '2025-09-25T22:06:00',
            updatedAt: '2025-09-25T22:09:00',
            status: 'Completed',
            paymentStatus: 'Payment Received',
            paymentMethod: 'Bank Transfer',
            currency: 'INR',
            total: 7418.88,
            subtotal: 6624.00,
            tax: 794.88,
            shipping: 0.00,
            buyerName: 'vkpandey',
            buyerEmail: 'vkpandey@udyogsoftware.com',
            buyerPhone: '9069069454',
            billingAddress: {
                firstName: 'Vivek Kumar',
                lastName: 'Pandey',
                email: 'vkpandey@udyogsoftware.com',
                phone: '09069069454',
                address: 'Gurgaon',
                city: 'Gurgaon',
                state: 'Haryana',
                country: 'India',
                zipCode: '122001',
                gstNo: ''
            },
            shippingAddress: {
                firstName: 'Vivek Kumar',
                lastName: 'Pandey',
                email: 'vkpandey@udyogsoftware.com',
                phone: '09069069454',
                address: 'Gurgaon',
                city: 'Gurgaon',
                state: 'Haryana',
                country: 'India',
                zipCode: '122001',
                gstNo: ''
            },
            items: [
                {
                    id: 202,
                    sku: 'WMB 989',
                    name: 'Mailer White Box (3 Ply) 16.5 x 9.65 x 2.52 Inch (Quantity: 100)',
                    price: 2208,
                    quantity: 300,
                    hsnCode: '48191010',
                    gst: 795,
                    gstRate: '12%',
                    shippingCost: 0,
                    total: 7419,
                    status: 'Completed',
                    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=100'
                }
            ],
            boxQuantity: '300 pcs',
            shippingMethod: 'Self Pickup',
            trackingCode: '',
            trackingUrl: ''
        },
        {
            id: 10427,
            orderNumber: '10427',
            date: '2025-09-26T10:00:00',
            updatedAt: '2025-09-26T10:05:00',
            status: 'Processing',
            paymentStatus: 'Pending',
            paymentMethod: 'UPI',
            currency: 'INR',
            total: 1299.00,
            subtotal: 1299.00,
            tax: 0.00,
            shipping: 50.00,
            buyerName: 'Amit Kumar',
            buyerEmail: 'amit@example.com',
            buyerPhone: '9876543210',
            billingAddress: {
                firstName: 'Amit',
                lastName: 'Kumar',
                email: 'amit@example.com',
                phone: '9876543210',
                address: 'Sector 15',
                city: 'Noida',
                state: 'Uttar Pradesh',
                country: 'India',
                zipCode: '201301'
            },
            shippingAddress: {
                firstName: 'Amit',
                lastName: 'Kumar',
                email: 'amit@example.com',
                phone: '9876543210',
                address: 'Sector 15',
                city: 'Noida',
                state: 'Uttar Pradesh',
                country: 'India',
                zipCode: '201301'
            },
            items: [
                {
                    id: 203,
                    sku: 'YOG-MAT-001',
                    name: 'Premium Yoga Mat',
                    price: 1299,
                    quantity: 1,
                    hsnCode: '9506',
                    gst: 0,
                    gstRate: '0%',
                    shippingCost: 50,
                    total: 1349,
                    status: 'Processing',
                    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=100'
                }
            ]
        }
    ];
    const [orders, setOrders, , refreshOrders] = useApiData('orders', []);

    // CRUD Operations

    // Settings
    // Settings
    const updateSettings = async (category, newSettings) => {
        try {
            await api.put(`/settings/${category}`, { settings: newSettings });
            if (refreshSettings) refreshSettings();
        } catch (error) { console.error('Error updating settings:', error); }
    };

    // Courses
    const addCourse = (course) => { setCourses([...courses, { ...course, id: Date.now(), students: 0, lectures: 0, createdBy: currentUser?.uid || 'system' }]); if (refreshCourses) refreshCourses(); };
    const deleteCourse = async (id) => {
        try {
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(c => c.id !== id)); if (refreshCourses) refreshCourses();
        } catch (error) { console.error('Error deleting course:', error); }
    };
    const updateCourse = async (id, updatedData) => {
        try {
            const response = await api.put(`/courses/${id}`, updatedData);
            const data = response.data;
            if (data.success) { setCourses(courses.map(c => c.id === id ? { ...c, ...updatedData } : c)); if (refreshCourses) refreshCourses(); }
        } catch (error) { console.error('Error updating course:', error); }
    };
    const addCourseCategory = async (category) => {
        try {
            const response = await api.post('/course-categories', category);
            if (response.status === 200 || response.status === 201) { if (refreshCourseCategories) refreshCourseCategories(); }
        } catch (error) { console.error('Error adding category:', error); }
    };
    const deleteCourseCategory = async (id) => {
        try {
            await api.delete(`/course-categories/${id}`);
            if (refreshCourseCategories) refreshCourseCategories();
        } catch (error) { console.error('Error deleting category:', error); }
    };
    const updateCourseCategory = async (id, updatedData) => {
        try {
            const response = await api.put(`/course-categories/${id}`, updatedData);
            if (response.status === 200) { if (refreshCourseCategories) refreshCourseCategories(); }
        } catch (error) { console.error('Error updating category:', error); }
    };

    // Exams - Now using API
    const addExam = async (exam) => {
        try {
            const response = await api.post('/exams', exam);
            if (response.data.success && refreshExams) refreshExams();
            // Fallback optimistic update if refresh fails or takes time
            else setExams([...exams, response.data.data]);
        } catch (error) { console.error('Error adding exam:', error); }
    };

    const deleteExam = async (id) => {
        try {
            await api.delete(`/exams/${id}`);
            if (refreshExams) refreshExams();
            else setExams(exams.filter(e => e.id !== id));
        } catch (error) { console.error('Error deleting exam:', error); }
    };

    const updateExam = async (id, updatedData) => {
        try {
            await api.put(`/exams/${id}`, updatedData);
            if (refreshExams) refreshExams();
            else setExams(exams.map(e => e.id === id ? { ...e, ...updatedData } : e));
        } catch (error) { console.error('Error updating exam:', error); }
    };

    const addExamCategory = (category) => setExamCategories([...examCategories, { ...category, id: Date.now() }]);
    const deleteExamCategory = (id) => setExamCategories(examCategories.filter(c => c.id !== id));
    const updateExamCategory = (id, updatedData) => setExamCategories(examCategories.map(c => c.id === id ? { ...c, ...updatedData } : c));

    // Quizzes - Now using API
    const addQuiz = async (quiz) => {
        try {
            const response = await api.post('/quizzes', quiz);
            if (response.data.success && refreshQuizzes) refreshQuizzes();
            else setQuizzes([...quizzes, response.data.data]);
        } catch (error) { console.error('Error adding quiz:', error); }
    };

    const deleteQuiz = async (id) => {
        try {
            await api.delete(`/quizzes/${id}`);
            if (refreshQuizzes) refreshQuizzes();
            else setQuizzes(quizzes.filter(q => q.id !== id));
        } catch (error) { console.error('Error deleting quiz:', error); }
    };

    const updateQuiz = async (id, updatedData) => {
        try {
            await api.put(`/quizzes/${id}`, updatedData);
            if (refreshQuizzes) refreshQuizzes();
            else setQuizzes(quizzes.map(q => q.id === id ? { ...q, ...updatedData } : q));
        } catch (error) { console.error('Error updating quiz:', error); }
    };

    const addQuizCategory = (category) => setQuizCategories([...quizCategories, { ...category, id: Date.now() }]);
    const deleteQuizCategory = (id) => setQuizCategories(quizCategories.filter(c => c.id !== id));
    const updateQuizCategory = (id, updatedData) => setQuizCategories(quizCategories.map(c => c.id === id ? { ...c, ...updatedData } : c));

    // Products
    const addProduct = (product) => { setProducts([...products, { ...product, id: Date.now(), createdBy: currentUser?.uid || 'system' }]); if (refreshProducts) refreshProducts(); };
    const deleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id)); if (refreshProducts) refreshProducts();
        } catch (error) { console.error('Error deleting product:', error); }
    };
    const updateProduct = async (id, updatedData) => {
        try {
            const response = await api.put(`/products/${id}`, updatedData);
            const data = response.data;
            if (data.success) { setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p)); if (refreshProducts) refreshProducts(); }
        } catch (error) { console.error('Error updating product:', error); }
    };
    const addProductCategory = (category) => setProductCategories([...productCategories, { ...category, id: Date.now() }]);
    const deleteProductCategory = (id) => setProductCategories(productCategories.filter(c => c.id !== id));
    const updateProductCategory = (id, updatedData) => setProductCategories(productCategories.map(c => c.id === id ? { ...c, ...updatedData } : c));

    // Music
    const addMusic = async (track) => {
        try {
            const response = await api.post('/music', track);
            const data = response.data;
            if (data.success) { setMusic([data.data, ...music]); if (refreshMusic) refreshMusic(); }
        } catch (error) { console.error('Error adding music:', error); }
    };
    const deleteMusic = async (id) => {
        try {
            await api.delete(`/music/${id}`);
            setMusic(music.filter(m => m.id !== id)); if (refreshMusic) refreshMusic();
        } catch (error) { console.error('Error deleting music:', error); }
    };
    const updateMusic = async (id, updatedData) => {
        try {
            const response = await api.put(`/music/${id}`, updatedData);
            const data = response.data;
            if (data.success) { setMusic(music.map(m => (m.id === id || m.id === id) ? data.data : m)); if (refreshMusic) refreshMusic(); }
        } catch (error) { console.error('Error updating music:', error); }
    };

    // Music Taxonomies
    const addMusicAlbum = (album) => setMusicAlbums([...musicAlbums, { ...album, id: Date.now() }]);
    const deleteMusicAlbum = (id) => setMusicAlbums(musicAlbums.filter(a => a.id !== id));
    const updateMusicAlbum = (id, updatedData) => setMusicAlbums(musicAlbums.map(a => a.id === id ? { ...a, ...updatedData } : a));
    const addMusicGenre = (genre) => setMusicGenres([...musicGenres, { ...genre, id: Date.now() }]);
    const deleteMusicGenre = (id) => setMusicGenres(musicGenres.filter(g => g.id !== id));
    const updateMusicGenre = (id, updatedData) => setMusicGenres(musicGenres.map(g => g.id === id ? { ...g, ...updatedData } : g));
    const addMusicMood = (mood) => setMusicMoods([...musicMoods, { ...mood, id: Date.now() }]);
    const deleteMusicMood = (id) => setMusicMoods(musicMoods.filter(m => m.id !== id));
    const updateMusicMood = (id, updatedData) => setMusicMoods(musicMoods.map(m => m.id === id ? { ...m, ...updatedData } : m));

    // Podcasts
    const addPodcast = async (podcast) => {
        try {
            const response = await api.post('/podcasts', podcast);
            const data = response.data;
            if (data.success) { setPodcasts([data.data, ...podcasts]); if (refreshPodcasts) refreshPodcasts(); }
        } catch (error) { console.error('Error adding podcast:', error); }
    };
    const deletePodcast = async (id) => {
        try {
            await api.delete(`/podcasts/${id}`);
            setPodcasts(podcasts.filter(p => p.id !== id)); if (refreshPodcasts) refreshPodcasts();
        } catch (error) { console.error('Error deleting podcast:', error); }
    };
    const updatePodcast = async (id, updatedData) => {
        try {
            const response = await api.put(`/podcasts/${id}`, updatedData);
            const data = response.data;
            if (data.success) { setPodcasts(podcasts.map(p => (p.id === id || p.id === id) ? data.data : p)); if (refreshPodcasts) refreshPodcasts(); }
        } catch (error) { console.error('Error updating podcast:', error); }
    };

    // Podcast Taxonomies
    const addPodcastSeries = (series) => setPodcastSeries([...podcastSeries, { ...series, id: Date.now() }]);
    const deletePodcastSeries = (id) => setPodcastSeries(podcastSeries.filter(s => s.id !== id));
    const updatePodcastSeries = (id, updatedData) => setPodcastSeries(podcastSeries.map(s => s.id === id ? { ...s, ...updatedData } : s));
    const addPodcastCategory = (category) => setPodcastCategories([...podcastCategories, { ...category, id: Date.now() }]);
    const deletePodcastCategory = (id) => setPodcastCategories(podcastCategories.filter(c => c.id !== id));
    const updatePodcastCategory = (id, updatedData) => setPodcastCategories(podcastCategories.map(c => c.id === id ? { ...c, ...updatedData } : c));

    // Meditation
    const addMeditation = async (item) => {
        try {
            const response = await api.post('/meditation', item);
            const data = response.data;
            if (data.success) { setMeditation([data.data, ...meditation]); if (refreshMeditation) refreshMeditation(); }
        } catch (error) { console.error('Error adding meditation:', error); }
    };
    const deleteMeditation = async (id) => {
        try {
            await api.delete(`/meditation/${id}`);
            setMeditation(meditation.filter(m => m.id !== id)); if (refreshMeditation) refreshMeditation();
        } catch (error) { console.error('Error deleting meditation:', error); }
    };
    const updateMeditation = async (id, updatedData) => {
        try {
            const response = await api.put(`/meditation/${id}`, updatedData);
            const data = response.data;
            if (data.success) { setMeditation(meditation.map(m => (m.id === id || m.id === id) ? data.data : m)); if (refreshMeditation) refreshMeditation(); }
        } catch (error) { console.error('Error updating meditation:', error); }
    };

    // News
    const addNews = async (article) => {
        try {
            const response = await contentService.createNews(article);
            const data = response.data;
            if (data.success) { setNews([data.data, ...news]); if (refreshNews) refreshNews(); }
        } catch (error) { console.error('Error adding news:', error); }
    };
    const deleteNews = async (id) => {
        try {
            await contentService.deleteNews(id);
            setNews(news.filter(n => n.id !== id)); if (refreshNews) refreshNews();
        } catch (error) { console.error('Error deleting news:', error); }
    };
    const updateNews = async (id, updatedData) => {
        try {
            const response = await contentService.updateNews(id, updatedData);
            const data = response.data;
            if (data.success) { setNews(news.map(n => (n.id === id || n.id === id) ? data.data : n)); if (refreshNews) refreshNews(); }
        } catch (error) { console.error('Error updating news:', error); }
    };

    // News Categories
    // News Categories (Now API Backed)
    const [newsCategories, setNewsCategories, , refreshNewsCategories] = useApiData('news-categories', []);

    const addNewsCategory = async (category) => {
        try {
            const response = await contentService.createNewsCategory(category);
            const data = response.data;
            if (data.success && refreshNewsCategories) refreshNewsCategories();
        } catch (error) { console.error('Error adding news category:', error); }
    };
    const deleteNewsCategory = async (id) => {
        try {
            await contentService.deleteNewsCategory(id);
            if (refreshNewsCategories) refreshNewsCategories();
        } catch (error) { console.error('Error deleting news category:', error); }
    };

    // Advertisement
    const addAdvertisement = async (adData) => {
        try {
            const response = await api.post('/advertisements', adData);
            return response.data;
        } catch (error) {
            console.error('Error adding advertisement:', error);
            return { success: true, message: "Request received (Mock)" };
        }
    };

    const updateNewsCategory = async (id, updatedData) => {
        try {
            await contentService.updateNewsCategory(id, updatedData);
            if (refreshNewsCategories) refreshNewsCategories();
        } catch (error) { console.error('Error updating news category:', error); }
    };

    // Knowledgebase
    const addKnowledgebase = async (article) => {
        try {
            const response = await contentService.createArticle(article);
            const data = response.data;
            if (data.success) { setKnowledgebase([data.data, ...knowledgebase]); if (refreshKnowledgebase) refreshKnowledgebase(); }
        } catch (error) { console.error('Error adding article:', error); }
    };
    const deleteKnowledgebase = async (id) => {
        try {
            await contentService.deleteArticle(id);
            setKnowledgebase(knowledgebase.filter(k => k.id !== id)); if (refreshKnowledgebase) refreshKnowledgebase();
        } catch (error) { console.error('Error deleting article:', error); }
    };
    const updateKnowledgebase = async (id, updatedData) => {
        try {
            const response = await contentService.updateArticle(id, updatedData);
            const data = response.data;
            if (data.success) { setKnowledgebase(knowledgebase.map(k => (k.id === id || k.id === id) ? data.data : k)); if (refreshKnowledgebase) refreshKnowledgebase(); }
        } catch (error) { console.error('Error updating article:', error); }
    };

    // Knowledgebase Categories
    // Knowledgebase Categories (Now API Backed)
    const [knowledgebaseCategories, setKnowledgebaseCategories, , refreshKnowledgebaseCategories] = useApiData('knowledgebase-categories', []);

    const addKnowledgebaseCategory = async (category) => {
        try {
            const response = await contentService.createKnowledgebaseCategory(category);
            const data = response.data;
            if (data.success && refreshKnowledgebaseCategories) refreshKnowledgebaseCategories();
        } catch (error) { console.error('Error adding kb category:', error); }
    };
    const deleteKnowledgebaseCategory = async (id) => {
        try {
            await contentService.deleteKnowledgebaseCategory(id);
            if (refreshKnowledgebaseCategories) refreshKnowledgebaseCategories();
        } catch (error) { console.error('Error deleting kb category:', error); }
    };
    const updateKnowledgebaseCategory = async (id, updatedData) => {
        try {
            await contentService.updateKnowledgebaseCategory(id, updatedData);
            if (refreshKnowledgebaseCategories) refreshKnowledgebaseCategories();
        } catch (error) { console.error('Error updating kb category:', error); }
    };

    // Banners
    const [banners, setBanners] = useState([]);
    const refreshBanners = useCallback(async () => {
        try {
            const response = await bannerService.getBanners();
            const data = response.data;
            if (data.success) setBanners(data.data);
        } catch (error) { console.error('Error fetching banners:', error); setBanners([]); }
    }, []);
    useEffect(() => { refreshBanners(); }, [refreshBanners]);
    const addBanner = async (banner) => {
        try {
            const response = await bannerService.createBanner(banner);
            const data = response.data;
            if (data.success) { setBanners([...banners, data.data]); if (refreshBanners) refreshBanners(); }
        } catch (error) { console.error('Error adding banner:', error); }
    };
    const deleteBanner = async (id) => {
        try {
            await bannerService.deleteBanner(id);
            setBanners(banners.filter(b => b.id !== id)); if (refreshBanners) refreshBanners();
        } catch (error) { console.error('Error deleting banner:', error); }
    };
    const updateBanner = async (id, updatedData) => {
        try {
            const response = await bannerService.updateBanner(id, updatedData);
            const data = response.data;
            if (data.success) { setBanners(banners.map(b => (b.id === id || b.id === id) ? data.data : b)); if (refreshBanners) refreshBanners(); }
        } catch (error) { console.error('Error updating banner:', error); }
    };

    // Gaushala Organizations
    const [gaushalas, setGaushalas] = useState([]);
    const [cows, setCows] = useState([]);

    useEffect(() => {
        const fetchGaushalas = async () => {
            try {
                const response = await contentService.getGaushalas();
                const data = response.data;
                if (data.success) setGaushalas(data.data);
            } catch (error) { console.error('Error fetching gaushalas:', error); setGaushalas([]); }
        };
        fetchGaushalas();
    }, []);

    useEffect(() => {
        const fetchCowsApi = async () => {
            try {
                const response = await api.get('/cows');
                const data = response.data;
                if (data.success) setCows(data.data);
            } catch (error) { console.error('Error fetching cows:', error); setCows([]); }
        };
        fetchCowsApi();
    }, []);

    const addGaushalas = async (org) => {
        try {
            const response = await api.post('/gaushalas', org);
            const data = response.data;
            if (data.success) setGaushalas([...gaushalas, data.data]);
        } catch (error) { console.error('Error adding gaushala:', error); }
    };
    const deleteGaushalas = async (id) => {
        try {
            await api.delete(`/gaushalas/${id}`);
            setGaushalas(gaushalas.filter(g => (g.id !== id && g.id !== id)));
        } catch (error) { console.error('Error deleting gaushala:', error); }
    };
    const updateGaushalas = async (id, updatedData) => {
        try {
            const response = await api.put(`/gaushalas/${id}`, updatedData);
            const data = response.data;
            if (data.success) setGaushalas(gaushalas.map(g => (g.id === id || g.id === id) ? data.data : g));
        } catch (error) { console.error('Error updating gaushala:', error); }
    };

    // Cow Management Functions
    const fetchCows = async () => {
        try {
            const response = await api.get('/cows');
            const result = response.data;
            if (result.success) setCows(result.data);
        } catch (error) { console.error('Error fetching cows:', error); }
    };
    const addCow = async (cow) => {
        try {
            const response = await api.post('/cows', cow);
            const data = response.data;
            if (data.success) { setCows([...cows, data.data]); return { success: true, data: data.data }; }
            return { success: false, message: data.message };
        } catch (error) { console.error('Error adding cow:', error); return { success: false, message: 'Error adding cow' }; }
    };
    const deleteCow = async (id) => {
        try {
            const response = await api.delete(`/cows/${id}`);
            const data = response.data;
            if (data.success) { setCows(cows.filter(c => c.id !== id)); return { success: true }; }
            return { success: false, message: data.message };
        } catch (error) { console.error('Error deleting cow:', error); return { success: false, message: 'Error deleting cow' }; }
    };
    const updateCow = async (id, updatedData) => {
        try {
            const response = await api.put(`/cows/${id}`, updatedData);
            const data = response.data;
            if (data.success) { setCows(cows.map(c => (c.id === id || c.id === id) ? data.data : c)); return { success: true, data: data.data }; }
            return { success: false, message: data.message };
        } catch (error) { console.error('Error updating cow:', error); return { success: false, message: 'Error updating cow' }; }
    };
    const adoptCow = async (id) => {
        try {
            const response = await api.post(`/cows/${id}/adopt`);
            const data = response.data;
            if (data.success) { setCows(cows.map(c => (c.id === id || c.id === id) ? data.data : c)); return { success: true, message: data.message }; }
            return { success: false, message: data.message };
        } catch (error) { console.error('Error adopting cow:', error); return { success: false, message: 'Error adopting cow' }; }
    };

    // Questions & Surveys
    // Questions & Surveys
    const addQuestion = async (question) => {
        try {
            const response = await api.post('/questions', question);
            const result = response.data;
            if (response.status === 200 || response.status === 201) { if (refreshQuestions) refreshQuestions(); }
            return result;
        } catch (err) { console.error(err); }
    };
    const deleteQuestion = async (id) => {
        try {
            await api.delete(`/questions/${id}`);
            if (refreshQuestions) refreshQuestions();
        } catch (err) { console.error(err); }
    };
    const updateQuestion = async (id, updatedData) => {
        try {
            await api.put(`/questions/${id}`, updatedData);
            if (refreshQuestions) refreshQuestions();
        } catch (err) { console.error(err); }
    };
    const addQuizQuestion = (question) => setQuizQuestions([...quizQuestions, { ...question, id: Date.now() }]);
    const deleteQuizQuestion = (id) => setQuizQuestions(quizQuestions.filter(q => q.id !== id));
    const updateQuizQuestion = (id, updatedData) => setQuizQuestions(quizQuestions.map(q => q.id === id ? { ...q, ...updatedData } : q));
    const addExamQuestion = (question) => setExamQuestions([...examQuestions, { ...question, id: Date.now() }]);
    const deleteExamQuestion = (id) => setExamQuestions(examQuestions.filter(q => q.id !== id));
    const updateExamQuestion = (id, updatedData) => setExamQuestions(examQuestions.map(q => q.id === id ? { ...q, ...updatedData } : q));

    // Question Banks (PDFs)
    const addQuestionBank = async (bank) => {
        try {
            const response = await api.post('/question-banks', bank);
            const data = response.data;
            if (data.success) { setQuestionBanks([data.data, ...questionBanks]); if (refreshQuestionBanks) refreshQuestionBanks(); }
            return data;
        } catch (error) { console.error('Error adding question bank:', error); }
    };
    const deleteQuestionBank = async (id) => {
        try {
            await api.delete(`/question-banks/${id}`);
            if (refreshQuestionBanks) refreshQuestionBanks();
        } catch (error) { console.error('Error deleting question bank:', error); }
    };
    const updateQuestionBank = async (id, updatedData) => {
        try {
            await api.put(`/question-banks/${id}`, updatedData);
            if (refreshQuestionBanks) refreshQuestionBanks();
        } catch (error) { console.error('Error updating question bank:', error); }
    };

    // Analytics & Engagement
    const trackEngagement = async (module, id, action, platform = null) => {
        // Defensive null checks to prevent TypeError
        if (!module || !id || !action) {
            console.warn('trackEngagement called with invalid parameters:', { module, id, action });
            return { success: false, error: 'Invalid parameters' };
        }

        try {
            const body = platform ? { platform } : null;
            const response = await api.post(`/analytics/${module}/${id}/${action}`, body);
            return response.data;
        } catch (error) {
            console.error(`Error tracking ${action} for ${module}:`, error);
            // Return graceful failure instead of undefined
            return { success: false, error: error.message };
        }
    };

    const getModuleAnalytics = async (module) => {
        try {
            const response = await api.get(`/analytics/${module}/overview`);
            const data = response.data;
            return data.success ? data.data : null;
        } catch (error) { console.error(`Error fetching analytics for ${module}:`, error); }
    };

    const getTrendingContent = async (module, limit = 10) => {
        try {
            const response = await api.get(`/analytics/${module}/trending`, { params: { limit } });
            const data = response.data;
            return data.success ? data.data : [];
        } catch (error) { console.error(`Error fetching trending for ${module}:`, error); }
    };

    // Results
    const submitResult = (result) => setResults([...results, { ...result, id: Date.now(), date: new Date().toISOString() }]);
    const deleteResult = (id) => setResults(results.filter(r => r.id !== id));

    // Users (Backend Connected)
    const addUser = async (user) => {
        try {
            const response = await api.post('/users', user);
            const data = response.data;
            if (data.success) { setUsers([...users, data.data]); return { success: true, data: data.data }; }
            return { success: false, error: data.message };
        } catch (error) { console.error('Error adding user:', error); return { success: false, error: error.message }; }
    };
    const deleteUser = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id)); return { success: true };
        } catch (error) { console.error('Error deleting user:', error); return { success: false, error: error.message }; }
    };
    const updateUser = async (id, updatedData) => {
        try {
            const response = await api.put(`/users/${id}`, updatedData);
            const data = response.data;
            if (response.status === 200) { setUsers(users.map(u => (u.id === id || u.id === id) ? data : u)); return { success: true, data }; }
        } catch (error) { console.error('Error updating user:', error); return { success: false, error: error.message }; }
    };
    const toggleUserStatus = async (id) => {
        const user = users.find(u => u.id === id || u.id === id);
        if (user) { const newStatus = user.status === 'active' ? 'inactive' : 'active'; return await updateUser(id, { status: newStatus }); }
    };

    // Contact Messages
    const addContactMessage = (message) => setContactMessages([...contactMessages, { ...message, id: Date.now(), date: new Date().toISOString(), status: 'unread' }]);
    const deleteContactMessage = (id) => setContactMessages(contactMessages.filter(m => m.id !== id));
    const updateContactMessage = (id, updatedData) => setContactMessages(contactMessages.map(m => m.id === id ? { ...m, ...updatedData } : m));
    const markMessageAsRead = (id) => setContactMessages(contactMessages.map(m => m.id === id ? { ...m, status: 'read' } : m));

    // Home Sliders
    const addHomeSlider = (slider) => setHomeSliders([...homeSliders, { ...slider, id: Date.now() }]);
    const deleteHomeSlider = (id) => setHomeSliders(homeSliders.filter(s => s.id !== id));
    const updateHomeSlider = (id, updatedData) => setHomeSliders(homeSliders.map(s => s.id === id ? { ...s, ...updatedData } : s));

    // Advertisements
    // Advertisements (API version defined above)
    // const addAdvertisement = (ad) => setAdvertisements([...advertisements, { ...ad, id: Date.now(), views: 0, clicks: 0, status: 'pending' }]);
    const deleteAdvertisement = (id) => setAdvertisements(advertisements.filter(a => a.id !== id));
    const updateAdvertisement = (id, updatedData) => setAdvertisements(advertisements.map(a => a.id === id ? { ...a, ...updatedData } : a));

    // Filtered Data Getters (Row-Level Security)
    const getFilteredData = (data, allowedRoles = []) => {
        if (!currentUser) return [];

        // Super Admin and Admin see everything
        if (['admin', 'super_admin'].includes(currentUser.role)) {
            return data;
        }

        // If user's role is in allowed roles, show only their entries
        if (allowedRoles.includes(currentUser.role)) {
            return data.filter(item => item.createdBy === currentUser.uid);
        }

        // Default: no access
        return [];
    };

    // Filtered data for each type
    const filteredCourses = getFilteredData(courses, ['instructor']);
    const filteredExams = getFilteredData(exams, ['instructor']);
    const filteredQuizzes = getFilteredData(quizzes, ['instructor']);
    const filteredProducts = getFilteredData(products, ['vendor', 'gaushala_owner']);
    const filteredMusic = getFilteredData(music, ['artist']);
    const filteredPodcasts = getFilteredData(podcasts, ['artist']);
    const filteredMeditation = getFilteredData(meditation, ['instructor']);
    const filteredNews = getFilteredData(news, ['admin', 'instructor']);
    const filteredKnowledgebase = getFilteredData(knowledgebase, ['admin', 'instructor']);
    const filteredOrders = currentUser?.role === 'vendor' || currentUser?.role === 'gaushala_owner'
        ? orders.filter(order => order.items?.some(item => item.createdBy === currentUser.uid))
        : orders;

    const value = {
        // Courses
        courses, setCourses, addCourse, deleteCourse, updateCourse, refreshCourses,
        courseCategories, setCourseCategories, addCourseCategory, deleteCourseCategory, updateCourseCategory,
        // Exams
        exams, setExams, addExam, deleteExam, updateExam, refreshExams,
        examCategories, setExamCategories, addExamCategory, deleteExamCategory, updateExamCategory,
        // Quizzes
        quizzes, setQuizzes, addQuiz, deleteQuiz, updateQuiz, refreshQuizzes,
        quizCategories, setQuizCategories, addQuizCategory, deleteQuizCategory, updateQuizCategory,
        // Questions
        questions, setQuestions, addQuestion, deleteQuestion, updateQuestion,
        quizQuestions, setQuizQuestions, addQuizQuestion, deleteQuizQuestion, updateQuizQuestion,
        examQuestions, setExamQuestions, addExamQuestion, deleteExamQuestion, updateExamQuestion,
        questionBanks, setQuestionBanks, addQuestionBank, deleteQuestionBank, updateQuestionBank,
        // Products
        products, setProducts, addProduct, deleteProduct, updateProduct, refreshProducts,
        productCategories, setProductCategories, addProductCategory, deleteProductCategory, updateProductCategory,
        // Users
        users, setUsers, addUser, deleteUser, updateUser, toggleUserStatus, refreshUsers,
        roles, setRoles, refreshRoles,
        // Settings
        settings, setSettings, updateSettings, refreshSettings,
        // Banners
        banners, setBanners, refreshBanners, addBanner, deleteBanner, updateBanner,
        // Music
        music, setMusic, addMusic, deleteMusic, updateMusic, refreshMusic,
        musicAlbums, setMusicAlbums, addMusicAlbums: addMusicAlbum, deleteMusicAlbum, updateMusicAlbum, // minor fix: addMusicAlbums key
        musicGenres, setMusicGenres, addMusicGenre, deleteMusicGenre, updateMusicGenre,
        musicMoods, setMusicMoods, addMusicMood, deleteMusicMood, updateMusicMood,
        // Podcasts
        podcasts, setPodcasts, addPodcast, deletePodcast, updatePodcast, refreshPodcasts,
        podcastSeries, setPodcastSeries, addPodcastSeries, deletePodcastSeries, updatePodcastSeries,
        podcastCategories, setPodcastCategories, addPodcastCategory, deletePodcastCategory, updatePodcastCategory,
        // Meditation
        meditation, setMeditation, addMeditation, deleteMeditation, updateMeditation, refreshMeditation,
        // News
        news, setNews, addNews, deleteNews, updateNews, refreshNews,
        newsCategories, setNewsCategories, addNewsCategory, deleteNewsCategory, updateNewsCategory,
        // Knowledgebase
        knowledgebase, setKnowledgebase, addKnowledgebase, deleteKnowledgebase, updateKnowledgebase, refreshKnowledgebase,
        knowledgebaseCategories, setKnowledgebaseCategories, addKnowledgebaseCategory, deleteKnowledgebaseCategory, updateKnowledgebaseCategory,
        // Gaushalas
        gaushalas, setGaushalas, addGaushalas, deleteGaushalas, updateGaushalas,
        // Cows
        cows, setCows, fetchCows, addCow, deleteCow, updateCow, adoptCow,
        // Results
        trackEngagement, getModuleAnalytics, getTrendingContent,
        results, submitResult, deleteResult,
        contactMessages, addContactMessage, deleteContactMessage, updateContactMessage, markMessageAsRead,
        // Home Sliders
        homeSliders, setHomeSliders, addHomeSlider, deleteHomeSlider, updateHomeSlider,
        // Advertisements
        advertisements, setAdvertisements, addAdvertisement, deleteAdvertisement, updateAdvertisement,
        // Orders
        orders, setOrders, refreshOrders,
        // Filtered Data (Row-Level Security)
        filteredCourses,
        filteredExams,
        filteredQuizzes,
        filteredProducts,
        filteredMusic,
        filteredPodcasts,
        filteredMeditation,
        filteredNews,
        filteredKnowledgebase,
        filteredOrders
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
// Force rebuild
