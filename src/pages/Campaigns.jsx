import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaFilter } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import { API_BASE_URL } from '../config';

export default function Campaigns() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'campaigns';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [campaigns, setCampaigns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState(initialTab); // 'campaigns' or 'requests'
  const [filterUrgency, setFilterUrgency] = useState('All'); // 'All', 'High', 'Medium', 'Low'
  const [filterDonationType, setFilterDonationType] = useState('All');
  const [filterOrganization, setFilterOrganization] = useState(''); // Added
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch Campaigns
    fetch(`${API_BASE_URL}/api/campaigns`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCampaigns(data);
        } else {
          console.error('API returned non-array:', data);
          setCampaigns([]);
        }
      })
      .catch(err => {
        console.error('Error fetching campaigns:', err);
        setCampaigns([]);
      });

    // Fetch Requests
    fetch(`${API_BASE_URL}/api/requests`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          console.error('API returned non-array for requests:', data);
          setRequests([]);
        }
      })
      .catch(err => {
        console.error('Error fetching requests:', err);
        setRequests([]);
      });
  }, []);

  // Sync filterType with activeTab when tab changes
  useEffect(() => {
    setFilterType(activeTab);
  }, [activeTab]);

  const handleApplyFilter = () => {
    setActiveTab(filterType);
    setShowFilter(false);
  };

  const filteredCampaigns = campaigns.filter(c => {
    // 1. Search Filter
    const title = c.name || '';
    const summary = c.description || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Donation Type Filter
    const matchesType = filterDonationType === 'All' || c.donation_type === filterDonationType;

    // 3. Organization Filter
    const org = c.organization || '';
    const matchesOrg = filterOrganization === '' || org.toLowerCase().includes(filterOrganization.toLowerCase());

    return matchesSearch && matchesType && matchesOrg;
  });

  const filteredRequests = requests.filter(r => {
    const urgencyMap = { 'Green': 'Low', 'Yellow': 'Medium', 'Red': 'High' };
    const mappedUrgency = urgencyMap[r.urgency] || r.urgency;

    // 1. Urgency Filter
    const matchesUrgency = filterUrgency === 'All' || mappedUrgency === filterUrgency;

    // 2. Donation Type Filter
    // Allow partial matching or direct mapping.
    // Request Types: Cash, Item, Digital, Gift, Service, Resource
    // Filter Types: Cash, Digital, Items
    let matchesType = true;
    if (filterDonationType !== 'All') {
      if (filterDonationType === 'Items') {
        matchesType = r.request_type === 'Item' || r.request_type === 'Items';
      } else {
        matchesType = r.request_type === filterDonationType;
      }
    }

    // 3. Search Filter
    const title = r.title || '';
    const description = r.description || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUrgency && matchesType && matchesSearch;
  });

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>Explore</h2>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <FaSearch size={20} />
          <FaFilter size={20} onClick={() => setShowFilter(true)} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }} onClick={() => setShowFilter(false)}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: 25, background: '#002840', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>Filter Options</h3>

            {/* Type Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 10, color: 'rgba(255,255,255,0.7)' }}>Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setFilterType('campaigns')}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: filterType === 'campaigns' ? 'var(--accent-color)' : 'transparent',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Campaigns
                </button>
                <button
                  onClick={() => setFilterType('requests')}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: filterType === 'requests' ? 'var(--accent-color)' : 'transparent',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Requests
                </button>
              </div>
            </div>

            {/* Donation Type Filter */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Donation Option</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['All', 'Cash', 'Digital', 'Items'].map(type => (
                  <button key={type}
                    onClick={() => setFilterDonationType(type)}
                    style={{
                      padding: '8px 16px', borderRadius: 20, border: 'none',
                      background: filterDonationType === type ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      cursor: 'pointer'
                    }}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Organization Filter (Only for Campaigns) */}
            {filterType === 'campaigns' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Organization</label>
                <input
                  type="text"
                  value={filterOrganization}
                  onChange={(e) => setFilterOrganization(e.target.value)}
                  placeholder="Filter by Organization..."
                  style={{
                    width: '100%', padding: 12, borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white', outline: 'none'
                  }}
                />
              </div>
            )}

            {/* Urgency Selection (Only if Requests is selected) */}
            {filterType === 'requests' && (
              <div style={{ marginBottom: 25 }}>
                <label style={{ display: 'block', marginBottom: 10, color: 'rgba(255,255,255,0.7)' }}>Urgency Level</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {['All', 'High', 'Medium', 'Low'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFilterUrgency(level)}
                      style={{
                        padding: '8px 15px',
                        borderRadius: 20,
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: filterUrgency === level ? 'var(--accent-color)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn"
              style={{ width: '100%', background: 'var(--accent-color)', color: 'white' }}
              onClick={handleApplyFilter}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 15, marginBottom: 25 }}>
        <button
          onClick={() => setActiveTab('campaigns')}
          style={{
            background: activeTab === 'campaigns' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 20,
            fontWeight: 'bold',
            flex: 1,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            background: activeTab === 'requests' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 20,
            fontWeight: 'bold',
            flex: 1,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Requests
        </button>
      </div>

      {/* Content List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {activeTab === 'campaigns' ? (
          filteredCampaigns.map(c => (
            <div key={c._id || c.id} className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
              {/* Campaign Card Content (Same as before) */}
              <div style={{ height: 160, position: 'relative' }}>
                <img
                  src={c.image || "/assets/university.jpg"}
                  alt={c.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Approval Badge */}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(40, 167, 69, 0.95)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 'bold',
                  backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {c.approved_by_id?.profile_picture && (
                    <div style={{ width: 16, height: 16, borderRadius: '50%', overflow: 'hidden', border: '1px solid white' }}>
                      <img src={c.approved_by_id.profile_picture} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  ✓ Approved {c.approved_by_id?.name ? `by ${c.approved_by_id.name}` : (c.approved_by ? `by ${c.approved_by}` : '')}
                </div>


                <div style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 'bold',
                  backdropFilter: 'blur(4px)'
                }}>
                  {c.end_date ? Math.ceil((new Date(c.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0} days left
                </div>
              </div>

              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <img
                    src={c.user_id?.profile_picture || "/assets/pfp1.jpg"}
                    alt="Owner"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.5)' }}
                  />
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                    by <span style={{ fontWeight: 'bold', color: 'white' }}>{c.user_id?.name || 'Unknown User'}</span>
                  </div>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 'bold' }}>{c.name}</h3>
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {c.description}
                </p>

                <div style={{ marginBottom: 16 }}>
                  {c.donation_type === 'Items' ? (
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Collecting</div>
                      <div style={{ fontWeight: 'bold', fontSize: 15, color: 'var(--accent-color)' }}>{c.item_type || 'Various Items'}</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>₱{(c.raised || 0).toLocaleString()}</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>of ₱{(c.target_amount || c.goal || 0).toLocaleString()}</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                        <div style={{ width: `${((c.raised || 0) / (c.target_amount || c.goal || 1)) * 100}%`, height: '100%', background: 'var(--accent-color)', borderRadius: 3 }} />
                      </div>
                      {c.donation_type === 'Digital' && c.digital_payment_type && (
                        <div style={{ fontSize: 11, marginTop: 5, color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
                          Via {c.digital_payment_type} {c.account_number ? `(${c.account_number})` : ''}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Link to={`/campaigns/${c._id}`} style={{ textDecoration: 'none' }}>
                  <button className="btn" style={{ width: '100%', background: 'var(--accent-color)', color: 'white', padding: 12 }}>View Details</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          filteredRequests.map(r => (
            <div key={r._id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>{r.title}</h3>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{r.request_type}</span>
                </div>
                <span style={{
                  background: r.urgency === 'Red' ? 'rgba(220, 53, 69, 0.2)' : r.urgency === 'Yellow' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(40, 167, 69, 0.2)',
                  color: r.urgency === 'Red' ? '#dc3545' : r.urgency === 'Yellow' ? '#ffc107' : '#28a745',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 'bold'
                }}>
                  {r.urgency === 'Green' ? 'Low' : r.urgency === 'Yellow' ? 'Moderate' : 'High'} Priority
                </span>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 15, lineHeight: 1.5 }}>
                {r.description}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 13 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Location</div>
                    <div style={{ fontWeight: 500 }}>{r.location}</div>
                  </div>
                  {(r.request_type === 'Cash' || r.request_type === 'Gift') && r.meetup_time && (
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Meetup Time</div>
                      <div style={{ fontWeight: 500 }}>{r.meetup_time}</div>
                    </div>
                  )}
                  {r.request_type === 'Item' && r.item_type && (
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Item Type</div>
                      <div style={{ fontWeight: 500 }}>{r.item_type}</div>
                    </div>
                  )}
                  {r.request_type === 'Digital' && (
                    <>
                      <div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Min Donation</div>
                        <div style={{ fontWeight: 500 }}>₱{(r.min_donation || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Max Donation</div>
                        <div style={{ fontWeight: 500 }}>₱{(r.max_donation || 0).toLocaleString()}</div>
                      </div>
                    </>
                  )}
                  {r.hashtags && (
                    <div style={{ gridColumn: '1 / -1', marginTop: 5 }}>
                      <div style={{ color: 'var(--accent-color)', fontSize: 12 }}>{r.hashtags}</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <span>Requested by <span style={{ color: 'white', fontWeight: 'bold' }}>{r.user_id?.name || 'Unknown'}</span></span>
                <Link to={`/requests/${r._id}`} style={{ textDecoration: 'none' }}>
                  <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', fontSize: 12 }}>Full Details</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
