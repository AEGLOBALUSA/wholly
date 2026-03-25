/**
 * WHOLLY — Photo Service
 *
 * Handles photo upload, deletion, and URL generation via Supabase Storage.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BUCKET = 'profile-photos';
const MAX_PHOTOS = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload a photo to Supabase Storage
 */
export async function uploadPhoto(
  userId: string,
  fileUri: string,
  fileName: string,
): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const path = `${userId}/${Date.now()}-${fileName}`;

  // Fetch the file as blob
  const response = await fetch(fileUri);
  const blob = await response.blob();

  if (blob.size > MAX_FILE_SIZE) {
    console.error('File too large. Max 5MB.');
    return null;
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading photo:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

/**
 * Delete a photo from Supabase Storage
 */
export async function deletePhoto(photoUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  // Extract path from URL
  const url = new URL(photoUrl);
  const pathParts = url.pathname.split(`/storage/v1/object/public/${BUCKET}/`);
  if (pathParts.length < 2) return false;

  const filePath = pathParts[1];

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting photo:', error);
    return false;
  }

  return true;
}

/**
 * Get the public URL for a stored photo path
 */
export function getPhotoUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Update profile photos array
 */
export async function updateProfilePhotos(
  profileId: string,
  photos: string[],
): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  const trimmed = photos.slice(0, MAX_PHOTOS);

  const { error } = await supabase
    .from('profiles')
    .update({
      photos: trimmed,
      photo_url: trimmed[0] || null,
    })
    .eq('id', profileId);

  if (error) {
    console.error('Error updating photos:', error);
    return false;
  }

  return true;
}

export { MAX_PHOTOS, MAX_FILE_SIZE };
