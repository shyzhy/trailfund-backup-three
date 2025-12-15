const mockUsers = [
    {
        id: 1,
        name: 'Giselle',
        username: '@giselle_rocks',
        type: 'user',
        avatar: '/assets/giselle.jpg',
        isFriend: true,
        age: 21,
        college: 'College of Information Technology and Computing',
        department: 'Information Technology',
        yearLevel: '3rd Year',
        bio: 'Tech enthusiast, coffee lover, and aspiring developer. Always looking for new challenges! 💻☕',
        posts: [
            { id: 101, content: 'Does anyone have a spare scientific calculator I could borrow?', time: '5 hours ago', likes: 8, comments: 3 }
        ],
        campaigns: [],
        requests: []
    },
    {
        id: 2,
        name: 'CITC Student Council',
        username: '@citc_sc',
        type: 'organization',
        avatar: '/assets/logo.png',
        isFriend: true,
        age: null,
        college: 'College of Information Technology and Computing',
        department: 'Student Council',
        yearLevel: 'N/A',
        bio: 'Official account of the CITC Student Council. Serving the student body with pride and excellence.',
        posts: [
            { id: 102, content: 'Donation drive for Typhoon Egay victims is now open.', time: '2 hours ago', likes: 45, comments: 12 }
        ],
        campaigns: [
            { id: 201, title: 'Typhoon Egay Relief', raised: 15000, goal: 50000 }
        ],
        requests: []
    },
    {
        id: 3,
        name: 'John Doe',
        username: '@johndoe',
        type: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        isFriend: false,
        age: 22,
        college: 'College of Engineering',
        department: 'Civil Engineering',
        yearLevel: '4th Year',
        bio: 'Engineering student. Love hiking and outdoor activities.',
        posts: [],
        campaigns: [],
        requests: [
            { id: 301, title: 'Medical Assistance for Grandmother', amount: 5000 }
        ]
    },
    {
        id: 4,
        name: 'Jane Smith',
        username: '@janesmith',
        type: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        isFriend: false,
        age: 20,
        college: 'College of Arts and Sciences',
        department: 'Psychology',
        yearLevel: '2nd Year',
        bio: 'Psych major. Interested in mental health advocacy.',
        posts: [],
        campaigns: [],
        requests: []
    },
    {
        id: 5,
        name: 'Robert Brown',
        username: '@robert_b',
        type: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
        isFriend: true,
        age: 23,
        college: 'College of Business',
        department: 'Accountancy',
        yearLevel: '4th Year',
        bio: 'Future CPA. Numbers are my game.',
        posts: [],
        campaigns: [],
        requests: []
    }
];

export default mockUsers;
