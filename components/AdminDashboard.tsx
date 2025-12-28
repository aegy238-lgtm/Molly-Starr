
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { FileRecord } from '../types';

export const AdminDashboard: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await storageService.getFiles();
      setFiles(data);
    } catch (err) {
      console.error("Database connection error:", err);
      setError("حدث خطأ أثناء الاتصال بقاعدة البيانات. تأكد من إعدادات Firebase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFiles();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // بيانات الدخول الافتراضية التي طلبتها
    const ADMIN_EMAIL = 'admin@cloud.com';
    const ADMIN_PASS = 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  const handleDelete = async (file: FileRecord) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف نهائياً من السحابة؟')) {
      try {
        await storageService.deleteFile(file.id, file.storagePath);
        loadFiles();
      } catch (err) {
        alert("فشل حذف الملف. تأكد من الصلاحيات.");
      }
    }
  };

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/#/file/${id}`;
    navigator.clipboard.writeText(url);
    alert('تم نسخ الرابط بنجاح!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-center text-white">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">دخول لوحة التحكم</h2>
            <p className="text-blue-100 mt-1 text-sm">قم بتسجيل الدخول لإدارة ملفاتك السحابية</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 animate-shake">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 mr-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                placeholder="admin@cloud.com"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 mr-1">كلمة المرور</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
            >
              تسجيل الدخول
            </button>
          </form>
          <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">نظام مشفر ومحمي بالكامل سحابياً</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">إدارة الملفات</h2>
          <p className="text-gray-500">لديك {files.length} ملف مخزن في السحابة حالياً</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={loadFiles} 
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            تحديث البيانات
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {loading && files.length === 0 ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">جاري المزامنة مع Firestore...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 font-bold text-lg">لا توجد ملفات مرفوعة بعد</p>
            <p className="text-gray-400 mt-1">ابدأ برفع ملف من الصفحة الرئيسية ليظهر هنا</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">الملف</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">تاريخ الرفع</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">التحميلات</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-600 text-sm">{file.uploadDate}</td>
                    <td className="px-8 py-5 text-center">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black border border-blue-100">
                        {file.downloadCount}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => copyToClipboard(file.id)} 
                          className="bg-gray-100 hover:bg-blue-600 hover:text-white p-2.5 rounded-xl transition-all"
                          title="نسخ رابط التحميل"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(file)} 
                          className="bg-gray-100 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-all"
                          title="حذف الملف"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
