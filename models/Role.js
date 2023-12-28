const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection').sequelize;

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(64),
    unique: true,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});


Role.sync({ force: false })
  .then(() => {
    console.log('Users table synced');
  })
  .catch(error => {
    console.error('Error syncing Users table:', error);
  });

module.exports = Role;
