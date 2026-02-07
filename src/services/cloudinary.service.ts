import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

export class CloudinaryService {
  async uploadMedia(filePath: string, folder: string): Promise<string> {
    const result = await cloudinary.uploader.upload(filePath, { folder, resource_type: 'auto' });
    return result.secure_url;
  }

  async transformImage(sourceUrl: string, width: number, height: number): Promise<string> {
    return cloudinary.url(sourceUrl, {
      secure: true,
      transformation: [{ width, height, crop: 'fill', gravity: 'auto' }]
    });
  }
}
