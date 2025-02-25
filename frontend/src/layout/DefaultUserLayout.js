import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppFooter, AppHeader, AppSidebar} from '../components/index';
import UserDashboard from '../views/user/UserDashboard';

const DefaultUserLayout = () => {
  return (
    <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
            <Routes>
            {/* Redirect otomatis dari /user ke /user/dashboard */}
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<UserDashboard />} />
            </Routes>
        </div>
        <AppFooter />
        </div>
    </div>
  );
};

export default DefaultUserLayout;
