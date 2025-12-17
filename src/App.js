import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";

// Public Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import UploadPhoto from "./pages/UploadPhoto";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CampaignDetail from "./pages/CampaignDetail";
import CreateCampaign from "./pages/CreateCampaign";
import CreateSelection from "./pages/CreateSelection";
import AddRequest from "./pages/AddRequest";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import FriendsList from "./pages/FriendsList";
import RequestDetail from "./pages/RequestDetail";
import Splash from "./pages/Splash";
import Notifications from "./pages/Notifications";
import BottomNav from "./components/BottomNav";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCampaignView from "./pages/admin/AdminCampaignView"; // Import
import CampaignApproval from "./pages/admin/CampaignApproval";
import UserManagement from "./pages/admin/UserManagement";
import ReportsManagement from "./pages/admin/ReportsManagement";
import BroadcastAnnouncements from "./pages/admin/BroadcastAnnouncements";
// import RequestMonitoring from "./pages/admin/RequestMonitoring"; // If created
// import OrganizationVerification from "./pages/admin/OrganizationVerification"; // If created
import RequestMonitoring from "./pages/admin/RequestMonitoring";
import OrganizationVerification from "./pages/admin/OrganizationVerification";
import AdminProfile from "./pages/admin/AdminProfile";


function AppContent() {
  const location = useLocation();
  // Hide nav on admin routes too
  const hideNavRoutes = ['/', '/login', '/signup', '/upload-photo'];
  const showNav = !hideNavRoutes.includes(location.pathname)
    && !location.pathname.startsWith('/community/post/')
    && !location.pathname.startsWith('/admin');

  return (
    <div className="app">
      <main className="main">
        <Routes>
          {/* Public / Student Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload-photo" element={<UploadPhoto />} />

          {/* Protected Student Routes (technically should wrap in ProtectedRoute too, but allowedRoles=all or student) */}
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/campaigns" element={<Explore />} /> {/* Keep legacy for now or remove? User wants replacement. Let's redirect or just use component */}
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/create" element={<CreateSelection />} />
          <Route path="/create/campaign" element={<CreateCampaign />} />
          <Route path="/create/request" element={<AddRequest />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/campaigns/edit/:id" element={<CreateCampaign />} />
          <Route path="/requests/edit/:id" element={<AddRequest />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/post/:id" element={<PostDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/friends" element={<FriendsList />} />

          <Route path="/notifications" element={<Notifications />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'faculty']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="campaigns" element={<CampaignApproval />} />
              <Route path="campaigns/:id" element={<AdminCampaignView />} /> {/* New Route */}
              <Route path="users" element={<UserManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="reports" element={<ReportsManagement />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="announcements" element={<BroadcastAnnouncements />} />
              <Route path="requests" element={<RequestMonitoring />} />
              <Route path="organizations" element={<OrganizationVerification />} />
              {/* Redirect root /admin to dashboard */}
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route>

        </Routes>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}



export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
