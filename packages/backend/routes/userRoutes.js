const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Kullanıcı kaydı
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Lütfen tüm alanları doldurun!" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "Kullanıcı oluşturuldu!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});
// Kullanıcı Girişi
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Kullanıcıyı email ile bul
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Geçersiz e-posta veya şifre!" });
      }
  
      // Şifreyi karşılaştır
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: "Geçersiz e-posta veya şifre!" });
      }
  
      // JWT Token oluştur
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      res.json({
        message: "Giriş başarılı!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Sunucu hatası!" });
    }
  });

module.exports = router;
