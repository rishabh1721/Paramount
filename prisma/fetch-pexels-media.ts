import { env } from '@/lib/env';
import { createClient } from 'pexels';

const PEXELS_API_KEY = env.PEXELS_API_KEY || 'YOUR_API_KEY';
const client = createClient(PEXELS_API_KEY);

export async function fetchPexelsImages(count: number = 20) {
  try {
    const response = await client.photos.search({ 
      query: 'technology computer education', 
      per_page: count 
    });

    if ('photos' in response) {
      return response.photos.map(photo => photo.src.large);
    }
    return [];
  } catch (error) {
    console.error('Error fetching Pexels images:', error);
    return [];
  }
}

export async function fetchPexelsVideos(count: number = 20) {
  try {
    const response = await client.videos.search({ 
      query: 'education learning technology', 
      per_page: count 
    });

    if ('videos' in response) {
      return response.videos.map(video => 
        video.video_files.find(file => file.quality === 'hd')?.link || 
        video.video_files[0].link
      );
    }
    return [];
  } catch (error) {
    console.error('Error fetching Pexels videos:', error);
    return [];
  }
}
