// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path'); 

const app = express();

// 🚀 CRITICAL CHANGE FOR DEPLOYMENT: 
// Use the PORT provided by the hosting environment (Render), or default to 3001 locally.
const port = process.env.PORT || 3001; 

// --- CONFIGURATION ---
const MONGO_URI = process.env.MONGO_URI;

let db;
let waterLogsCollection;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); 

// Serve all static files (good for local testing)
app.use(express.static(path.join(__dirname)));

// Explicitly handle the root path ("/") to guarantee index.html loads.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- DATABASE CONNECTION ---
async function connectDB() {
    if (!MONGO_URI) {
        console.error('FATAL ERROR: MONGO_URI is not defined. Please check your .env file.');
        process.exit(1);
    }
    
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db('waterwise_db');
        waterLogsCollection = db.collection('logs');
        console.log(' Connected successfully to MongoDB');
    } catch (err) {
        console.error(' Could not connect to MongoDB. CHECK YOUR URI AND NETWORK ACCESS:', err.message);
        process.exit(1);
    }
}

// --- API ROUTES (Authentication Removed) ---

// 1. GET /api/summary - Retrieves ALL logs
app.get('/api/summary', async (req, res) => {
    try {
        const logs = await waterLogsCollection.find({}).sort({ timestamp: -1 }).toArray(); 
        
        res.json({ success: true, logs: logs }); 
        
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch logs.' }); 
    }
});

// 2. POST /api/log - Saves a new water usage entry (without user ID)
app.post('/api/log', async (req, res) => {
    const { date, volume } = req.body;
    
    if (!date || !volume || volume <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid date or volume.' });
    }

    try {
        const newLog = {
            date: date,
            volume: parseFloat(volume),
            timestamp: new Date()
        };

        const result = await waterLogsCollection.insertOne(newLog);
        
        res.json({ success: true, message: 'Log recorded', id: result.insertedId });

    } catch (error) {
        console.error("Error inserting log:", error);
        res.status(500).json({ success: false, message: 'Failed to record usage.' });
    }
});


// --- SERVER STARTUP ---
connectDB().then(() => {
    app.listen(port, () => {
        // Now logs the correct port, whether local or deployed
        console.log(`Server running at http://localhost:${port}`);
    });
});
