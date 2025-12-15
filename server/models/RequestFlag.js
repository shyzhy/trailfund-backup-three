const mongoose = require('mongoose');

const RequestFlagSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    reason: { type: String, required: true },
    action_taken: { type: String, enum: ['warning', 'removed', 'no_action'], default: 'no_action' },
    date_flagged: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RequestFlag', RequestFlagSchema);
