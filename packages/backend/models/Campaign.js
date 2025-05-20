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
    },
    applications: [{
      influencer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      status: {
        type: String,
        enum: ['Beklemede', 'Kabul Edildi', 'Reddedildi'],
        default: 'Beklemede'
      },
      message: String,
      appliedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);

module.exports = Campaign; 