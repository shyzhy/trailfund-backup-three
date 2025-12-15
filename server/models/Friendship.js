const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    friend_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date_added: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Friendship', FriendshipSchema);
