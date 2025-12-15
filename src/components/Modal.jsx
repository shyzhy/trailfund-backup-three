import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const Modal = ({ isOpen, type, message, onClose }) => {
    if (!isOpen) return null;

    let icon;
    let title;
    let color;

    switch (type) {
        case 'success':
            icon = <FaCheckCircle size={50} color="#4ADE80" />;
            title = 'Success!';
            color = '#4ADE80';
            break;
        case 'pending':
            icon = <FaSpinner size={50} color="#00B4D8" className="spin" />;
            title = 'Processing...';
            color = '#00B4D8';
            break;
        case 'error':
            icon = <FaTimesCircle size={50} color="#FF6B6B" />;
            title = 'Error';
            color = '#FF6B6B';
            break;
        case 'warning':
            icon = <FaExclamationCircle size={50} color="#FFD166" />;
            title = 'Missing Info';
            color = '#FFD166';
            break;
        default:
            icon = null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-card" style={{
                padding: 30,
                textAlign: 'center',
                maxWidth: 300,
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 15,
                background: 'rgba(0, 59, 92, 0.95)', // Dark teal theme
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
                animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <div style={{ animation: type === 'pending' ? 'spin 1s linear infinite' : 'none' }}>
                    {icon}
                </div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: 'white' }}>{title}</h2>
                <p style={{ margin: 0, fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                    {message}
                </p>

                {type !== 'pending' && (
                    <button
                        onClick={onClose}
                        className="btn"
                        style={{
                            background: color,
                            color: type === 'warning' ? '#333' : 'white',
                            width: '100%',
                            marginTop: 10
                        }}
                    >
                        Okay
                    </button>
                )}
            </div>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default Modal;
