import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaPlusCircle, FaCompass, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const location = useLocation();
    const path = location.pathname;

    const isActive = (p) => path === p;

    const navItemVariants = {
        tap: { scale: 0.8 },
        hover: { scale: 1.1 }
    };

    return (
        <div className="glass-card" style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            right: 20,
            height: 65,
            borderRadius: 35,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 10px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)'
        }}>
            <Link to="/home" style={{ color: isActive('/home') ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                <motion.div
                    variants={navItemVariants}
                    whileTap="tap"
                    whileHover="hover"
                    style={{
                        padding: 12,
                        background: isActive('/home') ? 'rgba(255,255,255,0.2)' : 'transparent',
                        borderRadius: '50%',
                        transition: 'background 0.3s ease', // Keep background transition separate
                        boxShadow: isActive('/home') ? '0 0 15px rgba(255,255,255,0.3)' : 'none'
                    }}
                >
                    <FaHome size={24} />
                </motion.div>
            </Link>

            <Link to="/community" style={{ color: isActive('/community') ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                <motion.div
                    variants={navItemVariants}
                    whileTap="tap"
                    whileHover="hover"
                    style={{
                        padding: 12,
                        background: isActive('/community') ? 'rgba(255,255,255,0.2)' : 'transparent',
                        borderRadius: '50%',
                        transition: 'background 0.3s ease',
                        boxShadow: isActive('/community') ? '0 0 15px rgba(255,255,255,0.3)' : 'none'
                    }}
                >
                    <FaUsers size={24} />
                </motion.div>
            </Link>

            <Link to="/create" style={{ color: isActive('/create') ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                <motion.div
                    variants={navItemVariants}
                    whileTap="tap"
                    whileHover="hover"
                    style={{
                        background: '#00B4D8',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: -24,
                        boxShadow: '0 4px 12px rgba(0, 180, 216, 0.5)',
                        border: '4px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <FaPlusCircle size={24} color="white" />
                </motion.div>
            </Link>

            <Link to="/campaigns" style={{ color: isActive('/campaigns') ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                <motion.div
                    variants={navItemVariants}
                    whileTap="tap"
                    whileHover="hover"
                    style={{
                        padding: 12,
                        background: isActive('/campaigns') ? 'rgba(255,255,255,0.2)' : 'transparent',
                        borderRadius: '50%',
                        transition: 'background 0.3s ease',
                        boxShadow: isActive('/campaigns') ? '0 0 15px rgba(255,255,255,0.3)' : 'none'
                    }}
                >
                    <FaCompass size={24} />
                </motion.div>
            </Link>

            <Link to="/profile" style={{ color: isActive('/profile') ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                <motion.div
                    variants={navItemVariants}
                    whileTap="tap"
                    whileHover="hover"
                    style={{
                        padding: 12,
                        background: isActive('/profile') ? 'rgba(255,255,255,0.2)' : 'transparent',
                        borderRadius: '50%',
                        transition: 'background 0.3s ease',
                        boxShadow: isActive('/profile') ? '0 0 15px rgba(255,255,255,0.3)' : 'none'
                    }}
                >
                    <FaUser size={24} />
                </motion.div>
            </Link>
        </div>
    );
}
