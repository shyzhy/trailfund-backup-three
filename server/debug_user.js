const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trailfund';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to DB');
        console.log('Connected to DB Name:', mongoose.connection.name);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const user = await User.findOne({ username: 'shurinyaah' });
        if (user) {
            console.log('User found:', user.username);
        } else {
            console.log('User shurinyaah NOT found');
        }
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
