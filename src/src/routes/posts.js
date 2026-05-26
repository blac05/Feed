import express from 'express';
import { createPost, getAllPosts, toggleLikePost, addComment } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly viewable streams (Twitter/Instagram view engines)
router.get('/', getAllPosts);

// Protected actions requiring validated token signatures
router.post('/create', protect, createPost);
router.post('/:id/like', protect, toggleLikePost);
router.post('/:id/comment', protect, addComment);

export default router;