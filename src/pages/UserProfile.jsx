import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserPlus, FaUserCheck, FaMapMarkerAlt, FaGraduationCap, FaBirthdayCake, FaBuilding } from 'react-icons/fa';
import Modal from '../components/Modal'; // Assuming we can reuse Modal for feedback
import { API_BASE_URL } from '../config';

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });
    const [friendStatus, setFriendStatus] = useState('none'); // none, sent, received, friend

    const currentUser = JSON.parse(localStorage.getItem('user'));

    // Check if viewing own profile
    const isOwnProfile = currentUser && currentUser._id === id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/${id}/full`);
                if (!response.ok) throw new Error('User not found');
                const data = await response.json();
                setUser(data);

                // Determine friend status
                if (currentUser) {
                    if (data.friends.some(f => f._id === currentUser._id || f === currentUser._id)) {
                        setFriendStatus('friend');
                    } else if (data.friend_requests.some(r => r.user_id === currentUser._id && r.status === 'sent')) {
                        setFriendStatus('received'); // Wait, if I am in their requests as sent, THEY sent to ME? No.
                        // data.friend_requests contains requests sent TO data.user.
                        // So if I am in there with status 'received', it means I sent it.
                        // Actually let's re-read the backend logic.
                        // targetUser.friend_requests.push({ user_id: current_user_id, status: 'received' });
                        // So if I find myself in their list with 'received', I sent it.
                    } else if (data.friend_requests.some(r => r.user_id === currentUser._id && r.status === 'received')) {
                        setFriendStatus('sent');
                    }

                    // Wait, let's keep it simple.
                    // If I am in their friends list -> Friend.
                    // If I sent a request -> Pending.
                    const myRequest = data.friend_requests.find(r => r.user_id === currentUser._id);
                    if (data.friends.some(f => f._id === currentUser._id || f === currentUser._id)) {
                        setFriendStatus('friend');
                    } else if (myRequest) {
                        setFriendStatus(myRequest.status === 'received' ? 'sent' : 'received');
                    }
                }
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };
        fetchUser();
    }, [id, currentUser?._id]); // Add currentUser dependency

    const handleAddFriend = async () => {
        if (!currentUser) return navigate('/login');

        setModal({ isOpen: true, type: 'pending', message: 'Sending friend request...' });
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${id}/friend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_user_id: currentUser._id })
            });

            if (response.ok) {
                setModal({ isOpen: true, type: 'success', message: 'Friend request sent!' });
                setFriendStatus('sent');
            } else {
                const data = await response.json();
                setModal({ isOpen: true, type: 'warning', message: data.message });
            }
        } catch (err) {
            setModal({ isOpen: true, type: 'error', message: err.message });
        }
    };

    const handleAcceptFriend = async () => {
        if (!currentUser) return navigate('/login');

        setModal({ isOpen: true, type: 'pending', message: 'Accepting friend request...' });
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${id}/friend/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_user_id: currentUser._id })
            });

            if (response.ok) {
                setModal({ isOpen: true, type: 'success', message: 'You are now friends!' });
                setFriendStatus('friend');
            } else {
                const data = await response.json();
                setModal({ isOpen: true, type: 'warning', message: data.message });
            }
        } catch (err) {
            setModal({ isOpen: true, type: 'error', message: err.message });
        }
    };

    if (!user) {
        return <div style={{ color: 'white', padding: 20 }}>Loading...</div>;
    }

    return (
        <div style={{ paddingBottom: 100, minHeight: '100vh', color: 'white', position: 'relative' }}>
            <Modal
                isOpen={modal.isOpen}
                type={modal.type}
                message={modal.message}
                onClose={() => setModal({ ...modal, isOpen: false })}
            />

            {/* Background Image with Mask Fade (Matches Home) */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60vh',
                backgroundImage: 'url(/assets/university.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat',
                zIndex: -2,
                opacity: 0.3,
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
            }} />

            {/* Header / Cover Area */}
            <div style={{
                height: '240px',
                background: 'transparent',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Circles */}
                <div style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    filter: 'blur(30px)'
                }} />

                <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                    <div
                        onClick={() => navigate(-1)}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <FaArrowLeft size={18} color="white" />
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 24px', marginTop: -60, position: 'relative', zIndex: 5 }}>
                {/* Profile Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={user.profile_picture || "/assets/giselle.jpg"}
                            alt={user.name}
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: '50%',
                                border: '4px solid #003B5C', // Matches body bg
                                objectFit: 'cover',
                                background: '#1a1a1a',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                            }}
                        />
                        {friendStatus === 'friend' && (
                            <div style={{
                                position: 'absolute',
                                bottom: 5,
                                right: 5,
                                background: '#4CAF50',
                                border: '3px solid #003B5C',
                                width: 24,
                                height: 24,
                                borderRadius: '50%'
                            }} />
                        )}
                    </div>

                    {!isOwnProfile && (
                        <button
                            onClick={friendStatus === 'received' ? handleAcceptFriend : handleAddFriend}
                            disabled={friendStatus === 'sent' || friendStatus === 'friend'}
                            style={{
                                background: friendStatus === 'friend' ? 'rgba(255,255,255,0.15)' :
                                    friendStatus === 'sent' ? 'rgba(255,255,255,0.15)' :
                                        'linear-gradient(90deg, var(--accent-color), #0090D8)',
                                border: 'none',
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: 30,
                                fontSize: 14,
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: (friendStatus === 'none' || friendStatus === 'received') ? 'pointer' : 'default',
                                marginBottom: 15,
                                boxShadow: friendStatus === 'none' ? '0 4px 15px rgba(0, 180, 216, 0.4)' : 'none',
                                transition: 'transform 0.2s'
                            }}
                        >
                            {friendStatus === 'friend' ? <><FaUserCheck /> Friends</> :
                                friendStatus === 'sent' ? 'Request Sent' :
                                    friendStatus === 'received' ? 'Accept Request' :
                                        <><FaUserPlus /> Connect</>}
                        </button>
                    )}
                </div>

                <div style={{ marginBottom: 25 }}>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: '800', letterSpacing: '-0.5px' }}>{user.name}</h1>
                    <p style={{ margin: '4px 0', color: 'var(--accent-color)', fontSize: 15, fontWeight: '500' }}>{user.username}</p>
                    <p style={{ marginTop: 12, lineHeight: 1.6, fontSize: 15, color: 'rgba(255,255,255,0.9)', maxWidth: '90%' }}>{user.bio || 'No bio yet.'}</p>
                </div>

                {/* Details Cards */}
                <div className="glass-card" style={{
                    padding: 20,
                    marginBottom: 30,
                    display: 'grid',
                    gap: 16,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    {user.age && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaBirthdayCake color="var(--accent-color)" size={14} />
                            </div>
                            {user.age} years old
                        </div>
                    )}
                    {user.college && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaBuilding color="var(--accent-color)" size={14} />
                            </div>
                            {user.college}
                        </div>
                    )}
                    {(user.department || user.year_level) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaGraduationCap color="var(--accent-color)" size={16} />
                            </div>
                            <span>{user.department} <span style={{ opacity: 0.5 }}>•</span> {user.year_level}</span>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(0,0,0,0.2)',
                    padding: 4,
                    borderRadius: 16,
                    marginBottom: 25
                }}>
                    {['posts', 'campaigns', 'requests'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: 'none',
                                color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.5)',
                                padding: '10px 0',
                                borderRadius: 12,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                fontWeight: activeTab === tab ? '600' : '500',
                                transition: 'all 0.3s ease',
                                fontSize: 14
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {activeTab === 'posts' && (
                        user.posts && user.posts.length > 0 ? (
                            user.posts.map(post => (
                                <div key={post._id} className="glass-card" style={{ padding: 15 }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: 14 }}>{post.content}</p>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                        {new Date(post.date_posted).toLocaleDateString()} • {post.likes?.length || 0} Likes
                                    </div>
                                </div>
                            ))
                        ) : <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>No posts yet</div>
                    )}

                    {activeTab === 'campaigns' && (
                        user.campaigns && user.campaigns.length > 0 ? (
                            user.campaigns.map(camp => (
                                <div
                                    key={camp._id || camp.id}
                                    className="glass-card"
                                    style={{ padding: 15, cursor: 'pointer' }}
                                    onClick={() => navigate(`/campaigns/${camp._id || camp.id}`)}
                                >
                                    <h4 style={{ margin: '0 0 5px 0' }}>{camp.title || camp.name}</h4>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                        Raised: ₱{(camp.raised || 0).toLocaleString()} / ₱{(camp.target_amount || camp.goal || 0).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        ) : <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>No active campaigns</div>
                    )}

                    {activeTab === 'requests' && (
                        user.requests && user.requests.length > 0 ? (
                            user.requests.map(req => (
                                <div
                                    key={req._id}
                                    className="glass-card"
                                    style={{ padding: 15, cursor: 'pointer' }}
                                    onClick={() => navigate(`/requests/${req._id}`)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{req.title}</h4>
                                        <span style={{
                                            fontSize: 10,
                                            padding: '2px 8px',
                                            borderRadius: 10,
                                            background: req.urgency === 'Red' ? '#dc3545' : req.urgency === 'Yellow' ? '#ffc107' : '#28a745',
                                            color: req.urgency === 'Yellow' ? 'black' : 'white'
                                        }}>
                                            {req.urgency === 'Green' ? 'Low Urgency' : req.urgency === 'Yellow' ? 'Moderate Urgency' : 'High Urgency'}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13, margin: '0 0 10px 0', opacity: 0.8 }}>{req.description}</p>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                        Type: {req.request_type} • {req.request_type === 'Cash' ? `₱${req.min_donation} - ₱${req.max_donation}` : req.location}
                                    </div>
                                </div>
                            ))
                        ) : <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>No active requests</div>
                    )}
                </div>

            </div>
        </div>
    );
}
