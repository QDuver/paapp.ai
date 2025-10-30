import React from "react";
import { useAppInit } from "../../contexts/AppInit";
import { useAppContext } from "../../contexts/AppContext";
import SplashScreen from "../states/SplashScreen";
import ErrorScreen from "../states/ErrorScreen";
import MainApp from "./MainApp";

// isFirebaseInitialized

export default function PreApp() {
  const { isFirebaseInitialized, authReady, user, isWarmingUp, warmupError } =
    useAppInit();
  const { data } = useAppContext();

  const hasAllData = data?.settings && data?.routines && data?.exercises && data?.meals;

  if (!isFirebaseInitialized || !authReady || isWarmingUp) {
    return <SplashScreen showButton={false} loading={true} />;
  }

  else if (!user) {
    return <SplashScreen />;
  }

  else if (warmupError) {
    return <ErrorScreen/>;
  }

  else if (!hasAllData) {
    return <SplashScreen showButton={false} loading={true} />;
  }

  else{
    return <MainApp />
  }
}
