
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { FileRecord } from '../types';

export const UploadSection: React.FC = () => {
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [lastFileName, setLastFileName] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // حد أقصى افتراضي 100 ميجابايت
    if (file.size > 100 * 1024 * 1024) { 
      alert("الملف كبير جداً! الحد الأقصى هو 100 ميجابايت.");
      return;
    }

    // 1. توليد ID فوراً لإظهار الرابط في أقل من ثانية
    const fileId = Math.random().toString(36).substr(2, 9);
    setUploadedFileId(fileId);
    setLastFileName(file.name);

    // 2. بدء الرفع في الخلفية "صمت تام" دون أي مؤشرات بصرية
    storageService.uploadFileWithProgress(
      file,
      fileId,
      () => {}, // لا نحتاج لتحديث النسبة المئوية للمستخدم
      () => {
        // اكتمل في صمت
        console.log(`File ${fileId} synced to cloud.`);
      },
      (error) => {
        console.error("Background sync failed:", error);
      }
    );

    // تفريغ المدخل
    e.target.value = '';
  };

  const getFileUrl = (id: string) => `${window.location.origin}/#/file/${id}`;

  const copyUrl = (id: string) => {
    navigator.clipboard.writeText(getFileUrl(id));
    alert('تم نسخ الرابط! يمكنك إرساله الآن.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center relative">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        مشاركة ملفات <span className="text-blue-600">فورية</span>
      </h1>
      <p className="text-gray-600 mb-10 text-lg">ارفع ملفك واحصل على الرابط في لمح البصر.</p>
      
      {!uploadedFileId ? (
        <div className="relative group bg-white border-2 border-dashed border-gray-300 rounded-3xl p-16 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
          <input 
            type="file" 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <div className="flex flex-col items-center">
            <div className="bg-blue-50 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">اسحب الملف هنا للبدء</h3>
            <p className="text-gray-500 mt-2">سيتوفر الرابط للمشاركة فور اختيارك للملف</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-blue-100 rounded-3xl p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">تم إنشاء الرابط!</h3>
          <p className="text-gray-500 mb-8 font-medium italic">ملف: {lastFileName}</p>
          
          <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 mb-8 border border-gray-100">
            <input 
              type="text" 
              readOnly 
              value={getFileUrl(uploadedFileId)} 
              className="bg-transparent flex-grow text-gray-600 font-mono text-sm outline-none px-2 text-left"
              dir="ltr"
            />
            <button 
              onClick={() => copyUrl(uploadedFileId)} 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md shrink-0"
            >
              نسخ
            </button>
          </div>
          
          <button 
            onClick={() => setUploadedFileId(null)} 
            className="text-blue-600 font-bold hover:underline transition-all"
          >
            + رفع ملف آخر
          </button>
        </div>
      )}
    </div>
  );
};
