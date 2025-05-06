require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware'ler
app.use(express.json());
app.use(cors());

// MongoDB Atlas Bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas bağlantısı başarılı!"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// Basit bir test endpointi
app.get("/", (req, res) => {
  res.send("Backend Çalışıyor!");
});

// Rotaları ekle
const userRoutes = require("./routes/userRoutes");
const campaignRoutes = require("./routes/campaignRoutes");

app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);

// Sunucuyu başlat
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor.`));
