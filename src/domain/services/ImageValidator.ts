import { RekognitionClient, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition';
import { env } from '../../application/config/env/env';

export class ImageValidator {
  private rekognitionClient: RekognitionClient;

  constructor() {
    this.rekognitionClient = new RekognitionClient({ region: env.AWS_REGION });
  }

  public async isValid(buffer: Buffer): Promise<boolean> {
    const command = new DetectModerationLabelsCommand({
      Image: { Bytes: buffer },
      MinConfidence: 80
    });

    const response = await this.rekognitionClient.send(command);
    const moderationLabels = response.ModerationLabels || [];

    return !moderationLabels.some(label => {
      const labelName = label.Name ?? '';
      return ['Explicit Nudity', 'Violence'].includes(labelName);
    });
  }
}
