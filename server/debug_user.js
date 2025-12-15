const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trailfund';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to DB');
        const user = await User.findOne({ username: 'giselle_rocks' });
        if (user) {
            console.log('User found:', user.username);
            console.log('Name:', user.name);
            console.log('Full Object:', JSON.stringify(user.toObject(), null, 2));
        } else {
            console.log('User giselle_rocks NOT found');
        }
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
