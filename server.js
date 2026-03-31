const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS so index.html can fetch data without security errors
app.use(cors());
app.use(express.json());

// Mock Database with reliable image and video placeholders
const mockDatabase = Array.from({ length: 50 }, (_, i) => ({
    id: `vid_${i + 1}`,
    title: `StreamTube Exclusive Video ${i + 1}`,
    uploader: `Creator${Math.floor(Math.random() * 100)}`,
    views: Math.floor(Math.random() * 2000000) + 1000,
    duration: `10:${i < 10 ? '0'+i : i}`,
    // Using picsum.photos for reliable, distinct thumbnail generation
    thumbnailUrl: `https://picsum.photos/seed/${i + 1}/320/180`, 
    videoUrl: `https://www.w3schools.com/html/mov_bbb.mp4`
}));

// Endpoint 1: Get 16 videos for the Home Grid
app.get('/api/videos/trending', (req, res) => {
    const trendingVideos = mockDatabase.slice(0, 16);
    res.json(trendingVideos);
});

// Endpoint 2: Get specific details when a video is clicked
app.get('/api/videos/:id', (req, res) => {
    const video = mockDatabase.find(v => v.id === req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
});

// Endpoint 3: Get 6 random videos for the Sidebar
app.get('/api/videos/:id/related', (req, res) => {
    const related = [...mockDatabase].sort(() => 0.5 - Math.random()).slice(0, 6);
    res.json(related);
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Backend Server running at http://localhost:${port}`);
    console.log(`You can now open index.html in your browser!`);
});
