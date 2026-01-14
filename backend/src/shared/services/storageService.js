const AWS = require('aws-sdk');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs').promises;
const path = require('path');
const StorageConfig = require('../../modules/content/StorageConfig');

class StorageService {
    constructor() {
        this.config = null;
        this.s3 = null;
        this.gcs = null;
    }

    async initialize() {
        try {
            // Get active storage configuration
            this.config = await StorageConfig.findOne({ isActive: true });

            if (!this.config) {
                // Default to local storage
                this.config = {
                    provider: 'local',
                    config: {
                        local: {
                            uploadPath: './uploads'
                        }
                    }
                };
            }

            // Initialize provider-specific clients
            if (this.config.provider === 'aws' && this.config.config.aws) {
                this.s3 = new AWS.S3({
                    accessKeyId: this.config.config.aws.accessKeyId,
                    secretAccessKey: this.config.config.aws.secretAccessKey,
                    region: this.config.config.aws.region
                });
            } else if (this.config.provider === 'gcloud' && this.config.config.gcloud) {
                this.gcs = new Storage({
                    projectId: this.config.config.gcloud.projectId,
                    keyFilename: this.config.config.gcloud.keyFilename
                });
            }
        } catch (error) {
            console.error('Storage initialization error:', error);
            // Fallback to local
            this.config = {
                provider: 'local',
                config: { local: { uploadPath: './uploads' } }
            };
        }
    }

    async upload(file, folder = 'general') {
        await this.initialize();

        switch (this.config.provider) {
            case 'aws':
                return await this.uploadToS3(file, folder);
            case 'gcloud':
                return await this.uploadToGCloud(file, folder);
            case 'local':
            default:
                return await this.uploadToLocal(file, folder);
        }
    }

    async uploadToLocal(file, folder) {
        try {
            const uploadPath = process.env.FILE_UPLOAD_PATH || './uploads';
            const folderPath = path.join(uploadPath, folder);

            // Create directory if it doesn't exist
            await fs.mkdir(folderPath, { recursive: true });

            const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`; // Sanitize filename
            const filepath = path.join(folderPath, filename);

            // Write file
            await fs.writeFile(filepath, file.buffer);

            // Return relative path to allow frontend to construct full URL dynamically
            // This prevents issues where 'localhost' is hardcoded in the DB
            return {
                url: `/uploads/${folder}/${filename}`,
                filename: filename,
                provider: 'local'
            };
        } catch (error) {
            throw new Error(`Local upload failed: ${error.message}`);
        }
    }

    async uploadToS3(file, folder) {
        try {
            const filename = `${folder}/${Date.now()}-${file.originalname}`;

            const params = {
                Bucket: this.config.config.aws.bucket,
                Key: filename,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
            };

            const result = await this.s3.upload(params).promise();

            return {
                url: result.Location,
                filename: filename,
                provider: 'aws'
            };
        } catch (error) {
            throw new Error(`S3 upload failed: ${error.message}`);
        }
    }

    async uploadToGCloud(file, folder) {
        try {
            const bucket = this.gcs.bucket(this.config.config.gcloud.bucket);
            const filename = `${folder}/${Date.now()}-${file.originalname}`;
            const blob = bucket.file(filename);

            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype
                }
            });

            return new Promise((resolve, reject) => {
                blobStream.on('error', (error) => {
                    reject(new Error(`GCloud upload failed: ${error.message}`));
                });

                blobStream.on('finish', async () => {
                    // Make file public
                    await blob.makePublic();

                    const publicUrl = `https://storage.googleapis.com/${this.config.config.gcloud.bucket}/${filename}`;

                    resolve({
                        url: publicUrl,
                        filename: filename,
                        provider: 'gcloud'
                    });
                });

                blobStream.end(file.buffer);
            });
        } catch (error) {
            throw new Error(`GCloud upload failed: ${error.message}`);
        }
    }

    async delete(fileUrl, provider) {
        await this.initialize();

        switch (provider) {
            case 'aws':
                return await this.deleteFromS3(fileUrl);
            case 'gcloud':
                return await this.deleteFromGCloud(fileUrl);
            case 'local':
            default:
                return await this.deleteFromLocal(fileUrl);
        }
    }

    async deleteFromLocal(fileUrl) {
        try {
            const filepath = path.join('.', fileUrl);
            await fs.unlink(filepath);
            return { success: true };
        } catch (error) {
            throw new Error(`Local delete failed: ${error.message}`);
        }
    }

    async deleteFromS3(fileUrl) {
        try {
            // Extract key from URL
            const url = new URL(fileUrl);
            const key = url.pathname.substring(1); // Remove leading slash

            const params = {
                Bucket: this.config.config.aws.bucket,
                Key: key
            };

            await this.s3.deleteObject(params).promise();
            return { success: true };
        } catch (error) {
            throw new Error(`S3 delete failed: ${error.message}`);
        }
    }

    async deleteFromGCloud(fileUrl) {
        try {
            // Extract filename from URL
            const url = new URL(fileUrl);
            const filename = url.pathname.split('/').slice(2).join('/'); // Remove bucket name

            const bucket = this.gcs.bucket(this.config.config.gcloud.bucket);
            await bucket.file(filename).delete();

            return { success: true };
        } catch (error) {
            throw new Error(`GCloud delete failed: ${error.message}`);
        }
    }
}

module.exports = new StorageService();
