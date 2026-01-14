const podcasts = [
    {
        title: 'The Power of Meditation',
        description: 'Exploring the transformative effects of daily meditation practice',
        series: 'Spiritual Wisdom',
        category: 'Spirituality',
        host: 'Dr. Rajesh Sharma',
        audioUrl: 'https://example.com/podcast/meditation-power.mp3',
        coverArt: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
        duration: '45:30',
        episodeNumber: 1,
        season: 1,
        status: 'published',
        playCount: 850,
        likes: 210,
        rating: 4.6
    },
    {
        title: 'Ayurveda for Modern Life',
        description: 'How to apply ancient Ayurvedic principles in today\'s busy world',
        series: 'Ayurveda Today',
        category: 'Ayurveda',
        host: 'Dr. Priya Patel',
        audioUrl: 'https://example.com/podcast/ayurveda-modern.mp3',
        coverArt: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
        duration: '38:15',
        episodeNumber: 1,
        season: 1,
        status: 'published',
        playCount: 1200,
        likes: 350,
        rating: 4.8
    },
    {
        title: 'Understanding Karma',
        description: 'Deep dive into the law of cause and effect',
        series: 'Spiritual Wisdom',
        category: 'Spirituality',
        host: 'Swami Anand',
        audioUrl: 'https://example.com/podcast/karma.mp3',
        coverArt: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5',
        duration: '50:00',
        episodeNumber: 2,
        season: 1,
        status: 'published',
        playCount: 980,
        likes: 280,
        rating: 4.7
    }
];

// Generate more podcasts to reach 20+
const categories = ['Spirituality', 'Vedic Wisdom', 'Ayurveda', 'Yoga Philosophy', 'Life Stories', 'Mythology', 'Culture'];
const hosts = ['Dr. Rajesh Sharma', 'Dr. Priya Patel', 'Swami Anand', 'Guru Mahesh', 'Acharya Gupta'];
const seriesList = ['Spiritual Wisdom', 'Ayurveda Today', 'Yoga Life', 'Vedic Tales', 'Cultural Insights'];

for (let i = 4; i <= 25; i++) {
    podcasts.push({
        title: `Episode ${i}: Wisdom of the Ages`,
        description: 'A fascinating discussion on ancient wisdom and its relevance today.',
        series: seriesList[Math.floor(Math.random() * seriesList.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        host: hosts[Math.floor(Math.random() * hosts.length)],
        audioUrl: `https://example.com/podcast/episode-${i}.mp3`,
        coverArt: `https://images.unsplash.com/photo-${1500000000000 + i}`,
        duration: `${Math.floor(Math.random() * 30) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        episodeNumber: i,
        season: 1,
        status: Math.random() > 0.2 ? 'published' : 'pending',
        playCount: Math.floor(Math.random() * 2000),
        likes: Math.floor(Math.random() * 200),
        rating: (Math.random() * 2 + 3).toFixed(1)
    });
}

module.exports = podcasts;
