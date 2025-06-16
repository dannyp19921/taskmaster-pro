// backend/index.js 

const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 

// Load in environmental variables from .evn 
dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 3000; 

// Middleware 
app.use(cors()); 
app.use(express.json()); 

// Test-endpoint 
app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Start server 
app.listen(PORT, () => {
    console.log('Server running on http://localhost:${PORT}'); 
})

/**
 * Doing this we have: 
 * 
 * - Made 'index.js' with Express-setup 
 * - The possibility of running the server with 'node index.js' 
 * - An API that responds correct with '/api/ping' 
 * - '.env' is supported via 'dotenv' 
 * 
 * This confirms that we have a working 
 * 
 * - Node.js-environment in WSL2 (terminal of choice)
 * - A backend-server 
 * - An API-endpoint 
 * - Environment configuration 
 */
