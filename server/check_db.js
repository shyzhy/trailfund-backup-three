const mongoose = require('mongoose');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Request = require('./models/Request');
const Organization = require('./models/Organization');
const Post = require('./models/Post');
const Donation = require('./models/Donation');
const Report = require('./models/Report');
const Announcement = require('./models/Announcement');
const Friendship = require('./models/Friendship');
const ApprovalHistory = require('./models/ApprovalHistory');
const RequestFlag = require('./models/RequestFlag');
const LoginLog = require('./models/LoginLog');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trailfund';

console.log('Connecting to:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected!');
        console.log('Database Name:', mongoose.connection.db.databaseName);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('--- Existing Collections ---');
        collections.forEach(c => console.log(c.name));
        console.log('----------------------------');

        const counts = await Promise.all([
            User.countDocuments(),
            Campaign.countDocuments(),
            Request.countDocuments(),
            Organization.countDocuments(),
            Post.countDocuments(),
            Donation.countDocuments(),
            Report.countDocuments(),
            Announcement.countDocuments(),
            Friendship.countDocuments(),
            ApprovalHistory.countDocuments(),
            RequestFlag.countDocuments(),
            LoginLog.countDocuments()
        ]);

        console.log('--- Collection Counts ---');
        console.log(`Users: ${counts[0]}`);
        console.log(`Campaigns: ${counts[1]}`);
        console.log(`Requests: ${counts[2]}`);
        console.log(`Organizations: ${counts[3]}`);
        console.log(`Posts: ${counts[4]}`);
        console.log(`Donations: ${counts[5]}`);
        console.log(`Reports: ${counts[6]}`);
        console.log(`Announcements: ${counts[7]}`);
        console.log(`Friendships: ${counts[8]}`);
        console.log(`ApprovalHistory: ${counts[9]}`);
        console.log(`RequestFlags: ${counts[10]}`);
        console.log(`LoginLogs: ${counts[11]}`);

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
