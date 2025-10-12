const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure font files are treated as assets and properly bundled
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');

module.exports = config;
