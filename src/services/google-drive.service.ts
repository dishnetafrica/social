import { google } from 'googleapis';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class GoogleDriveService {
  async archiveFile(fileName: string, publicUrl: string): Promise<void> {
    if (!env.GOOGLE_DRIVE_CLIENT_EMAIL || !env.GOOGLE_DRIVE_PRIVATE_KEY || !env.GOOGLE_DRIVE_FOLDER_ID) {
      logger.info('Google Drive archive skipped due to missing credentials', { fileName, publicUrl });
      return;
    }

    const auth = new google.auth.JWT({
      email: env.GOOGLE_DRIVE_CLIENT_EMAIL,
      key: env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    const drive = google.drive({ version: 'v3', auth });
    await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'application/vnd.google-apps.shortcut',
        parents: [env.GOOGLE_DRIVE_FOLDER_ID],
        shortcutDetails: { targetId: publicUrl }
      }
    });
  }
}
