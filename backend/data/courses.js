const courses = [
    {
        title: 'Complete Ayurveda Masterclass',
        description: 'Learn the ancient wisdom of Ayurveda from basics to advanced concepts.',
        category: 'Ayurveda',
        level: 'All Levels',
        price: 0,
        image: '/images/ayurveda.jpg',
        isPublished: true,
        syllabus: [
            { title: 'Introduction to Ayurveda', duration: '10:00', isFree: true },
            { title: 'The Three Doshas', duration: '15:00', isFree: false }
        ]
    },
    {
        title: 'Yoga for Beginners',
        description: 'Start your yoga journey with simple and effective poses.',
        category: 'Yoga',
        level: 'Beginner',
        price: 499,
        image: '/images/yoga.jpg',
        isPublished: true,
        syllabus: [
            { title: 'Sun Salutation', duration: '12:00', isFree: true },
            { title: 'Basic Asanas', duration: '20:00', isFree: false }
        ]
    }
];

module.exports = courses;
