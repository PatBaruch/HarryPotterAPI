import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve static HTML files from the 'html' directory
app.use('/html', express.static(path.join(__dirname, 'html')));

// Serve JavaScript files from the 'assets/js' directory
app.use('/js', express.static(path.join(__dirname, 'assets', 'js')));

//serve images from the 'assets/images' directory
app.use('/images', express.static(path.join(__dirname, 'assets', 'images')));

// Proxy configuration
app.use('/api', createProxyMiddleware({
    target: 'https://wizard-world-api.herokuapp.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding
    }
}));

app.use('/api/elixirs/easy', createProxyMiddleware({
    target: 'https://wizard-world-api.herokuapp.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/elixirs/easy': '/elixirs?difficulty=easy',
    },
}));

app.use('/api/elixirs/medium', createProxyMiddleware({
    target: 'https://wizard-world-api.herokuapp.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/elixirs/medium': '/elixirs?difficulty=medium',
    },
}));

app.use('/api/elixirs/hard', createProxyMiddleware({
    target: 'https://wizard-world-api.herokuapp.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/elixirs/hard': '/elixirs?difficulty=hard',
    },
}));

// Serve index.html for SPA routes not covered by static files or APIs
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
