const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date_posted: { type: Date, default: Date.now },
    is_pinned: { type: Boolean, default: false }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
