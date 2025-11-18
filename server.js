// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path'); // Required for file paths

const app = express();
// Setting the port to 3001 to avoid common conflicts with 3000
const port = 3001; 

// --- CONFIGURATION ---
const MONGO_URI = process.env.MONGO_URI;

let db;
let waterLogsCollection;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Serve all static files from the current directory (where server.js lives).
app.use(express.static(path.join(__dirname)));

// Explicitly handle the root path ("/") to guarantee index.html loads.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- DATABASE CONNECTION ---
async function connectDB() {
    // 💡 Added check for MONGO_URI
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
        // Since there is no user filtering, this returns all logs from the database.
        const logs = await waterLogsCollection.find({}).sort({ timestamp: -1 }).toArray(); // Added sorting for recent logs first
        
        res.json({ success: true, logs: logs }); 
        
    } catch (error) {
        console.error("Error fetching logs:", error);
        // Added 'success: false' to the error response for clarity
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
            // userId is intentionally omitted as requested (authentication removed)
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
        // ✅ CORRECTED: Using backticks (`) for the template literal
        console.log(`Server running at http://localhost:${port}`);
    });
});