import { useState, useCallback } from "react";
import { apiClient } from "../utils/apiClient";

interface UseWarmupReturn {
  warmupError: string | null;
  isWarmingUp: boolean;
  performWarmup: () => Promise<void>;
}

export function useWarmup(): UseWarmupReturn {
  const [warmupError, setWarmupError] = useState<string | null>(null);
  const [isWarmingUp, setIsWarmingUp] = useState(false);

  const performWarmup = useCallback(async () => {
    setWarmupError(null);
    setIsWarmingUp(true);

    await apiClient.get("warmup", {
      silent: true,
      onError: (error) => {
        setWarmupError(error.message || "Failed to connect to server");
      },
    });

    setIsWarmingUp(false);
  }, []);

  return { warmupError, isWarmingUp, performWarmup };
}
