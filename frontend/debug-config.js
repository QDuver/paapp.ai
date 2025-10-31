const dotenv = require('dotenv');
const path = require('path');

const result = dotenv.config({ path: path.resolve(__dirname, '.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Successfully loaded .env file');
}

console.log('\n=== Environment Variables ===');
console.log('FIREBASE_WEB_CLIENT_ID:', process.env.FIREBASE_WEB_CLIENT_ID);
console.log('FIREBASE_ANDROID_CLIENT_ID:', process.env.FIREBASE_ANDROID_CLIENT_ID);
console.log('FIREBASE_IOS_CLIENT_ID:', process.env.FIREBASE_IOS_CLIENT_ID);
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('\n=== All FIREBASE_ variables ===');
Object.keys(process.env)
  .filter(key => key.startsWith('FIREBASE_'))
  .forEach(key => console.log(`${key}:`, process.env[key]));
