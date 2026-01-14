const music = [
    {
        title: 'Om Namah Shivaya',
        artist: 'Pandit Hariprasad',
        album: 'Divine Chants',
        genre: 'Mantra',
        mood: 'Meditative',
        audioUrl: 'https://example.com/audio/om-namah-shivaya.mp3',
        coverArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76',
        duration: '5:30',
        status: 'approved',
        playCount: 1250,
        likes: 340,
        rating: 4.7,
        language: 'Sanskrit'
    },
    {
        title: 'Gayatri Mantra',
        artist: 'Pandit Hariprasad',
        album: 'Vedic Mantras',
        genre: 'Vedic Chants',
        mood: 'Devotional',
        audioUrl: 'https://example.com/audio/gayatri-mantra.mp3',
        coverArt: 'https://images.unsplash.com/photo-1514496959998-c01c40915c5f',
        duration: '7:15',
        status: 'approved',
        playCount: 2100,
        likes: 580,
        rating: 4.9,
        language: 'Sanskrit'
    },
    {
        title: 'Morning Raga',
        artist: 'Ustad Zakir',
        album: 'Sunrise Melodies',
        genre: 'Classical',
        mood: 'Peaceful',
        audioUrl: 'https://example.com/audio/morning-raga.mp3',
        coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
        duration: '12:00',
        status: 'approved',
        playCount: 890,
        likes: 120,
        rating: 4.5,
        language: 'Instrumental'
    },
    {
        title: 'Krishna Flute',
        artist: 'Divine Sounds',
        album: 'Krishna Leela',
        genre: 'Instrumental',
        mood: 'Relaxing',
        audioUrl: 'https://example.com/audio/krishna-flute.mp3',
        coverArt: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
        duration: '8:45',
        status: 'approved',
        playCount: 3400,
        likes: 900,
        rating: 4.8,
        language: 'Instrumental'
    },
    {
        title: 'Hanuman Chalisa',
        artist: 'Hari Om Sharan',
        album: 'Bhakti Sangrah',
        genre: 'Bhajan',
        mood: 'Devotional',
        audioUrl: 'https://example.com/audio/hanuman-chalisa.mp3',
        coverArt: 'https://images.unsplash.com/photo-1564344197-06c6e7683668',
        duration: '9:30',
        status: 'approved',
        playCount: 5600,
        likes: 1500,
        rating: 5.0,
        language: 'Hindi'
    }
];

// Generate more tracks to reach 50+
const genres = ['Bhajan', 'Mantra', 'Kirtan', 'Devotional', 'Classical', 'Instrumental', 'Vedic Chants'];
const moods = ['Peaceful', 'Energetic', 'Meditative', 'Devotional', 'Uplifting', 'Relaxing'];
const artists = ['Pandit Hariprasad', 'Ustad Zakir', 'Divine Sounds', 'Hari Om Sharan', 'Kaushiki Chakraborty', 'Ravi Shankar', 'Anoushka Shankar'];

for (let i = 6; i <= 55; i++) {
    music.push({
        title: `Track ${i} - Divine Melody`,
        artist: artists[Math.floor(Math.random() * artists.length)],
        album: `Album Vol ${Math.floor(i / 5) + 1}`,
        genre: genres[Math.floor(Math.random() * genres.length)],
        mood: moods[Math.floor(Math.random() * moods.length)],
        audioUrl: `https://example.com/audio/track-${i}.mp3`,
        coverArt: `https://images.unsplash.com/photo-${1500000000000 + i}`,
        duration: `${Math.floor(Math.random() * 10) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        status: Math.random() > 0.2 ? 'approved' : 'pending',
        playCount: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 500),
        rating: (Math.random() * 2 + 3).toFixed(1),
        language: Math.random() > 0.5 ? 'Hindi' : 'Sanskrit'
    });
}

module.exports = music;
