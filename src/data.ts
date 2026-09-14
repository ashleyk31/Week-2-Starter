export type EmotionStateId =
  "frostbound" | "mistbound" | "temperate" | "sunlit" | "solar-flare";

export interface EmotionState {
  id: EmotionStateId;
  label: string;
  descriptor: string;
  description: string;
  color: string;
  ariaLabel: string;
}

export const EMOTION_STATES: EmotionState[] = [
  {
    id: "frostbound",
    label: "Frostbound",
    descriptor: "Still",
    description: "Stillness, heaviness, distance",
    color: "#8AC7E8",
    ariaLabel: "Select Frostbound, still and distant",
  },
  {
    id: "mistbound",
    label: "Mistbound",
    descriptor: "Clouded",
    description: "Uncertainty, distraction, ambiguity",
    color: "#A9A6D8",
    ariaLabel: "Select Mistbound, uncertain and clouded",
  },
  {
    id: "temperate",
    label: "Temperate",
    descriptor: "Steady",
    description: "Steadiness, openness, balance",
    color: "#79C7A5",
    ariaLabel: "Select Temperate, steady and balanced",
  },
  {
    id: "sunlit",
    label: "Sunlit",
    descriptor: "Bright",
    description: "Optimism, energy, connection",
    color: "#F2C66D",
    ariaLabel: "Select Sunlit, optimistic and bright",
  },
  {
    id: "solar-flare",
    label: "Solar Flare",
    descriptor: "Charged",
    description: "Intensity, urgency, restlessness",
    color: "#F0836A",
    ariaLabel: "Select Solar Flare, intense and charged",
  },
];

export const FORECASTS: Record<
  EmotionStateId,
  { headline: string; interpretation: string }
> = {
  frostbound: {
    headline: "Quiet snowfall across a distant horizon",
    interpretation:
      "The instruments suggest a still interval, with warmth remaining visible beyond the outer orbit.",
  },
  mistbound: {
    headline: "Wandering fog with brief windows of clarity",
    interpretation:
      "The instruments suggest uncertainty in the near sky, interrupted by moments when the path becomes visible.",
  },
  temperate: {
    headline: "Clear balance beneath a patient aurora",
    interpretation:
      "The instruments suggest an even atmosphere, open enough for ideas to move without rushing.",
  },
  sunlit: {
    headline: "Scattered confidence with evening overthinking",
    interpretation:
      "The instruments suggest forward motion, with a few thoughts still circling after dusk.",
  },
  "solar-flare": {
    headline: "High emotional pressure with sparks of possibility",
    interpretation:
      "The instruments suggest a charged sky where urgency and imagination are traveling close together.",
  },
};

export interface Reading {
  id: string;
  date: string;
  state: EmotionStateId;
  reflection?: string;
  isSealed: boolean;
  headline: string;
  interpretation: string;
}

export type HistoryDay =
  | { status: "public"; reading: Reading }
  | { status: "sealed"; date: string; dayId: string; reading: Reading }
  | { status: "empty"; date: string; dayId: string };

export const WEEKLY_DATA: HistoryDay[] = [
  {
    status: "public",
    reading: {
      id: "sun-sep-20",
      date: "Sun, Sept 20",
      state: "sunlit",
      reflection:
        "Rehearsing tomorrow's presentation for the Moon Cartographers Guild.",
      isSealed: false,
      headline: "Scattered confidence with evening overthinking",
      interpretation:
        "The instruments suggest forward motion, with a few thoughts still circling after dusk.",
    },
  },
  {
    status: "sealed",
    date: "Sat, Sept 19",
    dayId: "sat-sep-19",
    reading: {
      id: "sat-sep-19",
      date: "Sat, Sept 19",
      state: "mistbound",
      reflection:
        "Waiting to learn whether the cloud-whale expedition needs another navigator.",
      isSealed: true,
      headline: "Drifting questions with a clearing near midnight",
      interpretation:
        "The instruments suggest uncertainty in the near sky, interrupted by moments when the path becomes visible.",
    },
  },
  {
    status: "public",
    reading: {
      id: "fri-sep-18",
      date: "Fri, Sept 18",
      state: "solar-flare",
      reflection:
        "Sketched three impossible engines while the airship mechanic was late.",
      isSealed: false,
      headline: "Charged winds with flashes of invention",
      interpretation:
        "The instruments suggest a charged sky where urgency and imagination are traveling close together.",
    },
  },
  {
    status: "empty",
    date: "Thu, Sept 17",
    dayId: "thu-sep-17",
  },
  {
    status: "public",
    reading: {
      id: "wed-sep-16",
      date: "Wed, Sept 16",
      state: "temperate",
      reflection:
        "Catalogued quiet constellations during the library's night shift.",
      isSealed: false,
      headline: "Gentle currents beneath a steady moon",
      interpretation:
        "The instruments suggest an even atmosphere, open enough for ideas to move without rushing.",
    },
  },
  {
    status: "sealed",
    date: "Tue, Sept 15",
    dayId: "tue-sep-15",
    reading: {
      id: "tue-sep-15",
      date: "Tue, Sept 15",
      state: "frostbound",
      isSealed: true,
      headline: "Quiet snowfall across a distant horizon",
      interpretation:
        "The instruments suggest a still interval, with warmth remaining visible beyond the outer orbit.",
    },
  },
  {
    status: "empty",
    date: "Mon, Sept 14",
    dayId: "mon-sep-14",
  },
];
