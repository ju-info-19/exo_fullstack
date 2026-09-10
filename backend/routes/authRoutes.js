const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { connectToDatabase } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// POST /api/register - Register a new user
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const { email, password, firstName, lastName } = req.body;

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, password: hashedPassword, firstName, lastName, createdAt: new Date() };
        const result = await collection.insertOne(newUser);

        const payload = { user: { id: result.insertedId } };
        const token = jwt.sign(payload, JWT_SECRET);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { email, firstName, lastName }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/login - Login user
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const { email, password } = req.body;

        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = { user: { id: user._id } };
        const token = jwt.sign(payload, JWT_SECRET);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { email: user.email, firstName: user.firstName, lastName: user.lastName }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// PUT /api/users/:id - Update user info
router.put('/users/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const { ObjectId } = require('mongodb');
        const { firstName, lastName, email } = req.body;

        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { firstName, lastName, email } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;
