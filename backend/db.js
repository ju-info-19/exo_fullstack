const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        return client.db('giftdb');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

module.exports = { connectToDatabase, client };
