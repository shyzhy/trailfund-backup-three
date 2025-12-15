import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { FaClipboardList, FaUsers, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        pendingCampaigns: 0,
        totalUsers: 0,
        reports: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [campaignsRes, usersRes, reportsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/campaigns/admin/pending`),
                    fetch(`${API_BASE_URL}/api/users/admin/all`),
                    fetch(`${API_BASE_URL}/api/reports`)
                ]);

                const campaigns = await campaignsRes.json();
                const users = await usersRes.json();
                const reports = await reportsRes.json();

                setStats({
                    pendingCampaigns: Array.isArray(campaigns) ? campaigns.length : 0,
                    totalUsers: Array.isArray(users) ? users.length : 0,
                    reports: Array.isArray(reports) ? reports.length : 0
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, count, icon, color }) => (
        <div className="glass-card" style={{
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            margin: '0 10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: `${color}20`, color: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginRight: 20
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{title}</div>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>{count}</div>
            </div>
        </div>
    );

    return (
        <div>
            <h1 style={{ marginBottom: 30, color: 'white' }}>Admin Dashboard</h1>
            <div style={{ display: 'flex', margin: '0 -10px' }}>
                <StatCard
                    title="Pending Campaigns"
                    count={stats.pendingCampaigns}
                    icon={<FaClipboardList />}
                    color="#FFD700"
                />
                <StatCard
                    title="Total Users"
                    count={stats.totalUsers}
                    icon={<FaUsers />}
                    color="#4CAF50"
                />
                <StatCard
                    title="Active Reports"
                    count={stats.reports}
                    icon={<FaExclamationTriangle />}
                    color="#FF6B6B"
                />
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div style={{ marginTop: 40 }}>
                <h3 style={{ color: 'white' }}>Welcome to the Admin Control Panel</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Use the sidebar to navigate between modules. You can approve pending campaigns,
                    manage users, and handle reports from here. Admin tools are designed to work seamlessly with the student feed.
                </p>
            </div>
        </div>
    );
}
