'use server'

import { z } from 'zod';

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

  // In a real application, you would upload the image to Firebase Storage
  // and then save the image URL and location to Firestore or Realtime Database.
  // For example:
  // const storageRef = ref(storage, `potholes/${Date.now()}_${image.name}`);
  // const uploadTask = await uploadBytes(storageRef, image);
  // const imageUrl = await getDownloadURL(uploadTask.ref);
  // await addDoc(collection(db, "potholes"), { imageUrl, latitude, longitude, reportedAt: serverTimestamp() });

  console.log('Simulating upload for:', {
    fileName: image.name,
    fileSize: image.size,
    latitude,
    longitude,
  });

  // Simulate network delay for the upload process
  await new Promise(res => setTimeout(res, 1500));

  return { success: true };
}
