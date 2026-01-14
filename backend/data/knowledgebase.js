const knowledgebase = [
    {
        title: 'Benefits of Cow Milk in Ayurveda',
        category: 'Ayurveda',
        description: 'Comprehensive guide to the medicinal properties of cow milk according to Ayurvedic texts',
        content: '<p>Cow milk has been revered in Ayurveda for its numerous health benefits...</p>',
        author: 'Dr. Rajesh Sharma',
        status: 'active',
        views: 1800,
        helpful: 145,
        tags: ['ayurveda', 'nutrition', 'cow products']
    },
    {
        title: 'Understanding the 8 Limbs of Yoga',
        category: 'Yoga',
        description: 'A detailed explanation of Ashtanga Yoga philosophy',
        content: '<p>Patanjali\'s Yoga Sutras describe the eightfold path of yoga...</p>',
        author: 'Priya Desai',
        status: 'active',
        views: 2500,
        helpful: 210,
        tags: ['yoga', 'philosophy', 'patanjali']
    },
    {
        title: 'Vedic Mathematics: Sutras Explained',
        category: 'Vedic Mathematics',
        description: 'Introduction to the 16 sutras of Vedic Math',
        content: '<p>Vedic Mathematics is a system of reasoning and mathematical working...</p>',
        author: 'Acharya Gupta',
        status: 'active',
        views: 1200,
        helpful: 95,
        tags: ['math', 'vedic', 'education']
    }
];

// Generate more articles to reach 20+
const categories = [
    'Podcasts', 'Yoga', 'News', 'Ayurveda', 'Vedic Astrology',
    'Vedic Mathematics', 'Gaushala', 'Organic Farming', 'Gau Seva',
    'Vedic Science', 'Spirituality', 'Sanskrit', 'Other'
];
const authors = ['Dr. Rajesh Sharma', 'Priya Desai', 'Acharya Gupta', 'Swami Anand'];

for (let i = 4; i <= 25; i++) {
    knowledgebase.push({
        title: `Knowledge Article ${i}: Deep Dive`,
        category: categories[Math.floor(Math.random() * categories.length)],
        description: 'An in-depth look at this important topic.',
        content: `<p>Detailed content for article ${i} goes here. It covers various aspects of the subject.</p>`,
        author: authors[Math.floor(Math.random() * authors.length)],
        status: Math.random() > 0.2 ? 'active' : 'pending',
        views: Math.floor(Math.random() * 3000),
        helpful: Math.floor(Math.random() * 300),
        tags: ['education', 'knowledge', 'learning']
    });
}

module.exports = knowledgebase;
