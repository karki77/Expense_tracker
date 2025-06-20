import fs from 'fs';
import path from 'path';

export class ImageHandler {
  private readonly uploadsPath = path.resolve(process.cwd(), 'uploads');
  /**
   * Delete old image file if it exists
   */
  async deleteOldImage(imageFileName: string): Promise<void> {
    if (!imageFileName || imageFileName.trim() === '') return;

    const imagePath = path.join(this.uploadsPath, imageFileName);

    try {
      await fs.promises.unlink(imagePath);
      console.log(`Old image deleted: ${imageFileName}`);
    } catch (error) {
      console.warn(`Could not delete old image: ${imageFileName}`, error);
      // don't throw -- continue even if old image deletion fails
    }
  }

  /**
   * Handles profile image updates -- deletes the old one and returns the new filename
   */
  async updateProfileImage(
    newFile?: Express.Multer.File,
    oldImageFilename?: string,
  ): Promise<string | undefined> {
    if (!newFile) {
      return undefined; // no new image to update
    }

    // Delete old image if exists
    if (oldImageFilename) {
      await this.deleteOldImage(oldImageFilename);
    }
    //return new image filename
    return newFile.filename;
  }
}

export const imageHandler = new ImageHandler();
