const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');
const slugify = require('../../shared/utils/slugGenerator');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please add a product name' }
        }
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Puja Items', 'Books', 'Ayurvedic Products', 'Organic Food', 'Clothing', 'Handicrafts', 'Cow Products', 'Other'),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    originalPrice: {
        type: DataTypes.DECIMAL(10, 2)
    },
    discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    images: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    vendorId: { // Renamed from 'vendor' to 'vendorId' to avoid collision with association
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    vendorName: DataTypes.STRING,
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    sku: {
        type: DataTypes.STRING,
        unique: true
    },
    weight: DataTypes.STRING,
    dimensions: {
        type: DataTypes.JSON, // { length, width, height, unit }
        defaultValue: {}
    },
    reviews: {
        type: DataTypes.JSON, // Array of review objects { user, rating, comment, date }
        defaultValue: []
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    soldCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'out_of_stock', 'pending_approval'),
        defaultValue: 'pending_approval'
    },
    tags: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    variants: {
        type: DataTypes.JSON, // Array of objects
        defaultValue: []
    },
    specifications: {
        type: DataTypes.JSON, // Array of objects
        defaultValue: []
    },
    shippingInfo: {
        type: DataTypes.JSON, // Object
        defaultValue: {}
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    revenue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    cartAdds: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    wishlistAdds: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['status', 'category', 'price'] },
        { fields: ['vendorId'] }
    ],
    hooks: {
        beforeSave: (product) => {
            if (product.changed('name')) {
                product.slug = slugify(product.name);
            }
            // Rating calc is skipped for now - complex to do in hook without querying JSON
        }
    }
});

// Association
Product.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });

module.exports = Product;
