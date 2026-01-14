const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const ProductCategory = sequelize.define('ProductCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    icon: {
        type: DataTypes.STRING, // Store emoji or url
        defaultValue: '📦'
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    tableName: 'product_categories',
    hooks: {
        beforeCreate: (category) => {
            category.slug = category.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
    }
});

module.exports = ProductCategory;
