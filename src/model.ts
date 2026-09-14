import {
  FORECASTS,
  WEEKLY_DATA,
  type EmotionStateId,
  type Reading,
  type HistoryDay,
} from "./data";
export type Screen =
  | "today"
  | "new-reading"
  | "generating"
  | "forecast-result"
  | "weekly-climate"
  | "error";
export type Draft = {
  selectedState: EmotionStateId | null;
  reflection: string;
  isSealed: boolean;
};
export type Station = {
  screen: Screen;
  draft: Draft;
  reading: Reading | null;
  revealed: string[];
  sheet: string | null;
};
export const initial: Station = {
  screen: "today",
  draft: { selectedState: null, reflection: "", isSealed: false },
  reading: null,
  revealed: [],
  sheet: null,
};
export type Action =
  | { type: "navigate"; screen: Screen }
  | { type: "draft"; patch: Partial<Draft> }
  | { type: "complete" }
  | { type: "sheet"; id: string | null }
  | { type: "reveal" };
export function stationReducer(s: Station, a: Action): Station {
  switch (a.type) {
    case "navigate":
      return {
        ...s,
        screen: a.screen,
        revealed: a.screen === "weekly-climate" ? s.revealed : [],
        sheet: null,
      };
    case "draft":
      return {
        ...s,
        draft: {
          ...s.draft,
          ...a.patch,
          reflection: (a.patch.reflection ?? s.draft.reflection).slice(0, 180),
        },
      };
    case "sheet":
      return { ...s, sheet: a.id };
    case "reveal":
      return {
        ...s,
        revealed: s.sheet ? [...new Set([...s.revealed, s.sheet])] : s.revealed,
        sheet: null,
      };
    case "complete": {
      if (s.screen !== "generating" || !s.draft.selectedState) return s;
      const state = s.draft.selectedState;
      return {
        ...s,
        screen: "forecast-result",
        reading: {
          id: "sun-sep-20",
          date: "Sun, Sept 20",
          state,
          reflection: s.draft.reflection.trim() || undefined,
          isSealed: s.draft.isSealed,
          ...FORECASTS[state],
        },
      };
    }
  }
}
export function weekFor(reading: Reading | null): HistoryDay[] {
  const today: HistoryDay = !reading
    ? { status: "empty", date: "Sun, Sept 20", dayId: "sun-sep-20" }
    : reading.isSealed
      ? { status: "sealed", date: reading.date, dayId: reading.id, reading }
      : { status: "public", reading };
  return [today, ...WEEKLY_DATA.slice(1)];
}
export function dayId(day: HistoryDay) {
  return day.status === "public" ? day.reading.id : day.dayId;
}
export function visibleReading(
  day: HistoryDay,
  revealed: string[],
): Reading | null {
  return day.status === "empty" ||
    (day.status === "sealed" && !revealed.includes(day.dayId))
    ? null
    : day.reading;
}
