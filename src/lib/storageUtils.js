import { supabase } from './supabaseClient';

const BUCKET_NAME = 'media';

/**
 * Upload a file to Supabase storage
 * @param {File} file - The file to upload
 * @param {string} path - The path where the file should be stored (e.g., 'projects/image.jpg')
 * @returns {Promise<{url: string, error: null} | {url: null, error: Error}>}
 */
export async function uploadFile(file, path) {
  try {
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true // Replace if file exists
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: null, error };
  }
}

/**
 * Get public URL for a file
 * @param {string} path - The file path
 * @returns {string}
 */
export function getPublicUrl(path) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Delete a file from storage
 * @param {string} path - The file path to delete
 * @returns {Promise<{success: boolean, error: null} | {success: false, error: Error}>}
 */
export async function deleteFile(path) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error };
  }
}

/**
 * List files in a folder
 * @param {string} folder - Folder path (optional)
 * @returns {Promise<Array>}
 */
export async function listFiles(folder = '') {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
}
