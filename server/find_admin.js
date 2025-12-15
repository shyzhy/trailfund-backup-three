const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to DB');
        const admins = await User.find({ role: { $in: ['admin', 'faculty'] } });
        console.log('--- Admins/Faculty ---');
        if (admins.length > 0) {
            admins.forEach(u => console.log(`${u.username} (${u.role})`));
        } else {
            console.log('No admin/faculty users found.');
            // Create one if needed? Or just let me know.
        }
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
