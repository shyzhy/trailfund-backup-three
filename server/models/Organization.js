const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    representative_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date_created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', OrganizationSchema);
