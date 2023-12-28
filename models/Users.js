// Inside your app initialization or startup file

const { sequelize } = require('../database/connection');
const { DataTypes } = require('sequelize');

// Define the 'Users' model
const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(64),
    defaultValue: null,
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

// Check if the Users table exists in the database
Users.sync({ force: false })
  .then(() => {
    console.log('Users table synced');
    // Now proceed with starting your app or other operations
  })
  .catch(error => {
    console.error('Error syncing Users table:', error);
  });

module.exports = Users;
