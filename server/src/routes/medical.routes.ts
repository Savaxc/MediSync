import { Router } from 'express';

const router = Router();

// POST /api/medical/upload - Za upload slike nalaza
router.post('/upload', (req, res) => {
  // Ovde će ići logika za Multer (file upload) i poziv AI-ju
  res.json({ message: 'Slika primljena na obradu' });
});

// GET /api/medical/results - Za listu svih nalaza korisnika
router.get('/results', (req, res) => {
  res.json({ results: [] });
});

export default router;