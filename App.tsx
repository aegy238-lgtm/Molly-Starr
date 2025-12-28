
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { UploadSection } from './components/UploadSection';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientDownload } from './components/ClientDownload';

const LegacyRouteHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fileId = params.get('fileId');

    if (fileId) {
      // تنظيف الرابط أولاً لمنع الدوران
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', cleanUrl);
      
      // التوجيه للمسار الجديد
      navigate(`/file/${fileId}`, { replace: true });
    }
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <LegacyRouteHandler />
      <Layout>
        <Routes>
          <Route path="/" element={<UploadSection />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/file/:id" element={<ClientDownload />} />
          <Route path="*" element={
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800">404 - الصفحة غير موجودة</h2>
              <p className="text-gray-500 mt-2">يرجى التأكد من صحة الرابط</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
