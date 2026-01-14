const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // One cart per user
    references: {
      model: User,
      key: 'id'
    }
  },
  items: {
    type: DataTypes.JSON, // Array of { product: id, quantity, price }
    defaultValue: []
  }
}, {
  timestamps: true
});

// Association
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Cart;