const config = require('./app.config.js');

console.log('=== Config Output ===');
console.log('Full config:', JSON.stringify(config, null, 2));
console.log('\n=== Extra field ===');
console.log('config.expo.extra:', config.expo.extra);
console.log('\n=== Individual values ===');
console.log('FIREBASE_WEB_CLIENT_ID:', config.expo.extra.FIREBASE_WEB_CLIENT_ID);
console.log('FIREBASE_ANDROID_CLIENT_ID:', config.expo.extra.FIREBASE_ANDROID_CLIENT_ID);
console.log('FIREBASE_PROJECT_ID:', config.expo.extra.FIREBASE_PROJECT_ID);
