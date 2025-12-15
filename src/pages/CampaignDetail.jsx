import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaBullseye, FaBuilding, FaHandHoldingHeart, FaEdit } from "react-icons/fa";
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Donation Modal State
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [receiptImage, setReceiptImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: '', message: '', onConfirm: null });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDonateSubmit = async () => {
    if (!donateAmount || !receiptImage) {
      setModal({ isOpen: true, type: 'warning', message: 'Please enter amount and upload receipt.' });
      return;
    }

    setSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/api/campaigns/${id}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user._id, amount: donateAmount, receipt: receiptImage })
      });
      // Close donate modal first
      setShowDonateModal(false);
      // Show success modal
      setModal({ isOpen: true, type: 'success', message: 'Donation submitted for verification! The owner will be notified.' });

      setReceiptImage('');
      setDonateAmount('');
      // Reload happens on modal close
    } catch (err) {
      setModal({ isOpen: true, type: 'error', message: "Error donating: " + err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    if (modal.type === 'success') {
      window.location.reload();
    }
    setModal({ ...modal, isOpen: false });
  };

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
      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
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
            {/* Check Ownership */}
            {(() => {
              const isOwner = user?._id === (campaign.user_id?._id || campaign.user_id)?.toString();
              console.log("Debug Owner Check:", {
                currentUserId: user?._id,
                campaignOwnerId: (campaign.user_id?._id || campaign.user_id),
                campaignOwnerIdStr: (campaign.user_id?._id || campaign.user_id)?.toString(),
                isOwner
              });
              return isOwner;
            })() ? (
              <button
                className="btn"
                onClick={() => navigate(`/campaigns/edit/${id}`)}
                style={{ width: '100%', background: 'var(--accent-color)', color: 'white', padding: 16, fontSize: 16, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <FaEdit /> Edit Campaign
              </button>
            ) : (
              <>
                <button
                  className="btn"
                  onClick={() => setShowDonateModal(true)}
                  style={{ flex: 1, background: 'var(--accent-color)', color: 'white', padding: 16, fontSize: 16, borderRadius: 14 }}>
                  {campaign.donation_type === 'Items' ? 'I Want to Donate Items' : 'Donate Now'}
                </button>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: 16, borderRadius: 14, flex: 1 }}>
                  Share
                </button>
              </>
            )}
          </div>

        </div>

        {/* Donor List - Viewed only by Owner */}
        {(() => {
          const isOwner = user?._id === (campaign.user_id?._id || campaign.user_id)?.toString();
          return isOwner && campaign.donations && campaign.donations.length > 0;
        })() && (
            <div style={{ marginTop: 30, background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 16 }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: 18 }}>Recent Donations</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {campaign.donations.map((donation, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundImage: `url(${donation.user_id?.profile_picture || '/assets/default_avatar.png'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold' }}>{donation.user_id?.name || 'Anonymous'}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                        {new Date(donation.date).toLocaleDateString()} • <span style={{ color: donation.status === 'verified' ? '#28a745' : '#ffc107', textTransform: 'capitalize' }}>{donation.status || 'Pending'}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>
                        {donation.amount ? `₱${donation.amount.toLocaleString()}` : (donation.item_type || 'Item')}
                      </div>
                      {donation.receipt && (
                        <button
                          onClick={() => {
                            const newWindow = window.open();
                            newWindow.document.write('<img src="' + donation.receipt + '" style="max-width:100%;" />');
                          }}
                          style={{ fontSize: 11, color: 'skyblue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: 10 }}
                        >
                          View Receipt
                        </button>
                      )}
                      {donation.status !== 'verified' && (
                        <button
                          onClick={() => {
                            setModal({
                              isOpen: true,
                              type: 'success', // Green standard
                              message: "Approve this donation? This will add the amount to your raised total.",
                              onConfirm: async () => {
                                try {
                                  await fetch(`${API_BASE_URL}/api/campaigns/${id}/donations/${donation._id}/verify`, {
                                    method: 'PUT'
                                  });
                                  setModal({ isOpen: true, type: 'success', message: 'Donation Approved!', onConfirm: null });
                                  // Reload will happen when this success modal is closed
                                } catch (err) {
                                  setModal({ isOpen: true, type: 'error', message: "Error verifying donation", onConfirm: null });
                                }
                              }
                            });
                          }}
                          style={{
                            background: 'var(--accent-color)',
                            color: 'white',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 11
                          }}
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Expense/Donation Modal */}
      {
        showDonateModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
          }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: 30, background: '#002840' }}>
              <h3 style={{ marginTop: 0 }}>Donate via GCash</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                Send {campaign.digital_payment_type} to <strong>{campaign.account_number}</strong><br />
                Then upload your screenshot below.
              </p>

              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5, fontSize: 14 }}>Amount (₱)</label>
                <input
                  type="number"
                  value={donateAmount}
                  onChange={e => setDonateAmount(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: 'none' }}
                  placeholder="Ex. 1000"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 5, fontSize: 14 }}>Receipt Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ width: '100%', fontSize: 14 }}
                />
                {receiptImage && (
                  <img src={receiptImage} alt="Preview" style={{ width: '100%', marginTop: 10, borderRadius: 8, maxHeight: 150, objectFit: 'contain' }} />
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDonateSubmit}
                  disabled={submitting}
                  className="btn"
                  style={{ flex: 1, background: 'var(--accent-color)', color: 'white' }}>
                  {submitting ? 'Submitting...' : 'Submit Donation'}
                </button>
                <button
                  onClick={() => setShowDonateModal(false)}
                  className="btn"
                  style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
