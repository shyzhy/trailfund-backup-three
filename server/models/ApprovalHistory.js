const mongoose = require('mongoose');

const ApprovalHistorySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin
    campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    decision: { type: String, enum: ['approved', 'rejected'], required: true },
    feedback: String,
    date_of_decision: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ApprovalHistory', ApprovalHistorySchema);
