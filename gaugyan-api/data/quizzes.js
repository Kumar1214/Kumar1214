const quizzes = [
    {
        title: 'Quick Yoga Quiz',
        description: 'Test your basic yoga knowledge',
        category: 'Yoga',
        difficulty: 'Easy',
        questions: [
            {
                question: 'What does "Namaste" mean?',
                options: ['Hello', 'I bow to you', 'Goodbye', 'Thank you'],
                correctAnswer: 1,
                explanation: 'Namaste means "I bow to the divine in you"',
                points: 10
            }
        ],
        timeLimit: 5,
        totalPoints: 10,
        passingScore: 60,
        allowRetake: true,
        showCorrectAnswers: true,
        isPublished: true
    },
    {
        title: 'Vedic Math Challenge',
        description: 'Speed calculation challenge',
        category: 'Vedic Mathematics',
        difficulty: 'Medium',
        questions: [
            {
                question: 'What is the base for "Nikhilam" method?',
                options: ['10', '100', '1000', 'All of the above'],
                correctAnswer: 3,
                explanation: 'Nikhilam method uses powers of 10 as base.',
                points: 10
            }
        ],
        timeLimit: 10,
        totalPoints: 10,
        passingScore: 50,
        allowRetake: true,
        showCorrectAnswers: true,
        isPublished: true
    }
];

module.exports = quizzes;
