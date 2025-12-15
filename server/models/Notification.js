const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['request_fulfillment', 'campaign_approved', 'friend_request', 'campaign_rejected', 'campaign_revision'], required: true },
    message: { type: String, required: true },
    related_id: { type: mongoose.Schema.Types.ObjectId }, // ID of the request or campaign
    is_read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
