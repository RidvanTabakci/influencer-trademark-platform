const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { auth, checkRole, checkPermission } = require("../middleware/auth");
const Campaign = require("../models/Campaign");

// Kullanıcı kaydı
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Lütfen tüm alanları doldurun!" });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Geçerli bir email adresi giriniz!" });
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır!" });
    }

    // Email benzersizlik kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Bu email adresi zaten kullanılıyor!" });
    }

    // Rol kontrolü
    if (role && !['admin', 'brand', 'influencer'].includes(role)) {
      return res.status(400).json({ error: "Geçersiz rol!" });
    }

    // Varsayılan yetkileri belirle
    let permissions = ['view_campaigns'];
    if (role === 'brand') {
      permissions.push('create_campaign', 'edit_campaign', 'delete_campaign');
    } else if (role === 'admin') {
      permissions.push('manage_users', 'manage_platform');
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || 'influencer',
      permissions
    });

    await newUser.save();

    // JWT token oluştur
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions
      }
    });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).json({ 
      error: "Kayıt işlemi sırasında bir hata oluştu!",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Kullanıcı Girişi
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Geçersiz e-posta veya şifre!" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Geçersiz e-posta veya şifre!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Giriş başarılı!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Kullanıcı profili güncelleme
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'email', 'password'];

    // Rol bazlı profil güncellemeleri
    if (req.user.role === 'brand') {
      allowedUpdates.push('brandProfile');
    } else if (req.user.role === 'influencer') {
      allowedUpdates.push('influencerProfile');
    }

    Object.keys(updates).forEach(update => {
      if (allowedUpdates.includes(update)) {
        // Eğer profil güncellemesi ise, alt alanları merge et
        if (update === 'brandProfile' && typeof updates.brandProfile === 'object') {
          req.user.brandProfile = {
            ...req.user.brandProfile,
            ...updates.brandProfile
          };
        } else if (update === 'influencerProfile' && typeof updates.influencerProfile === 'object') {
          req.user.influencerProfile = {
            ...req.user.influencerProfile,
            ...updates.influencerProfile
          };
        } else {
          req.user[update] = updates[update];
        }
      }
    });

    await req.user.save();
    res.json({ message: "Profil güncellendi!", user: req.user });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Influencer profil güncelleme
router.put('/influencer-profile', auth, async (req, res) => {
  try {
    const { influencerProfile } = req.body;
    
    // Kullanıcının influencer rolünde olduğunu kontrol et
    if (req.user.role !== 'influencer') {
      return res.status(403).json({ error: 'Bu işlem için influencer rolü gerekli' });
    }

    // Kullanıcının kendi profilini düzenlediğinden emin ol
    if (req.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Sadece kendi profilinizi düzenleyebilirsiniz' });
    }

    // Sosyal medya linklerini doğrula
    if (influencerProfile.socialMedia) {
      const { instagram, youtube, tiktok } = influencerProfile.socialMedia;
      
      // URL formatını kontrol et - daha esnek bir pattern
      const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
      
      if (instagram && !urlPattern.test(instagram)) {
        return res.status(400).json({ error: 'Geçersiz Instagram URL formatı. Örnek: https://www.instagram.com/kullaniciadi' });
      }
      if (youtube && !urlPattern.test(youtube)) {
        return res.status(400).json({ error: 'Geçersiz YouTube URL formatı. Örnek: https://www.youtube.com/@kanaladi' });
      }
      if (tiktok && !urlPattern.test(tiktok)) {
        return res.status(400).json({ error: 'Geçersiz TikTok URL formatı. Örnek: https://www.tiktok.com/@kullaniciadi' });
      }
    }

    // Profili güncelle
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          influencerProfile: {
            ...req.user.influencerProfile,
            ...influencerProfile
          }
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ 
      message: 'Profil başarıyla güncellendi',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Profil güncellenirken hata:', error);
    res.status(500).json({ error: 'Profil güncellenirken bir hata oluştu' });
  }
});

// Admin: Tüm kullanıcıları listele
router.get("/", auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});
// Admin: Kullanıcı yetkilerini güncelle
router.put("/:id/permissions", auth, checkRole(['admin']), async (req, res) => {
  try {
    const { permissions } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }

    user.permissions = permissions;
    await user.save();
    
    res.json({ message: "Yetkiler güncellendi!", user });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Tüm kampanyaları getir
router.get("/", auth, checkPermission('view_campaigns'), async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("creator", "name email role")
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

router.get('/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password') // Şifreyi hariç tut
      .populate('influencerProfile')
      .populate('brandProfile');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Kullanıcı profili getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// routes/users.js

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı!' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası!' });
  }
});

module.exports = router;
