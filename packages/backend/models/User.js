const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Kullanıcı Şeması
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
  
// Kullanıcı Modelini Tanımla
const User = mongoose.model("User", UserSchema);

module.exports = User;
