const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Relative to this file (server/migrations -> server/.env)

const migrate = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trailfund';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        // Use native collection to bypass Mongoose schema restrictions (since we removed 'donations' from schema)
        const campaigns = await mongoose.connection.db.collection('campaigns').find({}).toArray();

        let totalMoved = 0;

        for (const camp of campaigns) {
            if (camp.donations && camp.donations.length > 0) {
                console.log(`Processing campaign: ${camp.name} (${camp._id}) - Found ${camp.donations.length} donations`);

                for (const d of camp.donations) {
                    const newDonation = new Donation({
                        campaign_id: camp._id,
                        user_id: d.user_id,
                        amount: d.amount,
                        item_type: d.item_type,
                        receipt: d.receipt,
                        status: d.status || 'pending',
                        date: d.date || Date.now()
                    });

                    await newDonation.save();
                    totalMoved++;
                }

                // Optional: Unset the donations field from the campaign to clean up
                await mongoose.connection.db.collection('campaigns').updateOne({ _id: camp._id }, { $unset: { donations: "" } });
            }
        }

        console.log(`Migration complete. Moved ${totalMoved} donations.`);
        process.exit(0);

    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
