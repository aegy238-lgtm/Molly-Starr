
import { db, storage } from './firebase';
import { 
  collection, 
  setDoc,
  doc, 
  getDoc, 
  getDocs,
  deleteDoc, 
  updateDoc, 
  increment,
  query,
  orderBy
} from "firebase/firestore";
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { FileRecord } from '../types';

const COLLECTION_NAME = "files";

export const storageService = {
  getFiles: async (): Promise<FileRecord[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("uploadDate", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FileRecord[];
    } catch (e) {
      console.error("Error getting documents: ", e);
      return [];
    }
  },

  // وظيفة جديدة للرفع في الخلفية مع مراقبة التقدم
  uploadFileWithProgress: (
    file: File, 
    fileId: string,
    onProgress: (progress: number) => void,
    onComplete: (record: FileRecord) => void,
    onError: (error: any) => void
  ) => {
    const storagePath = `uploads/${fileId}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      }, 
      (error) => {
        console.error("Upload error:", error);
        onError(error);
      }, 
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        const fileData: Omit<FileRecord, 'id'> = {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toLocaleString('ar-SA'),
          downloadCount: 0,
          downloadUrl: downloadUrl,
          storagePath: storagePath
        };

        // حفظ البيانات في Firestore باستخدام المعرف الذي تم إنشاؤه مسبقاً
        await setDoc(doc(db, COLLECTION_NAME, fileId), fileData);
        onComplete({ id: fileId, ...fileData });
      }
    );

    return uploadTask;
  },

  deleteFile: async (id: string, storagePath: string): Promise<void> => {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
      console.error("Error deleting file: ", e);
    }
  },

  getFileById: async (id: string): Promise<FileRecord | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FileRecord;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  incrementDownload: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        downloadCount: increment(1)
      });
    } catch (e) {
      console.error("Error incrementing download: ", e);
    }
  }
};
