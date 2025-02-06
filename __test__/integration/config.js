const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();
// Load the SQL reset file
const resetSQL = fs.readFileSync(__dirname + '/reset.sql').toString();

// Function to reset the test database
const resetTestDB = async () => {
  try {
    // Initialize a new Pool instance for the test database connection
    const db = new Pool({
      connectionString: process.env.DB_TEST_URL,
    });
    // Execute the reset SQL file
    await db.query(resetSQL);

    // Close the connection pool
    await db.end();

    console.log('Test DB reset successfully');
  } catch (err) {
    console.error('Could not reset TestDB:', err);
    throw err; // Rethrow the error to handle it in the calling function
  }
};

resetTestDB()

module.exports = { resetTestDB };