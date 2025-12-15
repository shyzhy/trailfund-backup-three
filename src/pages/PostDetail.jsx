import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaComment, FaShare, FaPaperPlane } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    // Fetch comments function
    const fetchComments = async () => {
        try {
            const commentsRes = await fetch(`${API_BASE_URL}/api/posts/${id}/comments`);
            if (commentsRes.ok) {
                const commentsData = await commentsRes.json();

                // Create a map for easy lookup
                const commentMap = {};
                commentsData.forEach(c => {
                    commentMap[c._id] = {
                        id: c._id,
                        author: c.user_id?.name || 'Unknown',
                        avatar: c.user_id?.profile_picture || '/assets/pfp1.jpg',
                        content: c.content,
                        time: new Date(c.date_posted).toLocaleString(),
                        replies: []
                    };
                });

                // Build the tree
                const rootComments = [];
                commentsData.forEach(c => {
                    if (c.parent_comment_id) {
                        if (commentMap[c.parent_comment_id]) {
                            commentMap[c.parent_comment_id].replies.push(commentMap[c._id]);
                        }
                    } else {
                        rootComments.push(commentMap[c._id]);
                    }
                });

                setComments(rootComments);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    // Fetch post and comments
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                // Fetch Post
                const postRes = await fetch(`${API_BASE_URL}/api/posts/${id}`);
                if (postRes.ok) {
                    const postData = await postRes.json();
                    setPost(postData);

                    // Check if liked by current user
                    const userStr = localStorage.getItem('user');
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        setIsLiked(postData.likes.includes(user._id));
                    }
                }

                // Fetch Comments
                await fetchComments();
            } catch (err) {
                console.error('Error fetching post details:', err);
            }
        };
        fetchPostData();
    }, [id]);

    const handleLike = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user._id })
            });

            if (response.ok) {
                const updatedPost = await response.json();
                setPost(prev => ({ ...prev, likes: updatedPost.likes }));
                setIsLiked(!isLiked);
            }
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleReplyClick = (comment) => {
        setReplyingTo(comment);
        setNewComment(`@${comment.author} `);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to comment');
            return;
        }
        const user = JSON.parse(userStr);
        console.log('Submitting comment as user:', user._id, 'Content:', newComment);

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user._id,
                    content: newComment,
                    parent_comment_id: replyingTo ? replyingTo.id : null
                })
            });

            if (response.ok) {
                await fetchComments(); // Re-fetch comments to show new one
                setNewComment('');
                setReplyingTo(null);
                setPost(prev => ({ ...prev, comments: (prev.comments || 0) + 1 }));
            } else {
                const errorData = await response.json();
                alert(`Failed to post comment: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error submitting comment:', err);
            alert('Error submitting comment. Please try again.');
        }
    };

    if (!post) return <div style={{ color: 'white', padding: 20 }}>Loading...</div>;

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
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
            }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
                <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                <h2 style={{ margin: 0, fontSize: 20 }}>Post</h2>
            </div>

            {/* Main Post */}
            <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
                    <img src={post.user_id?.profile_picture || '/assets/pfp1.jpg'} alt={post.user_id?.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }} />
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: 16 }}>{post.user_id?.name || 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{new Date(post.date_posted).toLocaleString()}</div>
                    </div>
                </div>

                <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 20, color: 'rgba(255,255,255,0.9)' }}>
                    {post.content}
                </p>

                <div style={{ display: 'flex', gap: 20, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 15 }}>
                    <button
                        onClick={handleLike}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: isLiked ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 14,
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                        }}
                    >
                        <FaHeart /> {post.likes?.length || 0}
                    </button>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                        <FaComment /> {comments.length}
                    </button>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', fontSize: 14 }}>
                        <FaShare />
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div style={{ marginBottom: 80 }}>
                <h3 style={{ fontSize: 16, marginBottom: 15, color: 'rgba(255,255,255,0.8)' }}>Comments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {comments.map(comment => (
                        <div key={comment.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {/* Main Comment */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <img src={comment.avatar} alt={comment.author} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: 18 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>{comment.author}</div>
                                        <div style={{ fontSize: 14, lineHeight: 1.4 }}>{comment.content}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 15, marginTop: 5, paddingLeft: 10 }}>
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{comment.time}</span>
                                        <button
                                            onClick={() => handleReplyClick(comment)}
                                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 42 }}>
                                    {comment.replies.map(reply => (
                                        <div key={reply.id} style={{ display: 'flex', gap: 10 }}>
                                            <img src={reply.avatar} alt={reply.author} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: 18 }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2 }}>{reply.author}</div>
                                                    <div style={{ fontSize: 13, lineHeight: 1.4 }}>{reply.content}</div>
                                                </div>
                                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, paddingLeft: 10 }}>{reply.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Comment Input */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '15px 20px',
                background: '#002840',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                zIndex: 100
            }}>
                <img src={JSON.parse(localStorage.getItem('user'))?.profile_picture || "/assets/pfp1.jpg"} alt="User" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    padding: '8px 15px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyingTo ? `Replying to ${replyingTo.author}...` : "Write a comment..."}
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
                <button
                    onClick={handleCommentSubmit}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: newComment.trim() ? 'var(--accent-color)' : 'rgba(255,255,255,0.3)',
                        cursor: newComment.trim() ? 'pointer' : 'default'
                    }}
                >
                    <FaPaperPlane size={20} />
                </button>
            </div>

        </div>
    );
}
