import express from 'express';

const router = express.Router();

// Sample data for video calls (replace with database integration)
let videoCalls = [
  { id: 1, title: 'Team Meeting', status: 'scheduled' },
  { id: 2, title: 'Client Call', status: 'completed' },
];

// GET /api/video-calls - Get all video calls
router.get('/', (req, res) => {
  res.json(videoCalls);
});

// GET /api/video-calls/:id - Get a specific video call by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const call = videoCalls.find(vc => vc.id === parseInt(id));
  if (call) {
    res.json(call);
  } else {
    res.status(404).json({ message: 'Video call not found' });
  }
});

// POST /api/video-calls - Create a new video call
router.post('/', (req, res) => {
  const { title, status } = req.body;
  const newCall = {
    id: videoCalls.length + 1,
    title,
    status: status || 'scheduled',
  };
  videoCalls.push(newCall);
  res.status(201).json(newCall);
});

// PUT /api/video-calls/:id - Update a video call
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  const call = videoCalls.find(vc => vc.id === parseInt(id));
  if (call) {
    call.title = title || call.title;
    call.status = status || call.status;
    res.json(call);
  } else {
    res.status(404).json({ message: 'Video call not found' });
  }
});

// DELETE /api/video-calls/:id - Delete a video call
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = videoCalls.findIndex(vc => vc.id === parseInt(id));
  if (index !== -1) {
    const deletedCall = videoCalls.splice(index, 1);
    res.json({ message: 'Video call deleted', call: deletedCall[0] });
  } else {
    res.status(404).json({ message: 'Video call not found' });
  }
});

export default router;