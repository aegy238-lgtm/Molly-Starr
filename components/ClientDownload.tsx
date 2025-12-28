
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { FileRecord } from '../types';

export const ClientDownload: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<FileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let interval: any;
    
    const checkFile = async () => {
      if (id) {
        const data = await storageService.getFileById(id);
        if (data) {
          setFile(data);
          setLoading(false);
          setIsSyncing(false);
          if (interval) clearInterval(interval);
        } else {
          // إذا لم يجد الملف، قد يكون ما زال يرفع في الخلفية
          setIsSyncing(true);
          setLoading(false);
        }
      }
    };

    checkFile();

    // محاولة الفحص كل 3 ثواني إذا كان الملف "قيد المزامنة"
    interval = setInterval(() => {
      if (isSyncing) checkFile();
    }, 3000);

    return () => clearInterval(interval);
  }, [id, isSyncing]);

  const handleDownload = async () => {
    if (!file || !id) return;
    await storageService.incrementDownload(id);
    window.open(file.downloadUrl, '_blank');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500 animate-pulse">جاري فحص حالة الرابط...</p>
    </div>
  );

  if (isSyncing) {
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-xl text-center border border-blue-50">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-blue-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">الملف قيد الوصول!</h2>
        <p className="text-gray-500 mb-6">يقوم المرسل الآن برفع الملف إلى السحابة.. ستظهر لك صفحة التنزيل تلقائياً فور اكتماله.</p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
          <span className="text-sm font-bold text-blue-600">انتظار المزامنة الحية...</span>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-2xl shadow-xl text-center border border-red-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">عفواً! الرابط غير صالح</h2>
        <p className="text-gray-500 mb-8">ربما تم حذف الملف أو انتهت صلاحيته.</p>
        <Link to="/" className="text-blue-600 hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-center text-white">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl inline-block mb-4 shadow-lg">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-2xl font-bold break-words">{file.name}</h2>
          <p className="text-blue-100 mt-2">الملف جاهز للتنزيل الآن</p>
        </div>
        <div className="p-8 md:p-12">
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-4">
            <div className="flex justify-between"><span>الحجم:</span> <span className="font-bold">{(file.size / (1024*1024)).toFixed(2)} MB</span></div>
            <div className="flex justify-between"><span>التاريخ:</span> <span className="font-bold">{file.uploadDate}</span></div>
          </div>
          <button onClick={handleDownload} className="w-full py-5 bg-blue-600 text-white rounded-2xl text-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3">
             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             تنزيل الملف
          </button>
        </div>
      </div>
    </div>
  );
};
