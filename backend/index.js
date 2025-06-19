// index.js 

const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 

// Load in environmental variables from .evn 
dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 3000; 

// Middleware 
app.use(cors({
    origin: 'http://localhost:5173', // Changed to frontend-gate 
    credentials: true 
})); 
app.use(express.json()); 

const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

// Temporary test-user (can be supplanted with a database later on)
const testUser = {
    id: 1,
    email: 'test@example.com',
    passwordHash: bcrypt.hashSync('passord123', 10), // Using bcrypt for hashing 
}; 

// POST /api/login 
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; 

    // Find user (hardcoded in this case)
    if (email !== testUser.email) {
        return res.status(401).json({ message: 'Ugyldig e-post eller passord' });
    }

    // Check password 
    const isValid = await bcrypt.compare(password, testUser.passwordHash); 
    if (!isValid) {
        return res.status(401).json({ message: 'Ugyldig e-post eller passord' }); 
    }

    // Create JWT-token 
    const token = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Innlogging vellyket', token }); 
});

// Test-endpoint 
app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Validation of token 
app.get('/api/verify', (req, res) => {
    const authHeader = req.headers['authorization']; 

    if (!authHeader) {
        return res.status(401).json({ message: 'Manglende auth-header' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"

    if(!token) {
        return res.status(401).json({ message: 'Token mangler' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        res.json({ message: 'Token gyldig', userId: decoded.userId });
    } catch (err) {
        res.status(401).json({ message: 'Token ugyldig eller utløpt' }); 
    }
});

// Start server 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Use backticks to print the actual value, instead of the variable name  
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
