import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

export default function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--primary-bg)',
            color: 'white'
        }}>
            <div style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
                overflow: 'hidden',
                padding: 20
            }}>
                <img src="/assets/logo.png" alt="TrailFund Logo" style={{ width: '150%', height: '150%', objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>TrailFund</h1>
        </div>
    );
}
