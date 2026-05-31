import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routing Nodes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();

// Global Request Adapters
app.use(cors({ origin: '*' })); // Allows smooth communication with frontend development ports
app.use(express.json());

// Main Routing Architecture Declarations
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/events', eventRoutes);

// Fallback Route for non-matching URLs
app.use((req, res) => res.status(404).json({ error: 'Target Feed Core Node API Route Not Found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 FEED ULTRA-MODERN BACKEND HUB ACTIVATED ON PORT: ${PORT}`);
  console.log(`🔧 Architecture Layers Stacked: Routes, Middleware, Models`);
  console.log(`===================================================`);
});
