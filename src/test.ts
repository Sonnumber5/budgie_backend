import pool from './database'; // Import the database connection pool

const testDatabaseConnection = async () => {
    try {
        const client = await pool.connect(); // Get a client from the pool
        console.log('Database connection successful'); // Log success message
        client.release(); // Release the client back to the pool
    } catch (err) {
        console.error('Database connection failed', err); // Log any errors that occur
    } finally {
        await pool.end(); // Close the pool when done
    }
};

testDatabaseConnection(); // Run the test function