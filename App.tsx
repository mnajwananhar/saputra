import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import HistoricalData from './pages/HistoricalData';
import PurchasePlan from './pages/PurchasePlan';
import ProductManagement from './pages/ProductManagement';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Semua route di bawah ini diproteksi */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout><Dashboard /></Layout>} path="/" />
          <Route element={<Layout><PurchasePlan /></Layout>} path="/plan" />
          <Route element={<Layout><ProductManagement /></Layout>} path="/products" />
          <Route element={<Layout><Forecast /></Layout>} path="/forecast" />
          <Route element={<Layout><HistoricalData /></Layout>} path="/data" />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;