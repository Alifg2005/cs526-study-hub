import { readJSON, writeJSON } from "./storage";

/** Per-viewer study progress kept in localStorage. */
export interface LectureProgress {
  bestScore?: number;
  lastScore?: number;
  attempts?: number;
  /** Indexes of checked revision-checklist items. */
  checked?: number[];
}

export type ProgressState = Record<string, LectureProgress>;

export const PROGRESS_STORAGE_KEY = "cs526:progress:v1";

let snapshot: ProgressState | null = null;
const listeners = new Set<() => void>();

function load(): ProgressState {
  if (snapshot === null) {
    const value = readJSON<unknown>(PROGRESS_STORAGE_KEY, {});
    snapshot = value && typeof value === "object" && !Array.isArray(value) ? (value as ProgressState) : {};
  }
  return snapshot;
}

function update(lectureId: string, change: (current: LectureProgress) => LectureProgress): void {
  const current = load();
  snapshot = { ...current, [lectureId]: change(current[lectureId] ?? {}) };
  writeJSON(PROGRESS_STORAGE_KEY, snapshot);
  listeners.forEach((l) => l());
}

export const progressStore = {
  getSnapshot: load,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  recordQuiz(lectureId: string, score: number) {
    update(lectureId, (p) => ({
      ...p,
      lastScore: score,
      bestScore: Math.max(score, p.bestScore ?? 0),
      attempts: (p.attempts ?? 0) + 1,
    }));
  },
  toggleChecklistItem(lectureId: string, index: number) {
    update(lectureId, (p) => {
      const checked = new Set(p.checked ?? []);
      if (checked.has(index)) checked.delete(index);
      else checked.add(index);
      return { ...p, checked: [...checked].sort((a, b) => a - b) };
    });
  },
  /** Test helper: forget the cached snapshot so the next read hits storage. */
  reset() {
    snapshot = null;
  },
};
