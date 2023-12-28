const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection').sequelize;
const User = require('./Users');

const Community = sequelize.define('Community', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
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

Community.belongsTo(User, { foreignKey: 'owner', as: 'Owner' });

Community.sync({ force: false })
  .then(() => {
    console.log('Users table synced');
    // Now proceed with starting your app or other operations
  })
  .catch(error => {
    console.error('Error syncing Users table:', error);
  });

module.exports = Community;
