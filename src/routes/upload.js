const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { userAuth } = require('../middlewares/auth');

const uploadRouter = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET,
  },
});

uploadRouter.get('/get-upload-url', async (req, res) => {
  const { fileName, fileType } = req.query;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  });

  try {
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.send({
      uploadURL,
      fileURL: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error generating signed URL' });
  }
});

module.exports = uploadRouter;
