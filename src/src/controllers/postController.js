import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create new hybrid media post
export const createPost = async (req, res) => {
  try {
    const { content, category, mediaUrl, commentsDisabled } = req.body;
    const authorId = req.user.id;

    const newPost = await prisma.post.create({
      data: {
        content,
        category,
        mediaUrl,
        commentsDisabled: commentsDisabled || false,
        authorId
      }
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to distribute update post' });
  }
};

// Retrieve timeline records based on active categories
export const getAllPosts = async (req, res) => {
  try {
    const { category } = req.query;
    
    const posts = await prisma.post.findMany({
      where: category && category !== 'all' ? { category } : {},
      include: {
        author: {
          select: { displayName: true, username: true, isVerified: true, pageType: true }
        },
        comments: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error pulling feed stream dataset' });
  }
};

// Handle Like/Unlike system mechanics
export const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Target publication missing' });

    let updatedLikes = [...post.likes];
    if (updatedLikes.includes(userId)) {
      updatedLikes = updatedLikes.filter(uid => uid !== userId); // Unlike
    } else {
      updatedLikes.push(userId); // Like
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { likes: updatedLikes }
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Could not process engagement metrics modifier' });
  }
};

// Post text commentary if comment restrictions allow it
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await prisma.post.findUnique({ where: { id } });
    if (post.commentsDisabled) {
      return res.status(403).json({ error: 'The publisher restricted comments on this transmission.' });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: req.user.id
      }
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register textual commentary thread' });
  }
};