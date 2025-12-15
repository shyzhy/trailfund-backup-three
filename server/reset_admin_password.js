const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Ensure we are using the correct ENV or default
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to DB for Password Reset');

        // Reset for 'admin_user'
        const result = await User.updateOne(
            { username: 'admin_user' },
            { $set: { password: 'admin123' } }
        );

        if (result.matchedCount > 0) {
            console.log('✅ Password for "admin_user" has been reset to: admin123');
        } else {
            console.log('❌ User "admin_user" not found.');
        }

        // Also reset for 'admin' (faculty) just in case they are trying that one
        const result2 = await User.updateOne(
            { username: 'admin' },
            { $set: { password: 'admin123' } }
        );
        if (result2.matchedCount > 0) {
            console.log('✅ Password for "admin" has been reset to: admin123');
        }

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
