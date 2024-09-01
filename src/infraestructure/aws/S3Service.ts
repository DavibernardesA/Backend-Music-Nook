import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from './S3Client';
import { InvalidFormatError } from '../../application/exceptions/users/InvalidFormatError';

interface UploadOptions {
  folder: string;
  file: Express.Multer.File;
  username: string;
}

interface DeleteOptions {
  imageUrl: string;
  path: string;
}

export class S3Service {
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  public async uploadFile({ folder, file, username }: UploadOptions): Promise<string> {
    const fileName = `${username}-${file.originalname}`;
    const params = {
      Bucket: this.bucketName,
      Key: `${folder}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };
    const command = new PutObjectCommand(params);

    await s3Client.send(command);
    return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`;
  }

  public async deleteFile({ imageUrl, path }: DeleteOptions): Promise<void> {
    const fileName = this.extractFileName(imageUrl);
    const params = {
      Bucket: this.bucketName,
      Key: `${path}/${fileName}`
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  }

  private extractFileName(imageUrl: string): string {
    const lastSlashIndex = imageUrl.lastIndexOf('/');
    if (lastSlashIndex === -1) {
      throw new InvalidFormatError('Invalid image URL.');
    }
    return imageUrl.substring(lastSlashIndex + 1);
  }
}
