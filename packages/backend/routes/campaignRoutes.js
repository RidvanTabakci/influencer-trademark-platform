const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const { auth, checkRole, checkPermission } = require("../middleware/auth");

// Tüm kampanyaları getir
router.get("/", auth, checkPermission('view_campaigns'), async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("creator", "name email role")
      .populate("applications.influencer", "name email role influencerProfile")
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});
// Kampanya detaylarını getir
router.get("/:id", auth, checkPermission('view_campaigns'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("creator", "name email role")
      .populate("applications.influencer", "name email role influencerProfile"); // <-- Bunu ekleyin

    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Yeni kampanya oluştur
router.post("/", auth, checkPermission('create_campaign'), async (req, res) => {
  try {
    const { title, description, brand, budget, requirements } = req.body;
    const campaign = new Campaign({
      title,
      description,
      brand,
      budget,
      requirements,
      creator: req.user._id,
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Kampanya detaylarını getir
router.get("/:id", auth, checkPermission('view_campaigns'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("creator", "name email role");
    
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }
    
    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Kampanya güncelle
router.put("/:id", auth, checkPermission('edit_campaign'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    // Sadece kampanyayı oluşturan veya admin olan kullanıcı güncelleyebilir
    if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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
router.delete("/:id", auth, checkPermission('delete_campaign'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    // Sadece kampanyayı oluşturan veya admin olan kullanıcı silebilir
    if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Bu işlem için yetkiniz yok!" });
    }

    await campaign.deleteOne();
    res.json({ message: "Kampanya silindi!" });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Kampanyaya başvuru yap
router.post("/:id/apply", auth, checkRole(['influencer']), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    // Kampanya aktif mi kontrol et
    if (campaign.status !== 'Aktif') {
      return res.status(400).json({ error: "Bu kampanya için başvuru yapılamaz!" });
    }

    // Daha önce başvuru yapılmış mı kontrol et
    const existingApplication = campaign.applications.find(
      app => app.influencer.toString() === req.user._id.toString()
    );
    if (existingApplication) {
      return res.status(400).json({ error: "Bu kampanyaya zaten başvurdunuz!" });
    }

    // Başvuruyu ekle
    campaign.applications.push({
      influencer: req.user._id,
      message: req.body.message || ''
    });

    await campaign.save();
    res.json({ message: "Başvurunuz başarıyla alındı!", campaign });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Kampanya başvurularını getir (sadece kampanya sahibi veya admin)
router.get("/:id/applications", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('applications.influencer', 'name email influencerProfile');
    
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    // Yetki kontrolü
    if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Bu işlem için yetkiniz yok!" });
    }

    res.json(campaign.applications);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Başvuru durumunu güncelle (sadece kampanya sahibi veya admin)
router.put("/:id/applications/:applicationId", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    // Yetki kontrolü
    if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Bu işlem için yetkiniz yok!" });
    }

    const application = campaign.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ error: "Başvuru bulunamadı!" });
    }

    application.status = status;
    await campaign.save();

    res.json({ message: "Başvuru durumu güncellendi!", application });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Başvuru durumunu güncelle (sadece kampanya sahibi veya admin)
router.put("/:id/applications/:applicationId", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı!" });
    }

    // Yetki kontrolü: Sadece kampanyayı oluşturan marka veya admin
    if (
      (req.user.role === 'brand' && campaign.creator.toString() !== req.user._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: "Sadece kendi oluşturduğunuz kampanyada başvuru yönetebilirsiniz!" });
    }

    const application = campaign.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ error: "Başvuru bulunamadı!" });
    }

    application.status = status;
    await campaign.save();

    res.json({ message: "Başvuru durumu güncellendi!", application });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

module.exports = router; 