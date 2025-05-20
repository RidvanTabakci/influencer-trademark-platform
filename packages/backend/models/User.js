const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Kullanıcı Şeması
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'brand', 'influencer'],
      default: 'influencer'
    },
    permissions: [{
      type: String,
      enum: [
        'create_campaign',
        'edit_campaign',
        'delete_campaign',
        'view_campaigns',
        'manage_users',
        'manage_platform'
      ]
    }],
    // Marka özellikleri
    brandProfile: {
      companyName: String,
      industry: String,
      website: String,
      location: String,
      description: String
    },
    // Influencer özellikleri
    influencerProfile: {
      bio: String,
      followers: Number,
      following: Number,
      posts: Number,
      highestFollowerCount: Number,
      socialMedia: {
        instagram: String,
        youtube: String,
        tiktok: String
      },
      categories: [String]
    }
  },
  { timestamps: true } // createdAt ve updatedAt otomatik olarak eklensin
);
// Kullanıcı kaydedilmeden önce şifreyi hash'le
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  // Şifre karşılaştırma fonksiyonu
  UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
// Yetki kontrolü için yardımcı fonksiyon
UserSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Kullanıcı Modelini Tanımla
const User = mongoose.model("User", UserSchema);

module.exports = User;
