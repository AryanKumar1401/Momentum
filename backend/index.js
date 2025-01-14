const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./momentum-87fd3-firebase-adminsdk-pwhhk-9b0fb34367.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/test-db', async (req, res) => {
    try {
        await db.collection('reflections').limit(1).get();
        res.status(200).json({ status: 'Connected to Firestore' });
    } catch (error) {
        res.status(500).json({ error: 'Firestore connection failed' });
    }
});

// Add Reflection
app.post('/api/reflections', async (req, res) => {
    const { userId, date, success, improvement, journal } = req.body;
    try {
        await db.collection('reflections').add({
            userId,
            date: admin.firestore.Timestamp.fromDate(new Date(date)),
            success,
            improvement,
            journal,
        });
        res.status(201).json({ message: 'Reflection added successfully!' });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/api/habits', async (req, res) => {
    const { userId, date, success, improvement, journal } = req.body;
    try {
        await db.collection('habits').add({
            userId,
            date: admin.firestore.Timestamp.fromDate(new Date(date)),
            success,
            improvement,
            journal,
        });
        res.status(201).json({ message: 'Reflection added successfully!' });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get Reflections by User ID
app.get('/api/reflections/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const snapshot = await db
            .collection('reflections')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .get();

        const reflections = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).send(reflections);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Update Reflection
app.put('/api/reflections/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        await db.collection('reflections').doc(id).update(updates);
        res.status(200).send('Reflection updated successfully!');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Delete Reflection
app.delete('/api/reflections/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('reflections').doc(id).delete();
        res.status(200).send('Reflection deleted successfully!');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});