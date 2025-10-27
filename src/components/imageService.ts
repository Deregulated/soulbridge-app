// src/services/imageService.ts
import { supabase } from './supabase';

export const imageService = {
  async uploadImage(file: File, folder: 'home' | 'about'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('website-images')
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('website-images')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  async getImages(folder: 'home' | 'about'): Promise<string[]> {
    const { data, error } = await supabase.storage
      .from('website-images')
      .list(folder);

    if (error) throw error;

    const imageUrls = data.map(item => 
      supabase.storage
        .from('website-images')
        .getPublicUrl(`${folder}/${item.name}`).data.publicUrl
    );

    return imageUrls;
  },

  async setActiveImage(folder: 'home' | 'about', imageUrl: string): Promise<void> {
    const { error } = await supabase
      .from('website_settings')
      .upsert({ 
        key: `active_${folder}_image`,
        value: imageUrl 
      });

    if (error) throw error;
  },

  async getActiveImage(folder: 'home' | 'about'): Promise<string | null> {
    const { data, error } = await supabase
      .from('website_settings')
      .select('value')
      .eq('key', `active_${folder}_image`)
      .single();

    if (error) return null;
    return data?.value || null;
  }
};