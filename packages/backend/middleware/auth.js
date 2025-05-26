const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Token doğrulama middleware'i
const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    console.log('Auth middleware - JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token:', token);
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ error: 'Yetkilendirme hatası!' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('Auth middleware - JWT_SECRET is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    
    const user = await User.findById(decoded.id);
    console.log('Auth middleware - Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Auth middleware - User not found');
      return res.status(401).json({ error: 'Kullanıcı bulunamadı!' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    res.status(401).json({ error: 'Yetkilendirme hatası!', details: error.message });
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