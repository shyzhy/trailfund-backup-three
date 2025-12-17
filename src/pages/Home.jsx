import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaSlidersH, FaBell, FaBars, FaCheck } from "react-icons/fa";
import { API_BASE_URL } from '../config';

import Sidebar from "../components/Sidebar";
import NotificationList from "../components/NotificationList";
// Removed mock imports

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // Added
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, campaign, request, people, organization
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsRes, usersRes, requestsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/campaigns`),
          fetch(`${API_BASE_URL}/api/users`),
          fetch(`${API_BASE_URL}/api/requests`)
        ]);

        const campaignsData = await campaignsRes.json();
        const usersData = await usersRes.json();
        const requestsData = await requestsRes.json();

        setCampaigns(campaignsData);
        setUsers(usersData);
        setRequests(requestsData);

        // Fetch Notifications Count if user logged in
        if (currentUser) {
          const notifRes = await fetch(`${API_BASE_URL}/api/notifications/${currentUser._id}`);
          if (notifRes.ok) {
            const notifData = await notifRes.json();
            setUnreadCount(notifData.filter(n => !n.is_read).length);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentUser]); // Re-run when currentUser is set

  // Aggregate all searchable items
  const getAllItems = () => {
    let items = [];

    // Campaigns
    if (filterType === 'all' || filterType === 'campaign') {
      items = [...items, ...campaigns.map(c => ({ ...c, type: 'campaign', id: c._id, title: c.name }))];
    }

    // Requests
    if (filterType === 'all' || filterType === 'request') {
      // For now, requests are standalone, but if linked to users, we can map them
      const requestItems = requests.map(r => ({ ...r, type: 'request', id: r._id, ownerName: 'Anonymous', avatar: '/assets/logo.png' }));
      items = [...items, ...requestItems];
    }

    // People & Organizations
    if (filterType === 'all' || filterType === 'people' || filterType === 'organization') {
      const filteredUsers = users.filter(u => {
        if (filterType === 'people') return u.role === 'student' || u.role === 'faculty'; // Simplified check
        // Organization logic might need adjustment if we fetch Organizations separately
        return true;
      }).map(u => ({ ...u, title: u.name, description: u.bio, type: 'people', id: u._id, avatar: u.profile_picture }));
      items = [...items, ...filteredUsers];
    }

    return items;
  };

  const filteredItems = getAllItems().filter(item => {
    const query = searchQuery.toLowerCase();
    const titleMatch = item.title ? item.title.toLowerCase().includes(query) : false;
    const descMatch = item.description ? item.description.toLowerCase().includes(query) : false;
    const nameMatch = item.name ? item.name.toLowerCase().includes(query) : false;

    return titleMatch || descMatch || nameMatch;
  });

  const getFilterLabel = () => {
    switch (filterType) {
      case 'campaign': return 'Campaigns';
      case 'request': return 'Requests';
      case 'people': return 'People';
      case 'organization': return 'Organizations';
      default: return 'All';
    }
  };

  return (
    <div style={{ padding: 20, paddingBottom: 100, position: 'relative' }} onClick={() => setIsFilterOpen(false)}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
        opacity: 0.3, // Reduced visibility
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <FaBars size={24} color="white" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }} style={{ cursor: 'pointer' }} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', position: 'relative' }}>

          {/* Notification Bell */}
          <div onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }} style={{ position: 'relative', cursor: 'pointer' }}>
            <FaBell size={24} color="white" />

            {/* Red Badge */}
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: '#FF6B6B',
                color: 'white',
                fontSize: 10,
                fontWeight: 'bold',
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}

            {/* Notification Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: 40,
                right: 0,
                width: 300,
                background: '#002840',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                zIndex: 1001,
                overflow: 'hidden'
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: '10px 15px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', color: 'white' }}>
                  Notifications
                </div>
                {currentUser && (
                  <NotificationList
                    userId={currentUser._id}
                    onClose={() => setShowNotifications(false)}
                    onMarkAllRead={() => setUnreadCount(0)}
                  />
                )}
              </div>
            )}
          </div>

          <Link to={currentUser ? '/profile' : '/login'}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.3)' }}>
              <img src={currentUser?.profile_picture || "/assets/giselle.jpg"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Link>
        </div>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#ff950ae6', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Good Day, {currentUser ? (currentUser.name || currentUser.username) : 'Guest'}!</h1>
        <p style={{ fontSize: 16, color: '#ffffffe6', margin: '4px 0 0 0' }}>Do you wanna donate today?</p>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, position: 'relative', zIndex: 20 }} onClick={(e) => e.stopPropagation()}>
        <div className="glass-card" style={{
          flex: 1,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderRadius: 32
        }}>
          <FaSearch color="rgba(255,255,255,0.8)" />
          <input
            placeholder={`Search ${getFilterLabel()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: 16,
              width: '100%',
              outline: 'none',
              fontWeight: 500
            }}
          />
        </div>

        {/* Filter Button */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: isFilterOpen ? 'white' : '#4ADE80',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(74, 222, 128, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <FaSlidersH color={isFilterOpen ? '#4ADE80' : 'white'} />
          </div>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="glass-card" style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: 200,
              padding: 10,
              background: 'rgba(0, 59, 92, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16,
              zIndex: 30,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {['all', 'campaign', 'request', 'people', 'organization'].map(type => (
                <div
                  key={type}
                  onClick={() => { setFilterType(type); setIsFilterOpen(false); }}
                  style={{
                    padding: '10px 15px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: filterType === type ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: 'white',
                    marginBottom: 4,
                    fontSize: 14,
                    textTransform: 'capitalize'
                  }}
                >
                  {type === 'people' ? 'People' : type === 'organization' ? 'Organizations' : type + 's'}
                  {filterType === type && <FaCheck size={12} color="#4ADE80" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Dropdown Results */}
        {searchQuery && (
          <div className="glass-card" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 10,
            padding: 10,
            background: 'rgba(0, 59, 92, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            maxHeight: 300,
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <Link to={item.type === 'people' || item.type === 'organization' ? `/profile/${item.id}` : `/campaigns/${item.id}`} key={`${item.type}-${item.id}-${index}`} style={{ textDecoration: 'none', color: 'white' }}>
                  <div style={{
                    padding: 10,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <img src={item.avatar || item.image || "/assets/university.jpg"} alt={item.title || item.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 'bold' }}>{item.title || item.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          textTransform: 'uppercase',
                          fontSize: 10,
                          background: 'rgba(255,255,255,0.2)',
                          padding: '2px 6px',
                          borderRadius: 4
                        }}>
                          {item.type}
                        </span>
                        {item.ownerName || (item.bio && item.bio.substring(0, 30) + '...')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ padding: 15, textAlign: 'center', opacity: 0.7, fontSize: 14 }}>
                No results found for "{searchQuery}" in {getFilterLabel()}.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Banner */}
      <div className="glass-card" style={{
        padding: 0,
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        height: 160,
        display: 'flex',
        alignItems: 'center',
        background: 'white' // Light background for the banner
      }}>
        <img src="/assets/tao.jpg" alt="Banner" style={{ position: 'absolute', left: 0, top: 0, width: '70%', height: '100%', objectFit: 'cover', maskImage: 'linear-gradient(to right, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', right: 20, width: '45%', textAlign: 'right', zIndex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: '600', color: '#333' }}>In need of help?</h3>
          <p style={{ margin: '2px 0 12px 0', fontSize: 20, fontWeight: 'bold', color: '#003B5C' }}>Request now.</p>
          <Link to="/create">
            <button className="btn" style={{ background: '#007BFF', color: 'white', fontSize: 14, padding: '8px 24px', borderRadius: 20, border: 'none', boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)' }}>Post</button>
          </Link>
        </div>
      </div>

      {/* Top Requests */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, color: 'white' }}>Top Campaigns</h2>
        <Link to="/explore?tab=campaigns" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
          See All <span>→</span>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 20, scrollbarWidth: 'none' }}>
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <div key={campaign._id} className="glass-card" style={{
              minWidth: 280,
              padding: 20,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <img src={campaign.user_id?.profile_picture || "https://i.pravatar.cc/150?img=10"} alt="User" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>{campaign.user_id?.name || campaign.user_id?.username || "Anonymous"}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                      {campaign.user_id?.role || 'Student'}
                      {campaign.user_id?.college && (
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, marginLeft: 4 }}>
                          {campaign.user_id.college}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {campaign.end_date ? (
                  <span style={{ color: '#FFC107', border: '1px solid #FFC107', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 'bold', background: 'rgba(255, 193, 7, 0.1)' }}>
                    {Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24))} Days Left
                  </span>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>No Deadline</span>
                )}
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 'bold', margin: '0 0 8px 0' }}>{campaign.name}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, marginBottom: 16 }}>
                {campaign.description ? campaign.description.substring(0, 60) + "..." : "No description"}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                  {campaign.tags && campaign.tags.length > 0
                    ? campaign.tags.map(tag => `#${tag} `)
                    : '#campaign #help'}
                </div>
                <Link to={`/campaigns/${campaign._id}`}>
                  <button className="btn" style={{ background: '#007BFF', color: 'white', fontSize: 14, padding: '8px 20px', boxShadow: '0 4px 12px rgba(0, 123, 255, 0.4)' }}>Donate</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.7)', padding: 20, textAlign: 'center', width: '100%' }}>
            No active campaigns yet. Be the first to start one!
          </div>
        )}
      </div>

      {/* Real Top Requests Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, color: 'white' }}>Top Requests</h2>
        <Link to="/explore?tab=requests" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
          See All <span>→</span>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 20, scrollbarWidth: 'none' }}>
        {requests.length > 0 ? (
          requests
            .filter(r => r.status !== 'completed') // Optional: Hide completed
            .sort((a, b) => {
              // Sort by Urgency (Red > Yellow > Green) then Date
              const urgencyOrder = { 'Red': 3, 'Yellow': 2, 'Green': 1 };
              const urgencyDiff = (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);
              if (urgencyDiff !== 0) return urgencyDiff;
              return new Date(b.date_created) - new Date(a.date_created);
            })
            .slice(0, 5) // Top 5
            .map((request) => (
              <div key={request._id} className="glass-card" style={{
                minWidth: 280,
                padding: 20,
                color: 'white',
                background: 'linear-gradient(135deg, rgba(0, 59, 92, 0.8), rgba(0, 89, 130, 0.8))', // Darker blue as per screenshot
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <img src={request.user_id?.profile_picture || "https://i.pravatar.cc/150?img=12"} alt="User" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }} />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: 14 }}>{request.user_id?.name || request.user_id?.username || "Anonymous"}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                        {request.user_id?.role || 'Student'}
                        {request.user_id?.college && (
                          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, marginLeft: 4 }}>
                            {request.user_id.college}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {request.urgency === 'Red' && (
                    <span style={{ color: '#FF6B6B', border: '1px solid #FF6B6B', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 'bold', background: 'rgba(255, 107, 107, 0.1)' }}>Urgent</span>
                  )}
                  {request.urgency === 'Yellow' && (
                    <span style={{ color: '#FFC107', border: '1px solid #FFC107', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 'bold', background: 'rgba(255, 193, 7, 0.1)' }}>Needed</span>
                  )}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 'bold', margin: '0 0 8px 0' }}>{request.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, marginBottom: 16 }}>
                  {request.description ? request.description.substring(0, 60) + "..." : "No description"}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>#request #{request.request_type?.toLowerCase()}</div>
                  <Link to={`/requests/${request._id}`}>
                    <button className="btn" style={{ background: '#007BFF', color: 'white', fontSize: 14, padding: '8px 20px', boxShadow: '0 4px 12px rgba(0, 123, 255, 0.4)' }}>Help</button>
                  </Link>
                </div>
              </div>
            ))
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.7)', padding: 20, textAlign: 'center', width: '100%' }}>
            No active requests.
          </div>
        )}
      </div>
    </div>
  );
}
