import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBullhorn, FaHandHoldingHeart, FaArrowLeft } from 'react-icons/fa';

export default function CreateSelection() {
    const navigate = useNavigate();

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
                <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                <h2 style={{ margin: 0, fontSize: 24 }}>Create New</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Start a Campaign Option */}
                <Link to="/create/campaign" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{
                        padding: 30,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'rgba(74, 222, 128, 0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid #4ADE80'
                        }}>
                            <FaBullhorn size={28} color="#4ADE80" />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: 18, color: 'white' }}>Start a Campaign</h3>
                            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                                Raise funds for a cause, event, or project.
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Request Donation Option */}
                <Link to="/create/request" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{
                        padding: 30,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'rgba(0, 180, 216, 0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid #00B4D8'
                        }}>
                            <FaHandHoldingHeart size={28} color="#00B4D8" />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: 18, color: 'white' }}>Request Donation</h3>
                            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                                Ask for help for yourself or others in need.
                            </p>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
