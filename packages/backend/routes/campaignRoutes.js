const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const jwt = require("jsonwebtoken");

// Middleware - Token doğrulama
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Yetkilendirme hatası!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Yetkilendirme hatası!" });
  }
};

// Tüm kampanyaları getir
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("creator", "name email")
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Yeni kampanya oluştur
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, brand, budget, requirements } = req.body;
    const campaign = new Campaign({
      title,
      description,
      brand,
      budget,
      requirements,
      creator: req.userId,
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Kampanya detaylarını getir
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("creator", "name email");
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Kampanya güncelle
router.put("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    if (campaign.creator.toString() !== req.userId) {
      return res.status(403).json({ error: "Bu işlem için yetkiniz yok!" });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Kampanya sil
router.delete("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    if (campaign.creator.toString() !== req.userId) {
      return res.status(403).json({ error: "Bu işlem için yetkiniz yok!" });
    }

    await campaign.deleteOne();
    res.json({ message: "Kampanya silindi!" });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

module.exports = router; 