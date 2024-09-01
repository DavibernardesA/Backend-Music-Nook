import { ImageValidator } from '../../domain/services/imageValidator';
import { S3Service } from '../../infraestructure/aws/S3Service';
import logger from '../config/logs/logger';
import { BadRequestException } from '../exceptions/BadRequestException';

export class ImageModerationService {
  private s3Service: S3Service;
  private imageValidator: ImageValidator;

  constructor(bucketName: string) {
    this.s3Service = new S3Service(bucketName);
    this.imageValidator = new ImageValidator();
  }

  public async handleFileUpload(file: Express.Multer.File | undefined, username: string, existingAvatar?: string): Promise<string | undefined> {
    if (!file) return;

    const isValid = await this.imageValidator.isValid(file.buffer);
    if (!isValid) {
      logger.warn(`User with the username: [${username}] tried to upload an inappropriate image.`);
      throw new BadRequestException(
        'The image likely contains inappropriate content. If you believe this is a mistake, please contact the moderators.'
      );
    }

    if (existingAvatar) await this.s3Service.deleteFile({ imageUrl: existingAvatar, path: 'users/profile' });

    return await this.s3Service.uploadFile({ folder: 'users/profile', file, username });
  }
}
