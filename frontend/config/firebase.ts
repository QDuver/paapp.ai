export function getOAuthClientIds() {
  const webClientId = process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID
  const androidClientId = process.env.EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID
  const iosClientId = process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID


  return {
    webClientId,
    androidClientId,
    iosClientId,
  };
}
