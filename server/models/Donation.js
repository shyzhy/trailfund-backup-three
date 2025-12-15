const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    donation_type: { type: String, enum: ['Cash', 'Item', 'Digital', 'Service', 'Resource'], required: true },
    donation_amount: Number,
    item_description: String,
    digital_method: String,
    service_details: String,
    resource_details: String,
    meetup_location: String,
    date_donated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
