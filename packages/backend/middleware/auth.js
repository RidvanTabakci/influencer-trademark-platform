const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Token doğrulama middleware'i
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme hatası!' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı!' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Yetkilendirme hatası!' });
  }
};

// Rol kontrolü için middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Yetkilendirme hatası!' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok!' });
    }

    next();
  };
};

// Yetki kontrolü için middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Yetkilendirme hatası!' });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok!' });
    }

    next();
  };
};

module.exports = {
  auth,
  checkRole,
  checkPermission
}; 