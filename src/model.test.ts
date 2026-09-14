import { test } from "node:test";
import assert from "node:assert/strict";
import { EMOTION_STATES, FORECASTS } from "./data";
import {
  initial,
  stationReducer as reduce,
  weekFor,
  visibleReading,
} from "./model";
test("all five states create the matching forecast and update one history slot", () => {
  for (const e of EMOTION_STATES) {
    let s = reduce(initial, {
      type: "draft",
      patch: {
        selectedState: e.id,
        reflection: "An imaginary guild presentation.",
      },
    });
    s = reduce(s, { type: "navigate", screen: "generating" });
    s = reduce(s, { type: "complete" });
    assert.equal(s.reading?.headline, FORECASTS[e.id].headline);
    assert.equal(s.screen, "forecast-result");
    assert.equal(weekFor(s.reading).length, 7);
    assert.equal(visibleReading(weekFor(s.reading)[0], [])?.state, e.id);
  }
});
test("today starts empty and cancellation or duplicate completion cannot save", () => {
  assert.equal(weekFor(null)[0].status, "empty");
  assert.equal(reduce(initial, { type: "complete" }), initial);
  let s = reduce(initial, {
    type: "draft",
    patch: { selectedState: "sunlit" },
  });
  s = reduce(s, { type: "navigate", screen: "generating" });
  s = reduce(s, { type: "navigate", screen: "new-reading" });
  assert.equal(reduce(s, { type: "complete" }).reading, null);
});
test("sealed entries hide content, reveal only explicitly, and reseal on exit", () => {
  let s = reduce(initial, {
    type: "draft",
    patch: { selectedState: "mistbound", isSealed: true },
  });
  s = reduce(s, { type: "navigate", screen: "generating" });
  s = reduce(s, { type: "complete" });
  const day = weekFor(s.reading)[0];
  assert.equal(visibleReading(day, []), null);
  s = reduce(s, { type: "navigate", screen: "weekly-climate" });
  s = reduce(s, { type: "sheet", id: "sun-sep-20" });
  s = reduce(s, { type: "reveal" });
  assert.equal(visibleReading(day, s.revealed)?.state, "mistbound");
  s = reduce(s, { type: "navigate", screen: "today" });
  assert.equal(visibleReading(day, s.revealed), null);
});
test("draft limits input, preserves privacy, and omits blank reflection", () => {
  let s = reduce(initial, {
    type: "draft",
    patch: {
      reflection: "x".repeat(200),
      isSealed: true,
      selectedState: "temperate",
    },
  });
  assert.equal(s.draft.reflection.length, 180);
  s = reduce(s, { type: "draft", patch: { reflection: "  " } });
  s = reduce(s, { type: "navigate", screen: "generating" });
  s = reduce(s, { type: "complete" });
  assert.equal(s.reading?.reflection, undefined);
  assert.equal(s.reading?.isSealed, true);
  assert.equal(reduce(s, { type: "complete" }), s);
});
