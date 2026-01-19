import { Router } from 'express';
import multer from 'multer';
import { analyzeMedicalReport } from '../services/ai.service';

const router = Router();

// Konfiguracija Multera: cuva fajl u RAM memoriji (buffer) da bismo ga odmah poslali AI-ju
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Niste poslali sliku.' });
    }

    // Pozivamo AI magiju
    const aiAnalysis = await analyzeMedicalReport(req.file.buffer);

    res.json(aiAnalysis);
  } catch (error: any) {
    console.error("Greška na serveru:", error.message);
    res.status(500).json({ error: 'Greška pri obradi nalaza.' });
  }
});

export default router;