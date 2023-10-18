import { UploadedFile } from 'express-fileupload';
import AWS from 'aws-sdk';
import { ApiError } from '../exceptions/ApiError';

AWS.config.update({ region: 'eu-north-1' });

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const uploadImage = async ({ file }: { file: UploadedFile }) => {
  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET as string,
      Key: `${Date.now()}-${file.name}`,
      Body: Buffer.from(file.data),
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    return (await s3.upload(uploadParams).promise()).Location;
  } catch (error) {
    throw ApiError.BadRequest('An error occurred while loading the image');
  }
};

const deleteImage = async(imageKey: string) => {
  if (!imageKey) {
    throw ApiError.BadRequest('Something went wrong');
  }

  try {
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET as string,
      Key: imageKey,
    }).promise();
  } catch (error) {
    throw ApiError.BadRequest('An error occurred while deleting the image');
  }
};

export const awsService = {
  uploadImage,
  deleteImage,
  s3,
};
