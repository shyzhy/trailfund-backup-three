import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { FaCheck, FaTimes, FaEdit, FaEye } from 'react-icons/fa';

export default function CampaignApproval() {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionModal, setActionModal] = useState(null); // { type: 'reject'|'revise', campaignId: string }
    const [feedback, setFeedback] = useState('');

    const fetchCampaigns = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/campaigns/admin/pending`);
            if (response.ok) {
                const data = await response.json();
                setCampaigns(data);
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this campaign?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/campaigns/${id}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user._id })
            });
            if (res.ok) fetchCampaigns();
        } catch (err) {
            console.error(err);
        }
    };

    const handleActionSubmit = async () => {
        if (!feedback) return alert('Please provide a reason/feedback');
        const { type, campaignId } = actionModal;
        const endpoint = type === 'reject' ? 'reject' : 'revise';

        try {
            const res = await fetch(`${API_BASE_URL}/api/campaigns/${campaignId}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user._id,
                    [type === 'reject' ? 'reason' : 'feedback']: feedback
                })
            });
            if (res.ok) {
                setActionModal(null);
                setFeedback('');
                fetchCampaigns();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white' }}>Campaign Approval</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Manage pending fundraising campaigns.</p>

            {loading ? (
                <div style={{ color: 'white' }}>Loading...</div>
            ) : campaigns.length === 0 ? (
                <div className="glass-card" style={{ padding: 40, textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 16, color: 'white' }}>
                    No pending campaigns found.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 20 }}>
                    {campaigns.map(campaign => (
                        <div key={campaign._id} className="glass-card" style={{
                            padding: 20, borderRadius: 16, display: 'flex',
                            gap: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{
                                width: 120, height: 120, borderRadius: 8,
                                background: '#333', flexShrink: 0,
                                backgroundImage: `url(${campaign.image || 'https://via.placeholder.com/150'})`,
                                backgroundSize: 'cover', backgroundPosition: 'center',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>{campaign.name}</h3>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: 20, fontSize: 12,
                                        background: 'rgba(255, 152, 0, 0.2)', color: '#FF9800', fontWeight: 'bold'
                                    }}>
                                        Pending
                                    </span>
                                </div>
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' }}>
                                    By: {campaign.user_id?.name || 'Unknown'} | Target: ₱{campaign.target_amount.toLocaleString()}
                                </p>
                                <p style={{ fontSize: 14, margin: 0, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {campaign.description}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                                <button onClick={() => window.open(`/campaigns/${campaign._id}`, '_blank')}
                                    className="btn" style={{ padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FaEye /> View
                                </button>
                                <button onClick={() => handleApprove(campaign._id)}
                                    className="btn" style={{ padding: '8px 16px', borderRadius: 12, border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FaCheck /> Approve
                                </button>
                                <button onClick={() => setActionModal({ type: 'revise', campaignId: campaign._id })}
                                    className="btn" style={{ padding: '8px 16px', borderRadius: 12, border: 'none', background: '#FF9800', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FaEdit /> Revise
                                </button>
                                <button onClick={() => setActionModal({ type: 'reject', campaignId: campaign._id })}
                                    className="btn" style={{ padding: '8px 16px', borderRadius: 12, border: 'none', background: '#FF6B6B', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FaTimes /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Reject/Revise */}
            {actionModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="glass-card" style={{
                        background: '#002840', padding: 30, borderRadius: 20, width: 400, border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ color: 'white' }}>{actionModal.type === 'reject' ? 'Reject Campaign' : 'Request Revision'}</h3>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                            Please provide {actionModal.type === 'reject' ? 'rejection reason' : 'revision feedback'} for the user.
                        </p>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            style={{
                                width: '100%', height: 100, padding: 10, borderRadius: 12,
                                border: '1px solid rgba(255,255,255,0.2)', margin: '10px 0',
                                background: 'rgba(255,255,255,0.05)', color: 'white'
                            }}
                            placeholder="Enter notes here..."
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button onClick={() => { setActionModal(null); setFeedback(''); }}
                                style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button onClick={handleActionSubmit}
                                style={{ padding: '8px 16px', background: '#FFD700', color: '#002840', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
