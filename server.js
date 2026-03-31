const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS so the frontend can communicate with the backend
app.use(cors());
app.use(express.json());

// Mock Database of Videos
const mockDatabase = Array.from({ length: 50 }, (_, i) => ({
    id: `vid_${i + 1}`,
    title: `Exciting Video Title ${i + 1}`,
    uploader: `User${Math.floor(Math.random() * 100)}`,
    views: Math.floor(Math.random() * 2000000) + 1000,
    duration: `10:${i < 10 ? '0'+i : i}`,
    thumbnailUrl: `https://via.placeholder.com/320x180?text=Thumbnail+${i + 1}`,
    videoUrl: `https://www.w3schools.com/html/mov_bbb.mp4` // Placeholder video link
}));

// Endpoint 1: Get Trending Videos (Populates the 4x4 Home Grid)
app.get('/api/videos/trending', (req, res) => {
    // Return the first 16 videos for the grid
    const trendingVideos = mockDatabase.slice(0, 16);
    res.json(trendingVideos);
});

// Endpoint 2: Get a Single Video by ID (When a user clicks a video)
app.get('/api/videos/:id', (req, res) => {
    const video = mockDatabase.find(v => v.id === req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
});

// Endpoint 3: Get Related Videos (Populates the Sidebar)
app.get('/api/videos/:id/related', (req, res) => {
    // Return 6 random videos for the sidebar recommendations
    const related = [...mockDatabase].sort(() => 0.5 - Math.random()).slice(0, 6);
    res.json(related);
});

app.listen(port, () => {
    console.log(`API Server running at http://localhost:${port}`);
});
