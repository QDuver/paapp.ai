const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable Fast Refresh (already enabled by default)
config.server = {
  ...config.server,
  enableVisualizer: true, // Enable bundle visualizer
};

// Optional: Add support for additional file extensions
config.resolver.assetExts.push(
  // Add any additional asset extensions you might need
  'db', 'mp3', 'ttf', 'obj', 'png', 'jpg'
);

module.exports = config;
