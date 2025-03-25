const mongoose = require('mongoose');

const PrivateMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ["text", "image", "video", "file"], default: "text" },
}, { timestamps: true });

module.exports = mongoose.model('PrivateMessage', PrivateMessageSchema);
