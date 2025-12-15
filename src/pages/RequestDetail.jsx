import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaTag, FaMoneyBillWave } from "react-icons/fa";
import { API_BASE_URL } from '../config';
import Modal from '../components/Modal';

export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/requests/${id}`);
                if (!response.ok) {
                    throw new Error('Request not found');
                }
                const data = await response.json();
                setRequest(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>;
    }

    if (error || !request) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column' }}>
                <p>Error: {error || 'Request not found'}</p>
                <button onClick={() => navigate(-1)} className="btn" style={{ marginTop: 20 }}>Go Back</button>
            </div>
        );
    }

    return (
        <div style={{ padding: 20, paddingBottom: 100, minHeight: '100vh', color: 'white', position: 'relative' }}>

            {/* Feedback Modal */}
            <Modal
                isOpen={modal.isOpen}
                type={modal.type}
                message={modal.message}
                onClose={closeModal}
            />

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
                <h2 style={{ margin: 0, fontSize: 20 }}>Request Details</h2>
            </div>

            {/* Main Content - No Box/Glass Card */}
            <div style={{ marginTop: 20 }}>

                {/* Title and Urgency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>{request.title}</h1>
                    <span style={{
                        background: request.urgency === 'Red' ? 'rgba(220, 53, 69, 0.2)' : request.urgency === 'Yellow' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(40, 167, 69, 0.2)',
                        color: request.urgency === 'Red' ? '#dc3545' : request.urgency === 'Yellow' ? '#ffc107' : '#28a745',
                        padding: '6px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}>
                        {request.urgency === 'Green' ? 'Low' : request.urgency === 'Yellow' ? 'Moderate' : 'High'} Priority
                    </span>
                </div>

                {/* Requested By (Restored Avatar) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 25 }}>
                    <div style={{
                        width: 45,
                        height: 45,
                        borderRadius: '50%',
                        backgroundImage: `url(${request.user_id?.profile_picture || '/assets/default_avatar.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '2px solid rgba(255,255,255,0.2)'
                    }} />
                    <div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Requested by</div>
                        <div style={{ fontWeight: 'bold', fontSize: 16 }}>{request.user_id?.name || 'Unknown'}</div>
                    </div>
                </div>

                {/* Type Badge */}
                <div style={{ marginBottom: 20 }}>
                    <span style={{
                        background: 'var(--accent-color)',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: 13,
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                    }}>
                        {request.request_type}
                    </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.95)', marginBottom: 30 }}>
                    {request.description}
                </p>

                {/* Details Grid (Transparent Background) */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, marginBottom: 30, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'grid', gap: 20 }}>

                        {/* Location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                            <FaMapMarkerAlt size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                            <div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Location</div>
                                <div style={{ fontWeight: 500, fontSize: 16 }}>{request.location}</div>
                            </div>
                        </div>

                        {/* Specific Fields per Type */}
                        {(request.request_type === 'Cash' || request.request_type === 'Gift') && request.meetup_time && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                <FaClock size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                <div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Meetup Time</div>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>{request.meetup_time}</div>
                                </div>
                            </div>
                        )}

                        {request.request_type === 'Item' && request.item_type && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                <FaTag size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                <div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Item Needed</div>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>{request.item_type}</div>
                                </div>
                            </div>
                        )}

                        {request.request_type === 'Digital' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                <FaMoneyBillWave size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                <div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Donation Range</div>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>₱{(request.min_donation || 0).toLocaleString()} - ₱{(request.max_donation || 0).toLocaleString()}</div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div style={{ paddingTop: 10, display: 'flex', gap: 10 }}>
                    {/* Action Buttons with Delete Option */}

                    {/* Contact Button (Hide if Owner) */}
                    {(() => {
                        const currentUser = JSON.parse(localStorage.getItem('user'));
                        const requestOwnerId = typeof request.user_id === 'object' ? request.user_id?._id : request.user_id;

                        if (currentUser && currentUser._id !== requestOwnerId) {
                            return (
                                <button
                                    className="btn"
                                    onClick={async () => {
                                        setModal({ isOpen: true, type: 'pending', message: 'Notifying requester...' });
                                        try {
                                            const response = await fetch(`${API_BASE_URL}/api/requests/${id}/fulfill`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ user_id: currentUser._id })
                                            });
                                            const data = await response.json();
                                            if (response.ok) {
                                                setModal({
                                                    isOpen: true,
                                                    type: 'success',
                                                    message: 'You have notified the user! They will see your interest in their dashboard.'
                                                });
                                            } else {
                                                setModal({ isOpen: true, type: 'warning', message: data.message });
                                            }
                                        } catch (err) {
                                            setModal({ isOpen: true, type: 'error', message: 'Failed to notify: ' + err.message });
                                        }
                                    }}
                                    style={{ flex: 1, background: 'var(--accent-color)', color: 'white', padding: 18, fontSize: 16, borderRadius: 14 }}
                                >
                                    Contact / Fulfill
                                </button >
                            );
                        }
                        return null;
                    })()}

                    {/* Delete/Edit Buttons (Only for Owner) */}
                    {
                        (() => {
                            const currentUser = JSON.parse(localStorage.getItem('user'));
                            const requestOwnerId = typeof request.user_id === 'object' ? request.user_id?._id : request.user_id;

                            if (currentUser && currentUser._id === requestOwnerId) {
                                return (
                                    <>
                                        <button
                                            className="btn"
                                            onClick={() => navigate(`/requests/edit/${id}`)}
                                            style={{ flex: 1, background: 'rgba(255, 193, 7, 0.8)', color: 'white', padding: 18, borderRadius: 14 }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={async () => {
                                                if (window.confirm('Are you sure you want to delete this request?')) {
                                                    try {
                                                        await fetch(`${API_BASE_URL}/api/requests/${id}`, { method: 'DELETE' });
                                                        navigate('/campaigns?tab=requests');
                                                    } catch (err) {
                                                        alert('Failed to delete');
                                                    }
                                                }
                                            }}
                                            style={{ flex: 1, background: 'rgba(220, 53, 69, 0.8)', color: 'white', padding: 18, borderRadius: 14 }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                );
                            }
                            return null;
                        })()
                    }
                </div >

                {/* Interested Users List - Viewed only by Owner */}
                {
                    (() => {
                        const currentUser = JSON.parse(localStorage.getItem('user'));
                        const requestOwnerId = typeof request.user_id === 'object' ? request.user_id?._id : request.user_id;

                        if (currentUser && currentUser._id === requestOwnerId && request.fulfillments && request.fulfillments.length > 0) {
                            return (
                                <div style={{ marginTop: 30, background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 16 }}>
                                    <h3 style={{ margin: '0 0 15px 0', fontSize: 18 }}>Interested Helpers</h3>
                                    <div style={{ display: 'grid', gap: 10 }}>
                                        {request.fulfillments.map((fulfillment, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                                                <div style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundImage: `url(${fulfillment.user_id?.profile_picture || '/assets/default_avatar.png'})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }} />
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{fulfillment.user_id?.name || 'Unknown User'}</div>
                                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                                                        {new Date(fulfillment.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()
                }

            </div >
        </div >
    );
}
