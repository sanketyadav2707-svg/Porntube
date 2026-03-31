require('dotenv').config();
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { transcodeVideo } = require('./transcoder'); // We'll create this next

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Configure Multer to upload directly to S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_INGEST_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        }
    }),
    limits: { fileSize: 2000 * 1024 * 1024 } // 2GB limit per video
});

// Upload Endpoint
app.post('/api/upload', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file provided.' });
    }

    const s3FileKey = req.file.key;
    const s3FileUrl = req.file.location;

    // Acknowledge upload to the user immediately
    res.status(202).json({ 
        message: 'Upload successful. Video is now processing.',
        fileKey: s3FileKey 
    });

    // Trigger the transcoding process in the background
    // In a massive scale app, you would send a message to a queue (like AWS SQS or RabbitMQ) here instead.
    transcodeVideo(s3FileKey); 
});

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
