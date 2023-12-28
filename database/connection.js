const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('postgres', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: true,
});





// Test the database connection
async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Export the Sequelize instance and function to test the connection
module.exports = { sequelize, testDBConnection };
