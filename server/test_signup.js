const BASE_URL = 'http://localhost:5000/api';

async function testSignup() {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const userData = {
        username: `testuser${randomSuffix}`,
        password: 'password123',
        email: `test${randomSuffix}@example.com`,
        name: 'Test User',
        age: 20,
        college: 'Test College'
    };

    console.log('Testing Signup with data:', userData);

    try {
        // 1. Signup
        const signupRes = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const signupData = await signupRes.json();
        console.log('Signup Response:', signupRes.status, signupData);

        if (signupRes.status !== 201) {
            console.error('Signup failed');
            return;
        }

        const userId = signupData.user._id;
        console.log('User ID:', userId);

        // 2. Upload Photo
        const photoData = {
            profile_picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        };

        const photoRes = await fetch(`${BASE_URL}/users/${userId}/photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(photoData)
        });

        const photoResData = await photoRes.json();
        console.log('Photo Upload Response:', photoRes.status, photoResData);

        if (photoRes.status === 200 && photoResData.user.profile_picture === photoData.profile_picture) {
            console.log('SUCCESS: Signup and Photo Upload verified!');
        } else {
            console.error('Photo Upload failed or mismatch');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testSignup();
