import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL } from '../../config';

export default function AdminCampaignView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setCampaign(data);
                } else {
                    console.error('Campaign not found');
                }
            } catch (error) {
                console.error('Error fetching campaign:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [id]);

    if (loading) return <div style={{ color: 'white', padding: 20 }}>Loading...</div>;
    if (!campaign) return <div style={{ color: 'white', padding: 20 }}>Campaign not found</div>;

    return (
        <div style={{ padding: 20, color: 'white', minHeight: '100vh', paddingBottom: 100 }}>
            {/* Background Image with Mask Fade to match style */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '60vh',
                backgroundImage: 'url(/assets/university.jpg)',
                backgroundSize: 'cover', backgroundPosition: 'top center',
                zIndex: -2, opacity: 0.3,
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 16 }}
                >
                    <FaArrowLeft /> Back
                </button>
                <h2 style={{ margin: 0 }}>Campaign Details (Admin View)</h2>
            </div>

            <div className="glass-card" style={{ padding: 30, borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Header Section */}
                <div style={{
                    height: 300,
                    borderRadius: 16,
                    backgroundImage: `url(${campaign.image || 'https://via.placeholder.com/800x400'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: 20,
                    border: '1px solid rgba(255,255,255,0.1)'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                        <h1 style={{ margin: '0 0 10px 0', fontSize: 32 }}>{campaign.name}</h1>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
                            Initiated by <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{campaign.user_id?.name || 'Unknown'}</span>
                        </p>
                        <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                            Organization: {campaign.organization || 'N/A'}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                    {/* Left: Description */}
                    <div>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>About this Campaign</h3>
                        <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>
                            {campaign.description}
                        </p>
                    </div>

                    {/* Right: Details Box */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 16 }}>
                        <h4 style={{ marginTop: 0 }}>Details</h4>
                        <div style={{ marginBottom: 15 }}>
                            <small style={{ color: 'rgba(255,255,255,0.5)' }}>Target Amount</small>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4CAF50' }}>
                                ₱{campaign.target_amount?.toLocaleString()}
                            </div>
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <small style={{ color: 'rgba(255,255,255,0.5)' }}>Raised So Far</small>
                            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                                ₱{campaign.raised_amount?.toLocaleString() || 0}
                            </div>
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <small style={{ color: 'rgba(255,255,255,0.5)' }}>Donation Type</small>
                            <div style={{ fontSize: 16 }}>{campaign.donation_type}</div>
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <small style={{ color: 'rgba(255,255,255,0.5)' }}>Status</small>
                            <div style={{
                                fontSize: 16, fontWeight: 'bold',
                                color: campaign.status === 'approved' ? '#4CAF50' :
                                    campaign.status === 'pending' ? '#FFD700' : '#FF6B6B'
                            }}>
                                {campaign.status.toUpperCase()}
                            </div>
                        </div>

                        {(campaign.donation_type === 'Digital') && (
                            <div style={{ marginBottom: 15 }}>
                                <small style={{ color: 'rgba(255,255,255,0.5)' }}>Payment Info</small>
                                <div>{campaign.digital_payment_type} - {campaign.account_number}</div>
                            </div>
                        )}
                        {(campaign.donation_type !== 'Digital') && (
                            <div style={{ marginBottom: 15 }}>
                                <small style={{ color: 'rgba(255,255,255,0.5)' }}>Drop-off Site</small>
                                <div>{campaign.designated_site}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
