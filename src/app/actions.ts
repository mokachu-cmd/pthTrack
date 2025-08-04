'use server'

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const reportSchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  image: z.string(), // Changed from z.instanceof(File) to z.string()
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
    // We are now storing the image as a Base64 data URI directly in Firestore
    await addDoc(collection(db, "potholes"), { 
      imageUrl: image, // This is now the data URI
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude), 
      reportedAt: serverTimestamp() 
    });

    console.log('Report uploaded successfully:', {
      imageUrl: 'Data URI stored',
      latitude,
      longitude,
    });

    return { success: true };
  } catch (error) {
    console.error('Firebase upload failed:', error);
    return { error: 'Failed to submit report to Firebase.' };
  }
}
