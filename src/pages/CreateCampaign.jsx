import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaBullhorn, FaMoneyBillWave, FaHandHoldingHeart, FaBuilding, FaUser, FaMapMarkerAlt, FaCamera, FaImage } from 'react-icons/fa';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../config';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID if editing
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    ownerName: '',
    organization: '',
    description: '',
    targetAmount: '',
    minAmount: '',
    maxAmount: '',
    donationType: 'Cash', // Cash, Digital, Items
    designatedSite: 'Main Building Lobby',
    digitalPaymentType: 'GCash',
    itemType: '',
    accountNumber: '',
    endDate: '',
    image: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      // Fetch existing campaign data
      fetch(`${API_BASE_URL}/api/campaigns/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            title: data.name,
            ownerName: '', // User is handled by backend/localStorage, but we can't easily set it here without knowing logic
            organization: data.organization || '',
            description: data.description,
            targetAmount: data.target_amount,
            minAmount: data.min_donation,
            maxAmount: data.max_donation,
            donationType: data.donation_type,
            designatedSite: data.designated_site,
            digitalPaymentType: data.digital_payment_type || 'GCash',
            itemType: data.item_type || '',
            accountNumber: data.account_number || '',
            endDate: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '',
            image: data.image || ''
          });
        })
        .catch(err => console.error(err));
    }
  }, [id, isEditMode]);
  const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setModal({ isOpen: true, type: 'warning', message: 'Image size should be less than 5MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper vars for backward compatibility
  const { donationType } = formData;
  const setDonationType = (val) => setFormData(prev => ({ ...prev, donationType: val }));

  const handleSubmit = async () => {
    // 1. Validation
    if (!formData.title || !formData.targetAmount || !formData.description) {
      setModal({
        isOpen: true,
        type: 'warning',
        message: 'Please fill in all required fields (Name, Amount, Description).'
      });
      return;
    }

    // Check for logged in user
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setModal({
        isOpen: true,
        type: 'warning',
        message: 'You must be logged in to start a campaign.'
      });
      return;
    }
    const user = JSON.parse(userStr);

    // 2. Pending State
    setModal({ isOpen: true, type: 'pending', message: 'Submitting your campaign...' });

    try {
      const payload = {
        user_id: user._id,
        name: formData.title,
        description: formData.description,
        organization: formData.organization, // Added
        target_amount: Number(formData.targetAmount),
        min_donation: Number(formData.minAmount),
        max_donation: Number(formData.maxAmount),
        donation_type: donationType, // Correct key
        digital_payment_type: formData.digitalPaymentType,
        item_type: formData.itemType,
        account_number: formData.accountNumber,
        designated_site: formData.designatedSite,
        end_date: formData.endDate,
        image: formData.image
      };

      const url = isEditMode ? `${API_BASE_URL}/api/campaigns/${id}` : `${API_BASE_URL}/api/campaigns`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setModal({
          isOpen: true,
          type: 'pending',
          message: isEditMode ? 'Campaign Updated! (Pending Approval)' : 'campaign pending: requesting for approval'
        });
        setTimeout(() => {
          navigate(isEditMode ? `/campaigns/${id}` : '/campaigns');
        }, 2000);
      } else {
        const data = await response.json();
        setModal({ isOpen: true, type: 'error', message: data.message || 'Error saving campaign' });
      }
    } catch (error) {
      // 4. Error State
      setModal({
        isOpen: true,
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.message.includes('pending') || modal.message.includes('Updated')) {
      navigate('/campaigns');
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
      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={handleCloseModal}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
        <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>{isEditMode ? 'Edit Campaign' : 'Start a Campaign'}</h2>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>

        {/* Cover Photo Upload */}
        <div style={{ marginBottom: 25 }}>
          <label style={{ display: 'block', marginBottom: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Cover Photo</label>
          <div
            onClick={() => fileInputRef.current.click()}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 16,
              border: '2px dashed rgba(255,255,255,0.2)',
              background: formData.image ? `url(${formData.image}) center/cover` : 'rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {!formData.image && (
              <>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <FaImage size={24} color="var(--accent-color)" />
                </div>
                <div style={{ fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>Click to upload cover photo</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Recommended: 1200x600px</div>
              </>
            )}
            {formData.image && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-overlay">
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <FaCamera /> Change Photo
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Campaign Name */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Name of Campaign</label>
          <div style={{ position: 'relative' }}>
            <FaBullhorn style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="e.g., Annual Book Drive"
              style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
            />
          </div>
        </div>

        {/* Owner & Organization */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Owner Name</label>
            <div style={{ position: 'relative' }}>
              <FaUser style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                style={{ width: '100%', padding: '12px 12px 12px 35px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Organization</label>
            <div style={{ position: 'relative' }}>
              <FaBuilding style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <input
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                type="text"
                placeholder="Org/Team"
                style={{ width: '100%', padding: '12px 12px 12px 35px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your campaign goals..."
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', resize: 'none' }}
          />
        </div>

        {/* End Date */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>End Date</label>
          <input
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            type="date"
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
          />
        </div>

        {/* Target Amount */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Target Amount (₱)</label>
          <div style={{ position: 'relative' }}>
            <FaMoneyBillWave style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
            <input
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              type="number"
              placeholder="50000"
              style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
            />
          </div>
        </div>

        {/* Min/Max Donation (Only for Cash and Digital) */}
        {(donationType === 'Cash' || donationType === 'Digital') && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Min Donation</label>
              <input
                name="minAmount"
                value={formData.minAmount}
                onChange={handleChange}
                type="number"
                placeholder="0.00"
                style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Max Donation</label>
              <input
                name="maxAmount"
                value={formData.maxAmount}
                onChange={handleChange}
                type="number"
                placeholder="0.00"
                style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Item Type (Only for Items) */}
        {donationType === 'Items' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Type of Items to Receive</label>
            <input
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
              type="text"
              placeholder="e.g., Canned Goods, Clothes, Books"
              style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
            />
          </div>
        )}

        {/* Donation Type */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Type of Donation</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Cash', 'Digital', 'Items'].map((type) => (
              <button
                key={type}
                onClick={() => setDonationType(type)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 12,
                  border: donationType === type ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.2)',
                  background: donationType === type ? 'rgba(0, 180, 216, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Digital Payment Type (Only for Digital) */}
        {donationType === 'Digital' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Select Payment Platform</label>
            <div style={{ display: 'flex', gap: 15 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="digitalPaymentType"
                    value="GCash"
                    checked={formData.digitalPaymentType === 'GCash'}
                    onChange={handleChange}
                    style={{ marginRight: 8 }}
                  />
                  <span>GCash</span>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="digitalPaymentType"
                    value="PayMaya"
                    checked={formData.digitalPaymentType === 'PayMaya'}
                    onChange={handleChange}
                    style={{ marginRight: 8 }}
                  />
                  <span>PayMaya</span>
                </div>
              </label>
            </div>
            <div style={{ marginTop: 15 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Account Number / Mobile</label>
              <input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                type="number"
                placeholder="09XXXXXXXXX"
                style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Designated Site (Hidden for Digital) */}
        {donationType !== 'Digital' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Designated Donation Site</label>
            <div style={{ position: 'relative' }}>
              <FaMapMarkerAlt style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
              <select
                name="designatedSite"
                value={formData.designatedSite}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: '#002840', color: 'white', outline: 'none' }}
              >
                <option>Main Building Lobby</option>
                <option>Student Center Office</option>
                <option>Library Drop-off</option>
                <option>Gymnasium</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="btn"
          style={{ width: '100%', padding: 15, borderRadius: 30, background: 'var(--accent-color)', color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 20 }}
        >
          {isEditMode ? 'Save Changes' : 'Submit for Approval'}
        </button>

      </div>
    </div>
  );
}
