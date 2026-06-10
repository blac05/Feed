import express from 'express';

const router = express.Router();

// Example data store (replace with database logic)
let reports = [
  { id: 1, title: 'Report 1', description: 'First report' },
  { id: 2, title: 'Report 2', description: 'Second report' },
];

// Get all reports
router.get('/', (req, res) => {
  res.json(reports);
});

// Get a report by ID
router.get('/:id', (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = reports.find(r => r.id === reportId);
  if (report) {
    res.json(report);
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

// Create a new report
router.post('/', (req, res) => {
  const newReport = {
    id: reports.length + 1,
    title: req.body.title,
    description: req.body.description,
  };
  reports.push(newReport);
  res.status(201).json(newReport);
});

// Update a report
router.put('/:id', (req, res) => {
  const reportId = parseInt(req.params.id);
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex !== -1) {
    reports[reportIndex] = {
      id: reportId,
      title: req.body.title,
      description: req.body.description,
    };
    res.json(reports[reportIndex]);
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

// Delete a report
router.delete('/:id', (req, res) => {
  const reportId = parseInt(req.params.id);
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex !== -1) {
    reports.splice(reportIndex, 1);
    res.json({ message: 'Report deleted' });
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

export default router;