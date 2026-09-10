const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db');
const { ObjectId } = require('mongodb');

// GET /api/gifts - Get all gifts
router.get('/gifts', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();
        res.status(200).json(gifts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch gifts' });
    }
});

// GET /api/gifts/:id - Get gift by ID
router.get('/gifts/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const gift = await collection.findOne({ _id: new ObjectId(id) });

        if (!gift) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        res.status(200).json(gift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch gift' });
    }
});

// POST /api/gifts - Create a new gift
router.post('/gifts', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const result = await collection.insertOne(req.body);
        res.status(201).json({ id: result.insertedId, ...req.body });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create gift' });
    }
});

module.exports = router;
