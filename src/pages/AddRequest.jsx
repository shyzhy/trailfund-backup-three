import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaMoneyBillWave, FaGift, FaHandHoldingHeart, FaTools, FaBook, FaBox, FaMobileAlt, FaHandsHelping } from 'react-icons/fa';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../config';

export default function AddRequest() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        category: 'Cash',
        title: '',
        description: '',
        meetupTime: '',
        itemType: '',
        location: '',
        minAmount: '',
        maxAmount: '',
        digitalType: 'GCash',
        accountNumber: '',
        serviceType: '',
        resourceType: '',
        hashtags: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetch(`${API_BASE_URL}/api/requests/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        category: data.request_type || 'Cash',
                        title: data.title || '',
                        description: data.description || '',
                        location: data.location || '',
                        urgency: data.urgency || 'Green',
                        meetupTime: data.meetup_time || '',
                        itemType: data.item_type || '',
                        minAmount: data.min_donation || '',
                        maxAmount: data.max_donation || '',
                        digitalType: data.digital_type || 'GCash',
                        accountNumber: data.account_number || '',
                        serviceType: data.service_type || '',
                        resourceType: data.resource_type || '',
                        hashtags: data.hashtags || ''
                    });
                })
                .catch(err => console.error(err));
        }
    }, [id, isEditMode]);
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });

    // Helper vars for backward compatibility with JSX
    const { category, urgency } = formData;
    const setCategory = (val) => setFormData(prev => ({ ...prev, category: val }));
    const setUrgency = (val) => setFormData(prev => ({ ...prev, urgency: val }));

    const categories = [
        { id: 'Cash', icon: <FaMoneyBillWave />, label: 'Cash' },
        { id: 'Item', icon: <FaBox />, label: 'Items' },
        { id: 'Digital', icon: <FaMobileAlt />, label: 'Digital Payment' },
        { id: 'Gift', icon: <FaGift />, label: 'Gift' },
        { id: 'Service', icon: <FaHandsHelping />, label: 'Service' },
        { id: 'Resource', icon: <FaBook />, label: 'Resource' },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setModal({ isOpen: true, type: 'error', message: 'You must be logged in to post a request.' });
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        const user = JSON.parse(userStr);

        if (!formData.title || !formData.description) {
            setModal({ isOpen: true, type: 'warning', message: 'Please fill in Title and Description.' });
            return;
        }

        setModal({ isOpen: true, type: 'pending', message: 'Submitting your request...' });

        try {
            const payload = {
                user_id: user._id,
                title: formData.title,
                description: formData.description,
                request_type: category,
                location: formData.location,
                max_donation: formData.maxAmount,
                min_donation: formData.minAmount,
                digital_type: formData.digitalType,
                account_number: formData.accountNumber,
                service_type: formData.serviceType,
                resource_type: formData.resourceType,
                hashtags: formData.hashtags,
                urgency: urgency,
                meetup_time: formData.meetupTime,
                item_type: formData.itemType
            };

            const url = isEditMode ? `${API_BASE_URL}/api/requests/${id}` : `${API_BASE_URL}/api/requests`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setModal({ isOpen: true, type: 'success', message: 'Request posted successfully!' });
                setFormData({
                    title: '',
                    description: '',
                    minAmount: '',
                    maxAmount: '',
                    location: 'Main Building',
                    digitalType: 'GCash',
                    accountNumber: '',
                    serviceType: '',
                    resourceType: '',
                    hashtags: ''
                });
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            setModal({ isOpen: true, type: 'error', message: 'Something went wrong.' });
        }
    };

    const handleCloseModal = () => {
        setModal({ ...modal, isOpen: false });
        if (modal.type === 'success') {
            navigate('/home');
        }
    };

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
            <Modal isOpen={modal.isOpen} type={modal.type} message={modal.message} onClose={handleCloseModal} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
                <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>{isEditMode ? 'Edit Request' : 'New Request'}</h2>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>

                {/* Title & Description */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Title of Request</label>
                    <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g., Need funds for thesis printing" style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Explain why you need this help..." style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', resize: 'none' }} />
                </div>

                {/* Hashtags (Moved here) */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Hashtags</label>
                    <input name="hashtags" value={formData.hashtags} onChange={handleChange} type="text" placeholder="#book #notes" style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                </div>

                {/* Urgency Level */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Level of Urgency</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {['Green', 'Yellow', 'Red'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setUrgency(level)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: 12,
                                    border: urgency === level ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                                    background: level === 'Green' ? '#28a745' : level === 'Yellow' ? '#ffc107' : '#dc3545',
                                    color: level === 'Yellow' ? 'black' : 'white',
                                    fontWeight: 'bold',
                                    opacity: urgency === level ? 1 : 0.4,
                                    cursor: 'pointer',
                                    fontSize: 12
                                }}
                            >
                                {level === 'Green' ? 'Low' : level === 'Yellow' ? 'Moderate' : 'High'} Urgency
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Selection */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Request Options</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: 15,
                                    borderRadius: 12,
                                    border: category === cat.id ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.2)',
                                    background: category === cat.id ? 'rgba(0, 180, 216, 0.2)' : 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                                <span style={{ fontSize: 11 }}>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Fields */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
                    {category === 'Cash' && (
                        <>
                            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Min Amount</label>
                                    <input name="minAmount" value={formData.minAmount} onChange={handleChange} type="number" placeholder="0.00" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Max Amount</label>
                                    <input name="maxAmount" value={formData.maxAmount} onChange={handleChange} type="number" placeholder="0.00" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Meetup Location</label>
                                <select name="location" value={formData.location} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: '#002840', color: 'white' }}>
                                    <option>Main Building</option>
                                    <option>Library</option>
                                    <option>Student Center</option>
                                    <option>Gymnasium</option>
                                </select>
                            </div>
                            <div style={{ marginTop: 15 }}>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Meetup Time</label>
                                <input name="meetupTime" value={formData.meetupTime} onChange={handleChange} type="time" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                            </div>
                        </>
                    )}

                    {category === 'Digital' && (
                        <>
                            <div style={{ marginBottom: 15 }}>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Payment Method</label>
                                <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                                        <input type="radio" name="digitalType" value="GCash" checked={formData.digitalType === 'GCash'} onChange={handleChange} /> GCash
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                                        <input type="radio" name="digitalType" value="Load" checked={formData.digitalType === 'Load'} onChange={handleChange} /> Load
                                    </label>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Min Amount</label>
                                    <input name="minAmount" value={formData.minAmount} onChange={handleChange} type="number" placeholder="0.00" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Max Amount</label>
                                    <input name="maxAmount" value={formData.maxAmount} onChange={handleChange} type="number" placeholder="0.00" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Account Number / Mobile</label>
                                <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} type="text" placeholder="09XXXXXXXXX" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                            </div>
                        </>
                    )}

                    {(category === 'Item' || category === 'Gift') && (
                        <div>
                            {category === 'Item' && (
                                <div style={{ marginBottom: 15 }}>
                                    <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Type of Item/s</label>
                                    <input name="itemType" value={formData.itemType} onChange={handleChange} type="text" placeholder="e.g., Clothes, Books" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                            )}
                            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Meetup Location</label>
                            <select name="location" value={formData.location} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: '#002840', color: 'white' }}>
                                <option>Main Building</option>
                                <option>Library</option>
                                <option>Student Center</option>
                            </select>
                            {category === 'Gift' && (
                                <div style={{ marginTop: 15 }}>
                                    <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Meetup Time</label>
                                    <input name="meetupTime" value={formData.meetupTime} onChange={handleChange} type="time" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                            )}
                        </div>
                    )}

                    {(category === 'Service' || category === 'Resource') && (
                        <>
                            <div style={{ marginBottom: 15 }}>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Type of {category}</label>
                                <input name={category === 'Service' ? 'serviceType' : 'resourceType'} value={category === 'Service' ? formData.serviceType : formData.resourceType} onChange={handleChange} type="text" placeholder={`e.g., ${category === 'Service' ? 'Tutoring' : 'Textbook'}`} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Meetup Location</label>
                                <select name="location" value={formData.location} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: '#002840', color: 'white' }}>
                                    <option>Main Building</option>
                                    <option>Library</option>
                                </select>
                            </div>
                            {/* Hashtags removed from here */}
                        </>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="btn"
                    style={{ width: '100%', padding: 15, borderRadius: 30, background: 'var(--accent-color)', color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 20 }}
                >
                    {isEditMode ? 'Save Changes' : 'Post Request'}
                </button>

            </div>
        </div>
    );
}
