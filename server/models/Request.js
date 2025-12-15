const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    request_type: { type: String, enum: ['Cash', 'Item', 'Digital', 'Gift', 'Service', 'Resource'], required: true }, // Mapped from category
    item_type: String, // Added
    location: String,
    meetup_time: String, // Added
    max_donation: Number,
    min_donation: Number, // Added
    digital_type: String, // Added
    account_number: String, // Added
    service_type: String,
    resource_type: String,
    urgency: { type: String, enum: ['Green', 'Yellow', 'Red'], default: 'Green' }, // Added
    hashtags: String,
    status: { type: String, enum: ['active', 'completed', 'flagged'], default: 'active' },
    date_created: { type: Date, default: Date.now },
    fulfillments: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
        status: { type: String, default: 'pending' } // pending, completed
    }]
});

module.exports = mongoose.model('Request', RequestSchema);
