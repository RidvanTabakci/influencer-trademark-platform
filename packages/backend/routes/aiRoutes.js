const express = require('express');
const router = express.Router();
const { analyzeProfileWithGemini } = require('../services/geminiService');
const { auth } = require('../middleware/auth');

router.post('/analyze-profile', auth, async (req, res) => {
  try {
    const profile = req.body.profile;
    if (!profile) return res.status(400).json({ error: 'Profil verisi gerekli.' });

    // Sadece anlamlı alanları al
    const cleanProfile = {
      name: profile.name,
      email: profile.email,
      role: profile.role,
      influencerProfile: profile.influencerProfile,
      brandProfile: profile.brandProfile,
    };

    console.log('AI analiz endpointi çağrıldı, gönderilen profil:', cleanProfile);

    const result = await analyzeProfileWithGemini(cleanProfile);

    // AI cevabını temizle ve JSON'a zorla
    let analysis;
    if (typeof result === 'string') {
      try {
        const cleanText = result.replace(/```json\n?|\n?```/g, '').trim();
        analysis = JSON.parse(cleanText);
      } catch (e) {
        return res.status(500).json({ error: 'AI yanıtı işlenemedi', details: e.message, raw: result });
      }
    } else {
      analysis = result;
    }

    if (!analysis || typeof analysis !== 'object') {
      return res.status(500).json({ error: 'AI analiz sonucu alınamadı', raw: result });
    }

    res.json({ analysis });
  } catch (error) {
    console.error('AI analiz hatası:', error);
    res.status(500).json({ error: 'AI analiz hatası', details: error.message });
  }
});

module.exports = router; 