const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db');

// GET /api/search - Search gifts by category or name
router.get('/search', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const query = {};

        // Filter by category
        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: 'i' };
        }

        // Filter by name (partial match)
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        const results = await collection.find(query).toArray();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;
