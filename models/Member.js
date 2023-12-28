const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection').sequelize;
const User = require('./Users');
const Community = require('./Community');
const Role = require('./Role');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

Member.belongsTo(User, { foreignKey: 'user', as: 'User' });
Member.belongsTo(Community, { foreignKey: 'community', as: 'Community' });
Member.belongsTo(Role, { foreignKey: 'role', as: 'Role' });

Member.sync({ force: false })
  .then(() => {
    console.log('Users table synced');

  })
  .catch(error => {
    console.error('Error syncing Users table:', error);
  });

module.exports = Member;
