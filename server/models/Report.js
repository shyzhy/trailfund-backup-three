const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    reason: { type: String, required: true },
    description: String,
    action_taken: { type: String, enum: ['none', 'warned', 'removed', 'suspended'], default: 'none' },
    date_reported: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
