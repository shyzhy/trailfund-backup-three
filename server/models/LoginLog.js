const mongoose = require('mongoose');

const LoginLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    ip_address: String,
    status: { type: String, enum: ['success', 'failed'], required: true }
});

module.exports = mongoose.model('LoginLog', LoginLogSchema);
