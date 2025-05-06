const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    budget: { type: Number, required: true },
    requirements: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Aktif', 'Beklemede', 'Tamamlandı', 'İptal'],
      default: 'Aktif'
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);

module.exports = Campaign; 