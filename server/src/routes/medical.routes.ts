import { Router } from 'express';
import multer from 'multer';
import { analyzeMedicalReport } from '../services/ai.service';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import clerkClient from '@clerk/clerk-sdk-node';

const router = Router();

// Konfiguracija Multera: cuva fajl u RAM memoriji (buffer) da bismo ga odmah poslali AI-ju
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

router.post('/upload', requireAuth, upload.single('file'), async (req: any, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: 'Niste autorizovani' });

    //Dohvatanje email-a od clerk-a (Uzimamo pune podatke o korisniku preko SDK-a)
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || "no-email@medisync.com";

    if (!req.file) return res.status(400).json({ error: 'Nema fajla' });

    const aiAnalysis = await analyzeMedicalReport(req.file.buffer);

    //prisma upsert 
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { email: email },
      create: {
        id: userId,
        email: email,
      },
    });

    const savedRecord = await prisma.medicalRecord.create({
      data: {
        userId: user.id,
        summary: aiAnalysis.summary,
        fullAnalysis: aiAnalysis.results,
      }
    });

    res.json(savedRecord);
  } catch (error) {
    console.error("DETALJNA GREŠKA:", error);
    res.status(500).json({ error: 'Greška pri obradi podataka.' });
  }
});


router.get('/history', requireAuth, async (req: any, res) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Niste autorizovani' });
    }

    // Pronalazimo sve nalaze za tog korisnika, sortirane od najnovijeg ka najstarijem
    const records = await prisma.medicalRecord.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(records);
  } catch (error) {
    console.error("Greška pri dohvaćanju istorije:", error);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;