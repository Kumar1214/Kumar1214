const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Please add a valid email' },
            notEmpty: { msg: 'Please add an email' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: { args: [8, 100], msg: 'Password must be at least 8 characters' },
            isStrong(value) {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
                if (!regex.test(value)) {
                    throw new Error('Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special char');
                }
            }
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'instructor', 'admin', 'gaushala_owner', 'artist', 'vendor', 'author', 'astrologer'),
        defaultValue: 'user'
    },
    mobile: DataTypes.STRING,
    detail: DataTypes.TEXT,
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // address: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.STRING,
    // ID Fields for India Compliance
    gstNumber: DataTypes.STRING,
    panNumber: DataTypes.STRING,
    shopName: DataTypes.STRING, // Trade Name
    shopAddress: DataTypes.TEXT, // Registered Business Address
    profilePicture: DataTypes.STRING,
    facebookUrl: DataTypes.STRING,
    youtubeUrl: DataTypes.STRING,
    twitterUrl: DataTypes.STRING,
    linkedinUrl: DataTypes.STRING,
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpire: DataTypes.DATE,
    walletBalance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    coinBalance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // Storing wishlist as JSON array of IDs for now to simplify migration
    // A separate join table is better for relational integrity but adds complexity
    wishlist: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    joinedCommunities: {
        type: DataTypes.JSON,
        defaultValue: [] // Array of category strings e.g. ['General', 'Music']
    },
    billingAddress: {
        type: DataTypes.JSON, // { address, city, state, postalCode, country, gst }
        defaultValue: {}
    },
    enrolledCourses: {
        type: DataTypes.JSON,
        defaultValue: [] // Structure: [{ courseId: 1, progress: 0, completedLectures: [] }]
    }
}, {
    timestamps: true, // creates createdAt, updatedAt
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance method to match password
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
