const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    name: { type: String, required: true }, // Mapped from title
    description: { type: String, required: true },
    target_amount: { type: Number, required: true },
    min_donation: Number,
    max_donation: Number,
    donation_type: { type: String, enum: ['Cash', 'Digital', 'Items'], default: 'Cash' },
    digital_payment_type: { type: String, enum: ['GCash', 'PayMaya', 'Other'] },
    organization: String, // Added for text-based filtering
    account_number: String, // Added
    item_type: String,
    designated_site: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Faculty who approved
    approved_by_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Store actual User ID reference
    admin_feedback: String,
    date_created: { type: Date, default: Date.now },
    date_approved: Date,
    end_date: Date, // Added for deadline
    image: String // Kept for UI compatibility
});

module.exports = mongoose.model('Campaign', CampaignSchema);
