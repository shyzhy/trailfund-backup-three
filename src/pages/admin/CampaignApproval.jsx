import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { FaCheck, FaTimes, FaEdit, FaEye } from 'react-icons/fa';

export default function CampaignApproval() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
    const [actionModal, setActionModal] = useState(null); // { type: 'reject'|'revise'|'delete', campaignId: string }
    const [feedback, setFeedback] = useState('');

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'pending'
                ? `${API_BASE_URL}/api/campaigns/admin/pending`
                : `${API_BASE_URL}/api/campaigns/admin/approved`;

            const response = await fetch(endpoint);
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
    }, [activeTab]);

    const handleApprove = (id) => {
        setActionModal({ type: 'approve', campaignId: id });
    };

    const handleActionSubmit = async () => {
        const { type, campaignId } = actionModal;
        if (type !== 'approve' && !feedback) return alert('Please provide a reason/feedback');

        // Map action type to endpoint suffix
        let endpointSuffix = '';
        if (type === 'reject') endpointSuffix = 'reject';
        else if (type === 'revise') endpointSuffix = 'revise';
        else if (type === 'delete') endpointSuffix = 'delete-with-note';
        else if (type === 'approve') endpointSuffix = 'approve';

        setSubmitting(true);
        try {
            const body = { user_id: user?._id };
            if (type !== 'approve') {
                body[type === 'delete' || type === 'reject' ? 'reason' : 'feedback'] = feedback;
            }

            const res = await fetch(`${API_BASE_URL}/api/campaigns/${campaignId}/${endpointSuffix}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setActionModal(null);
                setFeedback('');
                fetchCampaigns();
            } else {
                const data = await res.json();
                alert(data.message || 'Action failed. Please check console.');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ color: 'white', margin: 0 }}>Campaign Management</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0 0 0' }}>Review pending or manage approved campaigns.</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <button
                    onClick={() => setActiveTab('pending')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'pending' ? '#FFD700' : 'rgba(255,255,255,0.1)',
                        color: activeTab === 'pending' ? '#002840' : 'white',
                        border: 'none',
                        borderRadius: 20,
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Pending Approval
                </button>
                <button
                    onClick={() => setActiveTab('approved')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'approved' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                        color: activeTab === 'approved' ? 'white' : 'white',
                        border: 'none',
                        borderRadius: 20,
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Approved Campaigns
                </button>
            </div>

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

                                <button onClick={() => navigate(`/admin/campaigns/${campaign._id}`)}
                                    className="btn" style={{ padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FaEye /> View
                                </button>

                                {activeTab === 'pending' ? (
                                    <>
                                        <button onClick={() => handleApprove(campaign._id)}
                                            className="btn" style={{ padding: '8px 16px', borderRadius: 12, border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FaCheck /> Approve
                                        </button>
                                        <button onClick={() => setActionModal({ type: 'reject', campaignId: campaign._id })}
                                            className="btn" style={{ padding: '8px 16px', borderRadius: 12, border: 'none', background: '#FF6B6B', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FaTimes /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setActionModal({ type: 'delete', campaignId: campaign._id })}
                                        className="btn" style={{ padding: '8px 16px', borderRadius: 12, border: 'none', background: '#D32F2F', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <FaTimes /> Delete
                                    </button>
                                )}
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
                        <h3 style={{ color: 'white' }}>
                            {actionModal.type === 'approve' ? 'Approve Campaign' :
                                actionModal.type === 'reject' ? 'Reject Campaign' :
                                    actionModal.type === 'revise' ? 'Request Revision' :
                                        'Delete Campaign'}
                        </h3>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                            {actionModal.type === 'approve'
                                ? 'Are you sure you want to approve this campaign? This will make it visible to all users.'
                                : `Please provide ${actionModal.type === 'reject' ? 'rejection reason' :
                                    actionModal.type === 'revise' ? 'revision feedback' :
                                        'reason for deletion'} for the user.`}
                        </p>
                        {actionModal.type !== 'approve' && (
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
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button onClick={() => { setActionModal(null); setFeedback(''); }}
                                disabled={submitting}
                                style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                                Cancel
                            </button>
                            <button onClick={handleActionSubmit}
                                disabled={submitting}
                                style={{
                                    padding: '8px 16px',
                                    background: actionModal.type === 'approve' ? '#4CAF50' :
                                        actionModal.type === 'delete' || actionModal.type === 'reject' ? '#D32F2F' : '#FFD700',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    opacity: submitting ? 0.7 : 1
                                }}>
                                {submitting ? 'Processing...' : (
                                    actionModal.type === 'approve' ? 'Approve' :
                                        actionModal.type === 'delete' ? 'Delete' :
                                            actionModal.type === 'reject' ? 'Reject' : 'Submit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
