const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    receipt: { type: String ,required : false}, // Dosya URL olarak kaydedilebilir (örneğin: S3, Firebase Storage)
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
