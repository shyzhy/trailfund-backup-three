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

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error('MongoDB Connection Error:', err));

const seedUsers = [
    {
        username: 'giselle_rocks',
        email: 'giselle@citc.edu.ph',
        password: 'password123',
        name: 'Giselle',
        role: 'student',
        age: 21,
        profile_picture: '/assets/giselle.jpg',
        college: 'College of Information Technology and Computing',
        department: 'Information Technology',
        year_level: '3rd Year',
        bio: 'Tech enthusiast, coffee lover, and aspiring developer. Always looking for new challenges! 💻☕',
        status: 'active',
        ustep_linked: true
    },
    {
        username: 'citc_sc_rep',
        email: 'sc_rep@citc.edu.ph',
        password: 'password123',
        name: 'CITC SC Rep',
        role: 'student',
        age: 20,
        profile_picture: '/assets/logo.png',
        college: 'College of Information Technology and Computing',
        department: 'Student Council',
        year_level: '3rd Year',
        bio: 'Representative',
        status: 'active',
        ustep_linked: true
    },
    {
        username: 'admin_user',
        email: 'admin@trailfund.edu.ph',
        password: 'adminpassword',
        name: 'Admin User',
        role: 'admin',
        age: 35,
        profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        college: 'Admin Office',
        department: 'Administration',
        year_level: 'N/A',
        bio: 'System Administrator',
        status: 'active',
        ustep_linked: true
    }
];

const seedDB = async () => {
    try {
        // Clear all collections
        await User.deleteMany({});
        await Campaign.deleteMany({});
        await Request.deleteMany({});
        await Organization.deleteMany({});
        await Post.deleteMany({});
        await Donation.deleteMany({});
        await Report.deleteMany({});
        await Announcement.deleteMany({});
        await Friendship.deleteMany({});
        await ApprovalHistory.deleteMany({});
        await RequestFlag.deleteMany({});
        await LoginLog.deleteMany({});

        console.log('Cleared existing data.');

        // 1. Users
        const createdUsers = await User.insertMany(seedUsers);
        const giselle = createdUsers[0];
        const scRep = createdUsers[1];
        const admin = createdUsers[2];
        console.log('Seeded Users.');

        // 2. Organization
        const org = await Organization.create({
            representative_user_id: scRep._id,
            name: 'CITC Student Council',
            description: 'Official account of the CITC Student Council.',
            status: 'approved'
        });
        console.log('Seeded Organizations.');

        // 3. Campaigns
        const seedCampaigns = [
            {
                user_id: giselle._id,
                name: "University Science Center Renovation",
                description: "Modernizing the campus science hub to foster innovation and research.",
                target_amount: 500000,
                raised_amount: 320000,
                image: "/assets/university.jpg",
                status: 'approved',
                donation_type: 'Cash'
            },
            {
                user_id: scRep._id,
                organization_id: org._id,
                name: "Typhoon Egay Relief",
                description: "Relief operations for victims of Typhoon Egay.",
                target_amount: 50000,
                raised_amount: 15000,
                image: "/assets/university.jpg",
                status: 'approved',
                donation_type: 'Cash'
            }
        ];
        const createdCampaigns = await Campaign.insertMany(seedCampaigns);
        console.log('Seeded Campaigns.');

        // 4. Requests
        const seedRequests = [
            {
                user_id: giselle._id,
                title: 'Medical Assistance for Grandmother',
                description: 'Need financial help for my grandmother\'s medication.',
                request_type: 'Cash',
                max_donation: 5000,
                status: 'active',
                location: 'Cagayan de Oro'
            }
        ];
        const createdRequests = await Request.insertMany(seedRequests);
        console.log('Seeded Requests.');

        // 5. Posts (Community)
        const seedPosts = [
            {
                user_id: giselle._id,
                content: 'Just donated to the Typhoon Egay Relief! Let\'s help our fellow students.',
                date_posted: new Date()
            }
        ];
        const createdPosts = await Post.insertMany(seedPosts);
        console.log('Seeded Posts.');

        // 6. Donations
        const seedDonations = [
            {
                user_id: giselle._id,
                campaign_id: createdCampaigns[1]._id, // Typhoon Egay
                donation_type: 'Cash',
                donation_amount: 500,
                date_donated: new Date()
            }
        ];
        await Donation.insertMany(seedDonations);
        console.log('Seeded Donations.');

        // 7. Reports
        const seedReports = [
            {
                user_id: giselle._id,
                post_id: createdPosts[0]._id,
                reason: 'Spam', // Just for testing
                description: 'Testing report functionality',
                action_taken: 'none'
            }
        ];
        await Report.insertMany(seedReports);
        console.log('Seeded Reports.');

        // 8. Announcements
        const seedAnnouncements = [
            {
                user_id: scRep._id,
                title: 'Fundraising Drive Starts Now!',
                content: 'We are launching our annual fundraising drive. Please support!',
                is_pinned: true
            }
        ];
        await Announcement.insertMany(seedAnnouncements);
        console.log('Seeded Announcements.');

        // 9. Friendship
        const seedFriendships = [
            {
                user_id: giselle._id,
                friend_id: scRep._id
            }
        ];
        await Friendship.insertMany(seedFriendships);
        console.log('Seeded Friendships.');

        // 10. Approval History
        const seedApprovals = [
            {
                user_id: admin._id,
                campaign_id: createdCampaigns[0]._id,
                decision: 'approved',
                feedback: 'Looks good.'
            }
        ];
        await ApprovalHistory.insertMany(seedApprovals);
        console.log('Seeded Approval History.');

        // 11. Request Flags
        const seedFlags = [
            {
                user_id: admin._id,
                request_id: createdRequests[0]._id,
                reason: 'Verification needed',
                action_taken: 'no_action'
            }
        ];
        await RequestFlag.insertMany(seedFlags);
        console.log('Seeded Request Flags.');

        // 12. Login Logs
        const seedLogs = [
            {
                user_id: giselle._id,
                ip_address: '192.168.1.1',
                status: 'success'
            }
        ];
        await LoginLog.insertMany(seedLogs);
        console.log('Seeded Login Logs.');

        console.log('Database Seeded Successfully with ALL tables.');
    } catch (err) {
        console.error('Error Seeding Database:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
