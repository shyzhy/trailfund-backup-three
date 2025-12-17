const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    item_type: String, // For item donations
    receipt: String, // Base64 receipt image
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    date: { type: Date, default: Date.now }
});

// Index for faster lookups by campaign
DonationSchema.index({ campaign_id: 1 });

module.exports = mongoose.model('Donation', DonationSchema);
