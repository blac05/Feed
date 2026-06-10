import express from 'express';

// Create a router instance
const router = express.Router();

// Sample data (replace with database logic as needed)
let podcasts = [
  { id: 1, title: 'Podcast One', description: 'First podcast' },
  { id: 2, title: 'Podcast Two', description: 'Second podcast' },
];

// GET /api/podcasts - Get all podcasts
router.get('/', (req, res) => {
  res.json(podcasts);
});

// GET /api/podcasts/:id - Get a podcast by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const podcast = podcasts.find(p => p.id === parseInt(id));
  if (podcast) {
    res.json(podcast);
  } else {
    res.status(404).json({ message: 'Podcast not found' });
  }
});

// POST /api/podcasts - Create a new podcast
router.post('/', (req, res) => {
  const { title, description } = req.body;
  const newPodcast = {
    id: podcasts.length + 1,
    title,
    description,
  };
  podcasts.push(newPodcast);
  res.status(201).json(newPodcast);
});

// PUT /api/podcasts/:id - Update a podcast
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const podcast = podcasts.find(p => p.id === parseInt(id));
  if (podcast) {
    podcast.title = title || podcast.title;
    podcast.description = description || podcast.description;
    res.json(podcast);
  } else {
    res.status(404).json({ message: 'Podcast not found' });
  }
});

// DELETE /api/podcasts/:id - Delete a podcast
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = podcasts.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    const deleted = podcasts.splice(index, 1);
    res.json({ message: 'Podcast deleted', podcast: deleted[0] });
  } else {
    res.status(404).json({ message: 'Podcast not found' });
  }
});

export default router;