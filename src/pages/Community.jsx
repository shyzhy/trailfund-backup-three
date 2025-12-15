import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaComment, FaShare, FaPaperPlane, FaImage, FaSearch, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import BottomNav from '../components/BottomNav';
import { API_BASE_URL } from '../config';
import mockUsers from '../data/mockUsers';

export default function Community() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts`);
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                }
            } catch (err) {
                console.error('Error fetching posts:', err);
            }
        };
        fetchPosts();
    }, []);

    const handlePostSubmit = async () => {
        if (!newPost.trim()) return;

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to post');
            return;
        }
        const user = JSON.parse(userStr);

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user._id,
                    content: newPost
                })
            });

            if (response.ok) {
                const savedPost = await response.json();
                setPosts([savedPost, ...posts]);
                setNewPost('');
            }
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    const handleLike = async (postId, e) => {
        e.stopPropagation();
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user._id })
            });

            if (response.ok) {
                const updatedPost = await response.json();
                // Manually populate user details if needed, or just update likes
                // Since API returns the post but maybe not populated user, we might need to be careful
                // Actually, let's just update the likes array in local state
                setPosts(posts.map(p => {
                    if (p._id === postId) {
                        // Optimistic update or use returned data
                        // The returned data might not have populated user_id if we didn't populate in the like endpoint
                        // Let's just toggle locally for smoothness or re-fetch
                        // Better: Update likes array from response
                        return { ...p, likes: updatedPost.likes };
                    }
                    return p;
                }));
            }
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const filteredUsers = searchQuery
        ? mockUsers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.user_id?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ padding: 20, paddingBottom: 100, minHeight: '100vh', color: 'white', position: 'relative' }}>

            {/* Background Image with Mask Fade */}
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
                mask: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                WebkitMask: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
            }} />

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                    <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                    <h2 style={{ margin: 0, fontSize: 20 }}>Community Wall</h2>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', zIndex: 20 }}>
                    <div className="glass-card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 15px',
                        borderRadius: 25,
                        gap: 10
                    }}>
                        <FaSearch color="rgba(255,255,255,0.5)" />
                        <input
                            type="text"
                            placeholder="Search friends or posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                width: '100%',
                                outline: 'none',
                                fontSize: 14
                            }}
                        />
                    </div>

                    {/* Search Dropdown */}
                    {searchQuery && (
                        <div className="glass-card" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: 10,
                            padding: 15,
                            background: 'rgba(0, 59, 92, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 20,
                            maxHeight: 400,
                            overflowY: 'auto',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {/* People Results */}
                            {filteredUsers.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <h3 style={{ fontSize: 14, marginBottom: 10, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>People</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {filteredUsers.map(user => (
                                            <div
                                                key={user.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    cursor: 'pointer',
                                                    padding: '8px 0',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                }}
                                                onClick={() => navigate(`/profile/${user.id}`)}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <img src={user.avatar} alt={user.name} style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: '50%',
                                                        objectFit: 'cover'
                                                    }} />
                                                    <span style={{ fontWeight: 500, fontSize: 14 }}>{user.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Post Results */}
                            {filteredPosts.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: 14, marginBottom: 10, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>Posts</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {filteredPosts.map(post => (
                                            <div
                                                key={post._id}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '10px 0',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                }}
                                                onClick={() => navigate(`/community/post/${post._id}`)}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                                    <img src={post.user_id?.profile_picture || '/assets/pfp1.jpg'} alt={post.user_id?.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                                                    <span style={{ fontSize: 12, fontWeight: 'bold' }}>{post.user_id?.name || 'Unknown'}</span>
                                                </div>
                                                <p style={{ fontSize: 13, margin: 0, opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {post.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filteredUsers.length === 0 && filteredPosts.length === 0 && (
                                <div style={{ textAlign: 'center', opacity: 0.6, padding: 20, fontSize: 14 }}>
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Post */}
            <div className="glass-card" style={{ padding: 15, marginBottom: 25 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <img src={JSON.parse(localStorage.getItem('user'))?.profile_picture || "/assets/pfp1.jpg"} alt="User" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="What's on your mind?"
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            resize: 'none',
                            outline: 'none',
                            fontSize: 14,
                            paddingTop: 10
                        }}
                        rows={2}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                        <FaImage size={18} />
                    </button>
                    <button
                        onClick={handlePostSubmit}
                        style={{
                            background: 'var(--accent-color)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            cursor: 'pointer'
                        }}
                    >
                        Post <FaPaperPlane size={10} />
                    </button>
                </div>
            </div>

            {/* Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {posts.map(post => (
                    <div
                        key={post._id}
                        className="glass-card"
                        style={{ padding: 20, cursor: 'pointer' }}
                        onClick={() => navigate(`/community/post/${post._id}`)}
                    >
                        {/* Post Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
                            <img src={post.user_id?.profile_picture || '/assets/pfp1.jpg'} alt={post.user_id?.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }} />
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: 15 }}>{post.user_id?.name || 'Unknown'}</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{new Date(post.date_posted).toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Content */}
                        <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 15, color: 'rgba(255,255,255,0.9)' }}>
                            {post.content}
                        </p>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 20, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 15 }}>
                            <button
                                onClick={(e) => handleLike(post._id, e)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: (post.likes || []).includes(JSON.parse(localStorage.getItem('user'))?._id) ? '#ff4d4d' : 'rgba(255,255,255,0.6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    cursor: 'pointer',
                                    fontSize: 13
                                }}
                            >
                                <FaHeart /> {post.likes?.length || 0}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/community/post/${post._id}`);
                                }}
                                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}
                            >
                                <FaComment /> {post.comments}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); /* Add share logic */ }}
                                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginLeft: 'auto', fontSize: 13 }}
                            >
                                <FaShare />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
}
