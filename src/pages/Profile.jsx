import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUserPlus, FaUserCheck, FaMapMarkerAlt, FaGraduationCap, FaBirthdayCake, FaBuilding, FaEdit, FaSave, FaTimes, FaKey, FaUserCog, FaLink, FaCamera, FaSignOutAlt } from 'react-icons/fa';
import mockUsers from '../data/mockUsers';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../config';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [formData, setFormData] = useState({});
  const [requests, setRequests] = useState([]);
  const fileInputRef = React.useRef(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('success'); // success, error, warning, pending
  const [modalMessage, setModalMessage] = useState('');

  const { id } = useParams();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If ID is provided in URL, use it. Otherwise try to get from localStorage (current user)
        const userId = id || JSON.parse(localStorage.getItem('user'))?._id;

        if (!userId) {
          navigate('/login');
          return;
        }

        // Fetch user details from API (we might need a specific endpoint for full profile)
        // For now, we'll fetch all users and find the one (inefficient but works with current API)
        // OR better: assume we have GET /api/users/:id. Let's check api.js first.
        // Actually api.js only has GET /users. I should probably add GET /users/:id or filter client side.
        // Let's filter client side for now as per current api.js
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const users = await response.json();
        const foundUser = users.find(u => u._id === userId);

        if (foundUser) {
          setUser(foundUser);
          setFormData(foundUser);

          // Fetch user's requests
          const reqResponse = await fetch(`${API_BASE_URL}/api/users/${userId}/requests`);
          if (reqResponse.ok) {
            const userRequests = await reqResponse.json();
            setRequests(userRequests);
          }

          // Fetch user's posts
          const postResponse = await fetch(`${API_BASE_URL}/api/users/${userId}/posts`);
          if (postResponse.ok) {
            const userPosts = await postResponse.json();
            setUser(prev => ({ ...prev, posts: userPosts }));
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_picture: reader.result }));
        // Also update local user state for immediate preview if needed, 
        // though formData checks in the render logic would be better if we updated the src to look at formData.profile_picture first
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsEditing(false);
        // Update local storage if it's the current user
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && currentUser._id === data.user._id) {
          localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data.user }));
        }

        // Show Success Modal
        setModalType('success');
        setModalMessage('Changes saved successfully!');
        setModalOpen(true);
      } else {
        setModalType('error');
        setModalMessage(data.message || 'Failed to update profile');
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setModalType('error');
      setModalMessage('An error occurred while saving changes');
      setModalOpen(true);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ paddingBottom: 100, minHeight: '100vh', color: 'white', position: 'relative' }}>

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

      {/* Header / Cover Area - Made Transparent */}
      <div style={{
        height: '240px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}>

        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
          {!isEditing ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: showSettings ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(5px)',
                  border: 'none',
                  color: 'white',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 16
                }}
                title="Account Settings"
              >
                <FaUserCog />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(5px)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleCancel}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  background: 'var(--accent-color)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold'
                }}
              >
                <FaSave /> Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 24px', marginTop: -60, position: 'relative', zIndex: 5 }}>
        {/* Profile Info */}
        <div style={{ marginBottom: 25 }}>
          <div style={{ position: 'relative', width: 110, height: 110, marginBottom: 15 }}>
            <img
              src={(isEditing && formData.profile_picture) ? formData.profile_picture : (user.profile_picture || "/assets/giselle.jpg")}
              alt={user.name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '4px solid #003B5C',
                objectFit: 'cover',
                background: '#1a1a1a',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
              }}
            />
            {isEditing && (
              <div
                onClick={handleImageClick}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: 'var(--accent-color)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #003B5C',
                  cursor: 'pointer',
                  zIndex: 20
                }}>
                <FaCamera size={14} color="white" />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                style={inputStyle}
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                style={inputStyle}
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Bio"
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>
          ) : (
            <>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: '800', letterSpacing: '-0.5px' }}>{user.name}</h1>
              <p style={{ margin: '4px 0', color: 'var(--accent-color)', fontSize: 15, fontWeight: '500' }}>{user.username}</p>
              <p style={{ marginTop: 12, lineHeight: 1.6, fontSize: 15, color: 'rgba(255,255,255,0.9)', maxWidth: '90%' }}>{user.bio}</p>
            </>
          )}
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
          {isEditing ? (
            <>
              <div style={editRowStyle}>
                <FaBirthdayCake color="var(--accent-color)" size={14} />
                <input type="number" name="age" value={formData.age || ''} onChange={handleInputChange} placeholder="Age" style={inputStyle} />
              </div>
              <div style={editRowStyle}>
                <FaBuilding color="var(--accent-color)" size={14} />
                <input type="text" name="college" value={formData.college || ''} onChange={handleInputChange} placeholder="College" style={inputStyle} />
              </div>
              <div style={editRowStyle}>
                <FaGraduationCap color="var(--accent-color)" size={16} />
                <input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} placeholder="Department" style={inputStyle} />
              </div>
              <div style={editRowStyle}>
                <span style={{ width: 16 }}></span>
                <input type="text" name="year_level" value={formData.year_level || ''} onChange={handleInputChange} placeholder="Year Level" style={inputStyle} />
              </div>
            </>
          ) : (
            <>
              {user.age && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                  <div style={iconBoxStyle}>
                    <FaBirthdayCake color="var(--accent-color)" size={14} />
                  </div>
                  {user.age} years old
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                <div style={iconBoxStyle}>
                  <FaBuilding color="var(--accent-color)" size={14} />
                </div>
                {user.college}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                <div style={iconBoxStyle}>
                  <FaGraduationCap color="var(--accent-color)" size={16} />
                </div>
                <span>{user.department} <span style={{ opacity: 0.5 }}>•</span> {user.year_level}</span>
              </div>
            </>
          )}
        </div>

        {/* Account Settings */}
        {showSettings && (
          <div style={{ marginBottom: 30, animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: 18, marginBottom: 15 }}>Account Settings</h3>
            <div className="glass-card" style={{ padding: 5, display: 'flex', flexDirection: 'column' }}>
              <SettingsItem icon={<FaKey />} label="Change Password" onClick={() => alert('Change Password Clicked')} />
              <SettingsItem icon={<FaUserCog />} label="Change Username" onClick={() => alert('Change Username Clicked')} />
              <SettingsItem icon={<FaLink />} label="Link USTEP Account" onClick={() => alert('Link USTEP Clicked')} />
              <SettingsItem icon={<FaSignOutAlt />} label="Log Out" onClick={handleLogout} style={{ color: '#FF6B6B' }} />
            </div>
          </div>
        )}

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
                    {new Date(post.date_posted).toLocaleString()} • {post.likes?.length || 0} Likes
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
                  <h4 style={{ margin: '0 0 5px 0' }}>{camp.title}</h4>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    Raised: ₱{(camp.raised || 0).toLocaleString()} / ₱{(camp.target_amount || camp.goal || 0).toLocaleString()}
                  </div>
                </div>
              ))
            ) : <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>No active campaigns</div>
          )}

          {activeTab === 'requests' && (
            requests && requests.length > 0 ? (
              requests.map(req => (
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
      <BottomNav />

      <Modal
        isOpen={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '10px',
  borderRadius: '8px',
  color: 'white',
  fontSize: '14px',
  outline: 'none'
};

const editRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10
};

const iconBoxStyle = {
  width: 32,
  height: 32,
  borderRadius: 10,
  background: 'rgba(0, 180, 216, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const SettingsItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 15,
      padding: '15px',
      background: 'transparent',
      border: 'none',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      color: 'white',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: 15
    }}
  >
    <div style={{ color: 'var(--accent-color)' }}>{icon}</div>
    <span style={{ flex: 1 }}>{label}</span>
    <div style={{ opacity: 0.5 }}>›</div>
  </button>
);
