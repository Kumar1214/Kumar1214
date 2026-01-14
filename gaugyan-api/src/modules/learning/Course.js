const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');
const slugify = require('../../shared/utils/slugGenerator');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    category: {
        type: DataTypes.ENUM('Ayurveda', 'Yoga', 'Vedic Studies', 'Language', 'Spirituality', 'Agriculture', 'Web Development', 'Business', 'Yoga & Meditation'),
        allowNull: false
    },
    level: {
        type: DataTypes.ENUM('All Levels', 'Beginner', 'Intermediate', 'Advanced'),
        defaultValue: 'All Levels'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    originalPrice: DataTypes.DECIMAL(10, 2),
    endDate: DataTypes.DATE,
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: 'no-photo.jpg'
    },
    youtubeUrl: DataTypes.STRING,
    syllabus: {
        type: DataTypes.JSON, // Array of chapters { title, content, videoUrl... }
        defaultValue: []
    },
    includes: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    whatLearns: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    reviews: {
        type: DataTypes.JSON, // Array of review objects
        defaultValue: []
    },
    chapters: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    faqs: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    questions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    students: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    randomizeOptions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    studyMaterial: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    completions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    revenue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    bookmarkedBy: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: (course) => {
            if (course.changed('title')) {
                course.slug = slugify(course.title);
            }
        }
    }
});

Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

module.exports = Course;
