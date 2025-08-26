import { useEffect, useState } from "react";
import { AppState } from "react-native";

export default function useGlobalAppStateListener() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      //console.log("App state changed to:", nextAppState);
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appState; // "active" | "background" | "inactive"
}