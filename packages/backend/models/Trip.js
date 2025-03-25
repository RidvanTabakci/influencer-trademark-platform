const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }]
},{timestamps: true });

    module.exports = mongoose.model('Trip', TripSchema);
