const exams = [
    {
        title: 'Ayurveda Fundamentals - Final Exam',
        description: 'Test your knowledge of basic Ayurvedic principles',
        category: 'Ayurveda',
        level: 'Beginner',
        questions: [
            {
                question: 'What are the three doshas in Ayurveda?',
                options: ['Vata, Pitta, Kapha', 'Fire, Water, Earth', 'Mind, Body, Soul', 'Hot, Cold, Neutral'],
                correctAnswer: 0,
                explanation: 'The three doshas are Vata, Pitta, and Kapha',
                marks: 2
            },
            {
                question: 'Which dosha is associated with the fire element?',
                options: ['Vata', 'Pitta', 'Kapha', 'None'],
                correctAnswer: 1,
                explanation: 'Pitta dosha is associated with fire and water elements',
                marks: 2
            }
        ],
        duration: 30,
        totalMarks: 4,
        passingMarks: 2,
        isActive: true
    },
    {
        title: 'Yoga Philosophy Advanced',
        description: 'Advanced concepts of Yoga Sutras',
        category: 'Yoga',
        level: 'Advanced',
        questions: [
            {
                question: 'Who compiled the Yoga Sutras?',
                options: ['Patanjali', 'Vyasa', 'Kapila', 'Shankaracharya'],
                correctAnswer: 0,
                explanation: 'Sage Patanjali compiled the Yoga Sutras.',
                marks: 5
            }
        ],
        duration: 60,
        totalMarks: 5,
        passingMarks: 3,
        isActive: true
    }
];

module.exports = exams;
