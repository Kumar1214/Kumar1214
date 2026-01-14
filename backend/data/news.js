const news = [
    {
        title: 'Ancient Ayurvedic Practices Gain Modern Recognition',
        excerpt: 'Traditional Ayurvedic treatments are being validated by modern scientific research',
        content: '<p>Recent studies have shown the effectiveness of traditional Ayurvedic practices...</p>',
        category: 'Ayurveda',
        featuredImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528',
        author: 'Admin User',
        tags: ['ayurveda', 'health', 'research'],
        status: 'published',
        views: 3200,
        likes: 180
    },
    {
        title: 'International Yoga Day Celebrations',
        excerpt: 'Millions join together to celebrate the gift of Yoga',
        content: '<p>From New Delhi to New York, the world united in breath and movement...</p>',
        category: 'Yoga',
        featuredImage: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0',
        author: 'Priya Desai',
        tags: ['yoga', 'events', 'global'],
        status: 'published',
        views: 5400,
        likes: 420
    },
    {
        title: 'New Gaushala Opens in Vrindavan',
        excerpt: 'A state-of-the-art facility for cow protection and care',
        content: '<p>The new facility will house over 500 cows and provide organic fodder...</p>',
        category: 'Gaushala',
        featuredImage: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e',
        author: 'Gaushala Admin',
        tags: ['gaushala', 'cow protection', 'vrindavan'],
        status: 'published',
        views: 2100,
        likes: 350
    }
];

// Generate more news to reach 30+
const categories = ['Spiritual', 'Cultural', 'Ayurveda', 'Yoga', 'Environment', 'Gaushala', 'Events', 'Community'];
const authors = ['Admin User', 'Priya Desai', 'Dr. Rajesh Sharma', 'Swami Anand'];

for (let i = 4; i <= 35; i++) {
    news.push({
        title: `News Update ${i}: Important Developments`,
        excerpt: 'Breaking news and updates from the world of spirituality and wellness.',
        content: `<p>This is the content for news article ${i}. It discusses important topics relevant to our community.</p>`,
        category: categories[Math.floor(Math.random() * categories.length)],
        featuredImage: `https://images.unsplash.com/photo-${1500000000000 + i}`,
        author: authors[Math.floor(Math.random() * authors.length)],
        tags: ['news', 'update', 'community'],
        status: Math.random() > 0.2 ? 'published' : 'pending',
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 500)
    });
}

module.exports = news;
