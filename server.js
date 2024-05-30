import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Create a proxy middleware with the correct target
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
