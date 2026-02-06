import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../../config/cloudinary.config';

export const CloudinaryInterceptor = (folder: string) => ({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    } as any,
  }),
});
