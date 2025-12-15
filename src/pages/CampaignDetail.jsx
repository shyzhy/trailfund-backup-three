import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaBullseye, FaBuilding, FaHandHoldingHeart } from "react-icons/fa";
import { API_BASE_URL } from '../config';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`);
        if (!response.ok) {
          throw new Error('Campaign not found');
        }
        const data = await response.json();
        setCampaign(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>;
  }

  if (error || !campaign) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column' }}>
        <p>Error: {error || 'Campaign not found'}</p>
        <button onClick={() => navigate(-1)} className="btn" style={{ marginTop: 20 }}>Go Back</button>
      </div>
    );
  }

  const percentRaised = Math.min(((campaign.raised || 0) / (campaign.target_amount || 1)) * 100, 100);

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

      {/* Rejection/Revision Alert */}
      {campaign.status === 'rejected' && (
        <div style={{ background: 'rgba(255, 107, 107, 0.2)', border: '1px solid #FF6B6B', padding: 15, borderRadius: 12, marginBottom: 20, display: 'flex', gap: 10, alignItems: 'start' }}>
          <div style={{ color: '#FF6B6B', fontSize: 20 }}>⚠️</div>
          <div>
            <strong style={{ color: '#FF6B6B' }}>Campaign Rejected</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
              Admin Note: {campaign.admin_feedback || "No feedback provided."}
            </p>
          </div>
        </div>
      )}

      {/* Approved Alert */}
      {campaign.status === 'approved' && (
        <div style={{ background: 'rgba(40, 167, 69, 0.2)', border: '1px solid #28a745', padding: 15, borderRadius: 12, marginBottom: 20, display: 'flex', gap: 15, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            {campaign.approved_by_id?.profile_picture ? (
              <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid #28a745' }}>
                <img src={campaign.approved_by_id.profile_picture} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ color: '#28a745', fontSize: 24 }}>✓</div>
            )}
          </div>
          <div>
            <strong style={{ color: '#28a745', fontSize: 16 }}>Campaign Approved</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
              This campaign has been verified and approved{campaign.approved_by_id?.name ? ` by ${campaign.approved_by_id.name}` : (campaign.approved_by ? ` by ${campaign.approved_by}` : '')}.
            </p>
            <div style={{ fontSize: 12, color: '#28a745', marginTop: 4, opacity: 0.8 }}>Authorized Administrator</div>
          </div>
        </div>
      )}

      {(campaign.admin_feedback && campaign.status === 'pending') && (
        <div style={{ background: 'rgba(255, 193, 7, 0.2)', border: '1px solid #FFC107', padding: 15, borderRadius: 12, marginBottom: 20, display: 'flex', gap: 10, alignItems: 'start' }}>
          <div style={{ color: '#FFC107', fontSize: 20 }}>📝</div>
          <div>
            <strong style={{ color: '#FFC107' }}>Revision Requested</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
              Admin Note: {campaign.admin_feedback}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
        <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2 style={{ margin: 0, fontSize: 20 }}>Campaign Details</h2>
      </div>

      <div style={{ padding: 0, overflow: 'hidden', marginTop: 20 }}>
        <div style={{ height: 300, position: 'relative', margin: '0 -20px', borderRadius: 0 }}>
          <img src={campaign.image || "/assets/university.jpg"} alt={campaign.name} style={{ width: "100%", height: '100%', objectFit: "cover" }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>{campaign.name}</h1>
            {campaign.organization && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, color: 'rgba(255,255,255,0.8)' }}>
                <FaBuilding size={12} />
                <span style={{ fontSize: 14 }}>{campaign.organization}</span>
              </div>
            )}
            {campaign.end_date && (
              <div style={{
                marginTop: 10,
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                {Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days left
              </div>
            )}
          </div>
        </div>

        <div style={{ paddingTop: 25 }}>

          {/* Donation Progress / Type Info */}
          <div style={{ marginBottom: 25 }}>
            {campaign.donation_type === 'Items' ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <FaHandHoldingHeart style={{ color: 'var(--accent-color)' }} size={20} />
                  <span style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--accent-color)' }}>COLLECTING ITEMS</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 'bold' }}>{campaign.item_type || 'Various Items'}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 5 }}>Drop-off Point: {campaign.designated_site || 'TBA'}</div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 40, fontWeight: 'bold', color: 'var(--accent-color)' }}>₱{(campaign.raised || 0).toLocaleString()}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>raised of ₱{campaign.target_amount.toLocaleString()} goal</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>{Math.round(percentRaised)}%</div>
                </div>
                <div style={{ width: '100%', height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${percentRaised}%`, height: '100%', background: 'var(--accent-color)', borderRadius: 6 }} />
                </div>

                {campaign.donation_type === 'Digital' && (
                  <div style={{ marginTop: 20, background: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 12, fontSize: 14 }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Donate via {campaign.digital_payment_type}</div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }}>{campaign.account_number}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>About this campaign</h3>
            <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
              {campaign.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 15 }}>

            {/* Donate Button (Hide if Owner) */}
            {campaign.user_id !== JSON.parse(localStorage.getItem('user'))?._id && (
              <button className="btn" style={{ flex: 1, background: 'var(--accent-color)', color: 'white', padding: 16, fontSize: 16, borderRadius: 14 }}>
                {campaign.donation_type === 'Items' ? 'I Want to Donate Items' : 'Donate Now'}
              </button>
            )}

            <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: 16, borderRadius: 14, flex: campaign.user_id === JSON.parse(localStorage.getItem('user'))?._id ? 1 : 0 }}>
              Share
            </button>

            {/* Delete/Edit Buttons (Only for Owner) */}
            {campaign.user_id === JSON.parse(localStorage.getItem('user'))?._id && (
              <>
                <button
                  className="btn"
                  onClick={() => navigate(`/campaigns/edit/${id}`)}
                  style={{ background: 'rgba(255, 193, 7, 0.8)', color: 'white', padding: 16, borderRadius: 14, flex: 1 }}
                >
                  Edit
                </button>
                <button
                  className="btn"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this campaign?')) {
                      try {
                        await fetch(`${API_BASE_URL}/api/campaigns/${id}`, { method: 'DELETE' });
                        navigate('/campaigns');
                      } catch (err) {
                        alert('Failed to delete');
                      }
                    }
                  }}
                  style={{ background: 'rgba(220, 53, 69, 0.8)', color: 'white', padding: 16, borderRadius: 14, flex: 1 }}
                >
                  Delete
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
