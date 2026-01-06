import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import callPrepHandler from '../api/ai/call-prep.js';
import liabilityHandler from '../api/ai/liability.js';
import avmHandler from '../api/ai/avm.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Wrap Vercel-style handlers for Express
function wrapHandler(handler) {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (error) {
            console.error('Handler error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: error.message });
            }
        }
    };
}

// API routes
app.post('/api/ai/call-prep', wrapHandler(callPrepHandler));
app.post('/api/ai/liability', wrapHandler(liabilityHandler));
app.post('/api/ai/avm', wrapHandler(avmHandler));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`   POST /api/ai/call-prep`);
    console.log(`   POST /api/ai/liability`);
    console.log(`   POST /api/ai/avm`);
    console.log(`   GET  /api/health`);
});

