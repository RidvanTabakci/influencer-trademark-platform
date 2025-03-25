const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ["text", "image", "video", "file"], default: "text" },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
