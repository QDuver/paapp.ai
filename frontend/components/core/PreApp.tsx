import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import LoginScreen from "../states/SplashScreen";
import WarmupErrorScreen from "../states/ErrorScreen";

interface PreAppProps {
  children: React.ReactNode;
}

export default function PreApp({ children }: PreAppProps) {
  const { isFirebaseInitialized, userReady, user, isWarmingUp, warmupError, performWarmup } =
    useAppContext();

  if (!isFirebaseInitialized || !userReady) {
    return <LoginScreen showButton={false} />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (isWarmingUp) {
    return <LoginScreen showButton={false} />;
  }

  if (warmupError) {
    return <WarmupErrorScreen error={warmupError} onRetry={performWarmup} />;
  }

  return <>{children}</>;
}
