const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  orderItems: {
    type: DataTypes.JSON, // Array of { product: id, name, qty, price, image }
    defaultValue: []
  },
  shippingAddress: {
    type: DataTypes.JSON, // { address, city, postalCode, country }
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  billingAddress: {
    type: DataTypes.JSON, // { address, city, postalCode, country, gst }
    allowNull: true
  },
  paymentResult: {
    type: DataTypes.JSON // { id, status, update_time, email_address }
  },
  itemsPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paidAt: DataTypes.DATE,
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deliveredAt: DataTypes.DATE,
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  // Invoice Details
  invoiceNumber: DataTypes.STRING, // e.g., INV-2025-001
  invoiceDate: DataTypes.DATE,
  sellerSnapshot: {
    type: DataTypes.JSON, // Captures seller Name, Address, GST at time of order
    defaultValue: {}
  },
  vendorId: {
    type: DataTypes.INTEGER, // Optional single vendor
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });

module.exports = Order;