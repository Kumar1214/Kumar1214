const meditation = [
    {
        title: 'Morning Pranayama',
        description: 'Start your day with energizing breathing exercises',
        type: 'Breathing',
        difficulty: 'Beginner',
        duration: '15:00',
        audioUrl: 'https://example.com/meditation/morning-pranayama.mp3',
        videoUrl: 'https://youtube.com/watch?v=example',
        instructor: 'Dr. Rajesh Sharma',
        coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        status: 'published',
        playCount: 1500,
        likes: 420,
        rating: 4.8
    },
    {
        title: 'Deep Sleep Nidra',
        description: 'Guided yoga nidra for deep relaxation and sleep',
        type: 'Body Scan',
        difficulty: 'Beginner',
        duration: '30:00',
        audioUrl: 'https://example.com/meditation/sleep-nidra.mp3',
        instructor: 'Priya Desai',
        coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
        status: 'published',
        playCount: 2200,
        likes: 650,
        rating: 4.9
    },
    {
        title: 'Chakra Balancing',
        description: 'Visualize and balance your seven chakras',
        type: 'Visualization',
        difficulty: 'Intermediate',
        duration: '25:00',
        audioUrl: 'https://example.com/meditation/chakra.mp3',
        instructor: 'Swami Anand',
        coverImage: 'https://images.unsplash.com/photo-1545389336-cf090694435e',
        status: 'published',
        playCount: 1100,
        likes: 300,
        rating: 4.7
    }
];

// Generate more sessions to reach 15+
const types = ['Guided', 'Music', 'Breathing', 'Mantra', 'Visualization', 'Body Scan', 'Mindfulness'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const instructors = ['Dr. Rajesh Sharma', 'Priya Desai', 'Swami Anand', 'Guru Mahesh'];

for (let i = 4; i <= 20; i++) {
    meditation.push({
        title: `Meditation Session ${i}`,
        description: 'A calming session to help you find inner peace and clarity.',
        type: types[Math.floor(Math.random() * types.length)],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        duration: `${Math.floor(Math.random() * 20) + 10}:00`,
        audioUrl: `https://example.com/meditation/session-${i}.mp3`,
        instructor: instructors[Math.floor(Math.random() * instructors.length)],
        coverImage: `https://images.unsplash.com/photo-${1500000000000 + i}`,
        status: Math.random() > 0.2 ? 'published' : 'pending',
        playCount: Math.floor(Math.random() * 1500),
        likes: Math.floor(Math.random() * 150),
        rating: (Math.random() * 2 + 3).toFixed(1)
    });
}

module.exports = meditation;
