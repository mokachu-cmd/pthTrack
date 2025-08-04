'use server'

import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const reportSchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  image: z.instanceof(File),
});

export async function uploadPotholeReport(formData: FormData) {
  const rawFormData = {
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    image: formData.get('image'),
  };

  const parsed = reportSchema.safeParse(rawFormData);

  if (!parsed.success) {
    console.error('Validation failed:', parsed.error);
    return { error: 'Invalid data provided.' };
  }

  const { image, latitude, longitude } = parsed.data;

  try {
    const storageRef = ref(storage, `potholes/${Date.now()}_${image.name}`);
    
    // Convert File to ArrayBuffer for upload
    const imageBuffer = await image.arrayBuffer();
    const uploadTask = await uploadBytes(storageRef, imageBuffer, {
      contentType: image.type,
    });
    
    const imageUrl = await getDownloadURL(uploadTask.ref);

    await addDoc(collection(db, "potholes"), { 
      imageUrl, 
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude), 
      reportedAt: serverTimestamp() 
    });

    console.log('Report uploaded successfully:', {
      imageUrl,
      latitude,
      longitude,
    });

    return { success: true };
  } catch (error) {
    console.error('Firebase upload failed:', error);
    return { error: 'Failed to submit report to Firebase.' };
  }
}
