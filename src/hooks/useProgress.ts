import { useSyncExternalStore } from "react";
import { progressStore, type ProgressState } from "../lib/progress";

export function useProgress(): ProgressState {
  return useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getSnapshot);
}
