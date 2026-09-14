# Emotion Weather Station

## Product and Interaction Design Specification

**Prototype platform:** Figma Make  
**Primary frame:** 393 × 852 px portrait mobile  
**Responsive minimum:** 360 px wide  
**Art direction:** Celestial Orrery  
**Prototype data:** Fictional, local, and session-only

---

## 1. Product Summary

Emotion Weather Station is an abstract mood journal that turns a short fictional reflection into a symbolic weather forecast. The experience is presented as a magical celestial observatory: the user records an emotional temperature, writes a brief reflection, chooses whether to seal the reading, and consults an orrery that produces a poetic forecast.

The prototype is designed for fantasy fans who enjoy imaginative, low-pressure self-reflection. It is not a health product, diagnostic tool, or source of advice.

### Core experience

1. View the current state of the observatory on **Today’s Forecast**.
2. Select one of five emotional temperatures on **New Reading**.
3. Optionally enter a reflection and choose whether to seal it.
4. Generate and view a symbolic forecast on **Forecast Result**.
5. Review seven days of fictional readings on **Weekly Climate**.

### Prototype boundaries

The prototype must not include accounts, cloud sync, social sharing, real AI, health scoring, diagnosis, crisis guidance, editing, or deletion. It should not ask for or display real sensitive information. All examples must be clearly fictional.

Display this notice on the first reading and as small supporting copy in the New Reading screen:

> Use fictional entries for this prototype. The Observatory is for creative reflection, not health guidance.

---

## 2. Design Philosophy

### Wonder with clarity

The app should feel like operating a magical instrument, but every action must remain immediately understandable. Fantasy details support the task rather than obscure it. Use familiar control patterns, explicit labels, and one dominant action per screen.

### Interpretation without judgment

Forecasts describe a temporary atmosphere rather than rating an emotion as good or bad. Every emotional temperature is treated as valid information. Copy should sound observant and tentative: “The instruments suggest…” or “A bright interval may emerge…”

### Calm, deliberate interaction

The observatory responds slowly enough to feel ceremonial but never makes the user wait unnecessarily. Motion communicates selection, alignment, or reveal. Avoid constant background animation, flashing effects, and visual noise.

### Privacy as a visible ritual

Privacy is represented by sealing a reading. A sealed entry hides the forecast and reflection in history until the user explicitly reveals it for the current viewing session. The design should make privacy understandable without creating fear or implying production-grade security.

### Symbolic rather than literal

Represent feelings through orbital rings, constellations, atmospheric gradients, and celestial symbols. Avoid faces, emoji, photorealistic skies, medical imagery, and dense steampunk machinery.

---

## 3. Information Architecture

```text
Today’s Forecast
├── Take Today’s Reading
│   └── New Reading
│       └── Consult the Observatory
│           └── Generation interstitial
│               └── Forecast Result
│                   ├── Return to Observatory
│                   └── View Weekly Climate
└── Weekly Climate
    └── Sealed entry
        └── Unseal confirmation sheet
            └── Temporarily revealed entry
```

Today and Climate are the two top-level destinations. Use a compact two-item bottom navigation bar on those screens only. New Reading and Forecast Result are focused task screens with a back button and no bottom navigation.

### Navigation labels

- **Today:** four-point star/orb icon plus text label
- **Climate:** constellation-line icon plus text label
- Never use an unlabeled icon as the only navigation control.

---

## 4. Screen Specifications

### 4.1 Today’s Forecast

#### Purpose

Orient the user, show whether today has a reading, and provide the clearest path into the core task.

#### Default state: no reading today

Top to bottom:

1. Safe-area spacing and app wordmark: **Emotion Weather Station**.
2. Eyebrow label: **THE OBSERVATORY · TODAY**.
3. Title: **The sky is waiting.**
4. Supporting copy: **Record a fictional emotional temperature and let the instruments shape it into a forecast.**
5. Central orrery illustration, 240–280 px wide. Its core is dim, with three thin orbit rings and sparse stars.
6. Primary button: **Take Today’s Reading**.
7. “Last observed” card showing the most recent public forecast:
   - Label: **LAST OBSERVED · FRIDAY**
   - Forecast: **Charged winds with flashes of invention**
   - State chip: **Solar Flare**
8. Two-item bottom navigation with Today selected.

#### Completed-today state

Replace the empty-state title and CTA region with:

- Eyebrow: **TODAY’S READING**
- Title: **Scattered confidence with evening overthinking**
- Animated orrery using the selected state treatment
- Interpretation: **The instruments suggest forward motion, with a few thoughts still circling after dusk.**
- Primary button: **View Full Forecast**
- Secondary text action: **Visit Weekly Climate**

Do not allow a second reading for the same day in this prototype.

### 4.2 New Reading

#### Purpose

Collect the minimum information needed for a symbolic forecast.

#### Header

- Back button: **Back to Today**
- Progress label: **NEW READING · 1 OF 1**
- Title: **Calibrate the inner sky**
- Supporting copy: **Choose the atmosphere closest to this fictional moment.**

#### Emotional temperature selector

Present the five states as a horizontal orbital track or a wrapping row of five large selection controls. At 360 px width, allow horizontal scrolling with the selected item centered. Each option contains a symbol, label, and one-word descriptor.

When an option is selected:

- Increase its ring stroke to 2 px.
- Apply its semantic color to the ring and central orb.
- Add a check mark and the text **Selected** for assistive technology.
- Update the large preview orb and the short description below the selector.
- Use a 250 ms fade/scale transition; no bouncing motion.

#### Reflection field

- Label: **Field note (optional)**
- Placeholder: **What is moving through this imagined day?**
- Helper: **Keep it fictional and under 180 characters.**
- Multiline field, approximately four lines tall
- Character count aligned bottom-right: **0 / 180**
- At 180 characters, stop accepting additional input and change the count to antique gold. Do not use red because reaching the limit is not an error.

#### Privacy control

- Toggle label: **Seal this reading**
- Supporting copy when off: **Its forecast and field note will appear in Weekly Climate.**
- Supporting copy when on: **The entire entry will stay hidden until you choose to unseal it.**
- Use a closed-orbit lock sigil in addition to the toggle state.

#### Submission

- Primary button: **Consult the Observatory**
- Disabled until an emotional state is selected
- Reflection remains optional
- Show the fictional-data notice below the button

If the user returns from Forecast Result, preserve the current selection, reflection, and seal choice for the session.

### 4.3 Generation Interstitial

Display as a full-screen state between submission and result for approximately 1.8 seconds.

- The selected orb moves into the center while three rings align around it.
- Status label changes once from **Aligning instruments…** to **Reading the imagined sky…**
- Use a gentle haptic-style visual pulse at completion.
- Reduced-motion mode replaces rotation and alignment with two crossfades.
- Include a hidden prototype route or alternate frame for a generic failure state:
  - Title: **The instruments lost alignment.**
  - Copy: **No reading was recorded. Realign the orrery and try again.**
  - Primary button: **Try Again**
  - Secondary action: **Return to Today**

### 4.4 Forecast Result

#### Purpose

Reward completion with a clear, memorable symbolic interpretation.

Top to bottom:

1. Back control: **Back to Reading**
2. Eyebrow: **THE INSTRUMENTS FORECAST**
3. Large celestial condition illustration using the selected state’s orb and orbit treatment
4. Forecast headline in display type
5. Interpretation paragraph beginning with **The instruments suggest…**
6. Metadata chips:
   - Emotional state name
   - **Open reading** or **Sealed reading**
7. Optional field-note card. If no reflection was entered, omit the card rather than showing an empty state.
8. Primary button: **Return to Observatory**
9. Secondary button: **View Weekly Climate**

Use a 600 ms staged reveal: illustration, headline, interpretation, then actions. Do not animate individual letters.

### 4.5 Weekly Climate

#### Purpose

Show the emotional pattern of the fictional week without scoring or ranking it.

#### Header and overview

- Eyebrow: **SEVEN-DAY OBSERVATION**
- Title: **Weekly Climate**
- Supporting copy: **A constellation of recorded moments, not a measure of progress.**
- Date range: **Sept 14–20**
- Decorative constellation line connecting the state markers of populated, unsealed days. Break the line at empty or sealed days.

#### Day cards

Display seven cards in reverse chronological order. Each card includes the short weekday, date, status marker, and content appropriate to its state.

**Public entry:** show state, forecast headline, and field note.  
**Sealed entry:** show only date, closed-orbit sigil, **Sealed reading**, and **Unseal temporarily**.  
**Empty day:** show date, a faint empty orbit, and **No observation recorded**.

#### Temporary unsealing flow

Tapping **Unseal temporarily** opens a bottom sheet:

- Title: **Unseal this reading?**
- Copy: **Its forecast and field note will be visible until you leave Weekly Climate.**
- Primary action: **Unseal for now**
- Secondary action: **Keep sealed**

After confirmation, reveal the full day card with a small **Temporarily unsealed** label. Leaving Weekly Climate restores the sealed presentation.

---

## 5. Emotional Temperature System

| State | Meaning | Descriptor | Color | Symbol | Orbital behavior |
|---|---|---|---|---|---|
| Frostbound | Stillness, heaviness, distance | Still | `#8AC7E8` | Six-point ice star | Slow outer orbit with crystalline ticks |
| Mistbound | Uncertainty, distraction, ambiguity | Clouded | `#A9A6D8` | Partially eclipsed moon | Soft blurred ring with intermittent stars |
| Temperate | Steadiness, openness, balance | Steady | `#79C7A5` | Balanced twin orbit | Even circular motion with a green aurora |
| Sunlit | Optimism, energy, connection | Bright | `#F2C66D` | Four-point sun star | Expanding rings with restrained warm rays |
| Solar Flare | Intensity, urgency, restlessness | Charged | `#F0836A` | Flared comet | Faster eccentric orbit with a coral arc |

Accessible control names must pair the label and description, for example: **Select Mistbound, uncertain and clouded**.

---

## 6. Forecast Content System

Forecasts are prepared, deterministic content. The prototype should not claim to analyze the reflection. Each selected state maps to one primary result; alternate variants may appear in history.

| State | Primary headline | Interpretation |
|---|---|---|
| Frostbound | Quiet snowfall across a distant horizon | The instruments suggest a still interval, with warmth remaining visible beyond the outer orbit. |
| Mistbound | Wandering fog with brief windows of clarity | The instruments suggest uncertainty in the near sky, interrupted by moments when the path becomes visible. |
| Temperate | Clear balance beneath a patient aurora | The instruments suggest an even atmosphere, open enough for ideas to move without rushing. |
| Sunlit | Scattered confidence with evening overthinking | The instruments suggest forward motion, with a few thoughts still circling after dusk. |
| Solar Flare | High emotional pressure with sparks of possibility | The instruments suggest a charged sky where urgency and imagination are traveling close together. |

### Alternate forecast phrases

- **Frostbound:** “A hushed front beneath persistent starlight”; “Still air with a distant warming trend”
- **Mistbound:** “Low visibility around unfinished thoughts”; “Drifting questions with a clearing near midnight”
- **Temperate:** “Gentle currents beneath a steady moon”; “An open sky with measured momentum”
- **Sunlit:** “Bright intervals with passing clouds of doubt”; “Warm momentum along the eastern orbit”
- **Solar Flare:** “Charged winds with flashes of invention”; “A radiant surge followed by restless starlight”

### Voice rules

- Keep headlines between 5 and 9 words.
- Keep interpretations to one sentence and no more than 24 words.
- Use tentative language such as “suggest,” “may,” and “appears.”
- Describe changing conditions, never permanent traits.
- Do not label emotions as positive, negative, healthy, unhealthy, normal, or abnormal.
- Do not give instructions, predictions about real events, or mental-health guidance.

---

## 7. Fictional Weekly Dataset

Use this exact content for the default Weekly Climate prototype. The current date in the prototype is **Sunday, September 20**.

| Day | Entry state | Emotional state | Forecast | Field note |
|---|---|---|---|---|
| Sun, Sept 20 | Public/current | Sunlit | Scattered confidence with evening overthinking | Rehearsing tomorrow’s presentation for the Moon Cartographers Guild. |
| Sat, Sept 19 | Sealed | Hidden | Hidden while sealed | Hidden while sealed |
| Fri, Sept 18 | Public | Solar Flare | Charged winds with flashes of invention | Sketched three impossible engines while the airship mechanic was late. |
| Thu, Sept 17 | Empty | — | No observation recorded | — |
| Wed, Sept 16 | Public | Temperate | Gentle currents beneath a steady moon | Catalogued quiet constellations during the library’s night shift. |
| Tue, Sept 15 | Sealed | Hidden | Hidden while sealed | Hidden while sealed |
| Mon, Sept 14 | Empty | — | No observation recorded | — |

When the Saturday sealed entry is temporarily revealed, show:

- State: **Mistbound**
- Forecast: **Drifting questions with a clearing near midnight**
- Field note: **Waiting to learn whether the cloud-whale expedition needs another navigator.**

The Tuesday sealed card does not need an unsealed variant in the primary prototype path.

---

## 8. Visual Design System

### Color tokens

| Token | Value | Usage |
|---|---|---|
| `canvas` | `#090B1A` | Main screen background |
| `surface` | `#11162B` | Cards, navigation, input backgrounds |
| `surface-selected` | `#1A2140` | Selected and pressed containers |
| `text-primary` | `#F4F1E8` | Headings and primary content |
| `text-secondary` | `#AAA9C2` | Supporting copy |
| `text-muted` | `#747590` | Metadata and disabled text |
| `accent-gold` | `#D8B66A` | Primary actions, active paths, focus |
| `border` | `rgba(190, 188, 224, 0.22)` | Card and field outlines |
| `overlay` | `rgba(4, 5, 14, 0.72)` | Modal and bottom-sheet scrim |
| `error` | `#E58B8B` | Actual failure messages only |

Antique gold should occupy less than 10% of a screen. Glows are decorative and must not be required to read content or state.

### Typography

- **Display and forecast headlines:** Cormorant Garamond Semibold
- **Navigation, controls, labels, and body:** Inter Regular, Medium, or Semibold
- Display: 32 px / 36 px line height
- Screen title: 24 px / 29 px
- Card title: 18 px / 24 px
- Body: 16 px / 24 px
- Label: 14 px / 20 px
- Metadata: 12 px / 16 px
- Do not use body copy below 14 px.

### Spacing and layout

- Base spacing unit: 8 px
- Screen side margins: 20 px
- Small gap: 8 px
- Control gap: 12–16 px
- Section gap: 24–32 px
- Minimum touch target: 44 × 44 px
- Primary button height: 52 px
- Card radius: 20 px
- Button and input radius: 16 px
- Bottom sheet top radius: 28 px

Use translucent borders and subtle inner highlights instead of heavy drop shadows. Maintain enough bottom padding for device safe areas.

### Illustration

Use thin orbit lines, four-point stars, etched constellation marks, soft radial gradients, translucent glass, and sparse particles. The central orb should be the visual anchor. Avoid large background textures that reduce text contrast.

### Motion

- Control feedback: 150–250 ms
- Selection transitions: 250 ms ease-out
- Result reveal: 600 ms staged ease-out
- Generation alignment: approximately 1.8 seconds
- Bottom sheet: 300 ms ease-out
- Reduced motion: replace orbit rotation, scale pulses, and staged movement with simple opacity crossfades

---

## 9. Component Library

### App bar

Variants: top-level wordmark, back navigation, and title-only. Back controls include both arrow and text.

### Buttons

**Primary:** antique-gold fill, midnight text, 52 px height.  
**Secondary:** transparent surface, gold border, moon-white text.  
**Text action:** no container, gold text, underline on focus.  

Provide default, pressed, focused, disabled, and loading variants. Disabled buttons use `surface-selected` with muted text and no glow. Focus uses a 2 px outer gold ring.

### Celestial state selector

Provide default, selected, pressed, focused, and disabled variants for all five states. Selected state uses its semantic color plus a check mark. Labels remain visible at every size.

### Reflection field

Provide empty, focused, populated, limit-reached, and error variants. Use `error` only for an actual field failure; the normal character limit uses gold.

### Seal toggle

Provide open and sealed variants with label, explanatory copy, toggle state, and open/closed orbit sigil.

### Forecast hero card

Combine condition illustration, headline, interpretation, and metadata chips. Create one property for each emotional state and open/sealed status.

### Weekly day card

Create variants for public, sealed, temporarily revealed, and empty. The sealed variant must not expose hidden state, forecast, or reflection through visible text.

### Bottom navigation

Two labeled items: Today and Climate. Use icon, text, and active indicator. Active state cannot rely on color alone.

### Bottom sheet

Use a drag indicator as decoration only, explicit title and explanation, one primary action, and one cancel action. Tapping the scrim or **Keep sealed** dismisses it.

---

## 10. State and Data Contracts

These types describe the prototype’s conceptual data and should guide Figma component properties and any later React Native implementation.

```ts
type EmotionStateId =
  | "frostbound"
  | "mistbound"
  | "temperate"
  | "sunlit"
  | "solar-flare";

type EmotionState = {
  id: EmotionStateId;
  label: string;
  descriptor: string;
  description: string;
  color: string;
  symbol: string;
};

type Reading = {
  id: string;
  date: string;
  state: EmotionStateId;
  reflection?: string;
  isSealed: boolean;
  headline: string;
  interpretation: string;
};

type HistoryDay =
  | { status: "public"; reading: Reading }
  | { status: "sealed"; date: string; reading: Reading }
  | { status: "temporarily-revealed"; reading: Reading }
  | { status: "empty"; date: string };
```

Prototype state remains local and resets when the prototype restarts. Temporary unsealing resets whenever the user leaves Weekly Climate.

---

## 11. Accessibility Requirements

- Meet at least 4.5:1 contrast for body text and 3:1 for large display text and essential component boundaries.
- Keep touch targets at least 44 × 44 px with 8 px separation where possible.
- Pair every icon and color treatment with a visible text label or distinct pattern.
- Preserve logical reading and focus order from top to bottom.
- Label controls directly: **Seal this reading, off**, **Select Sunlit, optimistic and bright**, and **Unseal Saturday’s reading temporarily**.
- Treat stars, orbits, and particles as decorative and exclude them from the accessibility tree.
- Provide visible keyboard focus treatments in the interactive desktop preview.
- Do not place essential text inside illustrations.
- Support text expansion without clipping; cards should grow vertically.
- Supply reduced-motion variants for selection, generation, result reveal, and bottom-sheet transitions.

---

## 12. Figma Make Build Instructions

1. Build the experience as a mobile-first, interactive prototype at 393 × 852 px.
2. Create reusable variables for all color, type, spacing, radius, and motion tokens.
3. Create reusable components and variants before composing final screens.
4. Use auto layout for every card, form group, button group, navigation bar, and screen content column.
5. Keep screen margins at 20 px and allow cards and text blocks to grow vertically.
6. Connect the complete happy path from Today through reading creation, result, and history.
7. Create branches for each of the five emotional-state selections and their mapped result content.
8. Create separate prototype states for an open reading and a sealed reading.
9. Implement the Saturday history-card unsealing flow with the confirmation bottom sheet.
10. Include dedicated frames for no-reading, completed-today, loading, generation failure, sealed, revealed, and empty-day states.
11. Keep all prototype copy visible in the canvas and use only the fictional entries provided in this document.
12. Name frames and components semantically, such as `Screen/Today/Empty`, `Card/History/Sealed`, and `Input/EmotionState/Sunlit/Selected`.

---

## 13. Acceptance Criteria

The prototype is complete when:

- Today’s Forecast clearly offers the next action in both empty and completed states.
- Every back control and both bottom-navigation destinations work.
- All five emotional temperatures visibly select and update the preview orb.
- Consult the Observatory remains disabled until a state is selected.
- A reflection can be omitted or entered up to 180 characters.
- The seal toggle changes both result metadata and the corresponding history presentation.
- Generation shows a loading transition and reaches the correct prepared forecast.
- Forecast Result provides working paths back to Today and forward to Weekly Climate.
- Weekly Climate displays seven days containing public, sealed, and empty examples.
- Saturday’s sealed entry can be temporarily revealed and becomes sealed again after leaving the screen.
- A generation-failure frame offers working retry and exit paths.
- The interface remains usable at 393 px and 360 px widths.
- Contrast, touch targets, focus states, text labels, and reduced-motion alternatives meet the stated requirements.
- No screen presents the experience as diagnosis, treatment, advice, or factual prediction.

---

## 14. Decision Log

| Decision | Alternatives considered | Rationale |
|---|---|---|
| Magical Observatory theme | Weather broadcast, dreamlike skies, minimalist dashboard | Best matches the fantasy audience and supports symbolic interaction. |
| Celestial Orrery art direction | Astronomer’s journal, astral control room | Balances fantasy character, mobile clarity, and feasible prototype motion. |
| Complete four-screen flow | Visual walkthrough, single key flow | Demonstrates the entire assigned interaction and meaningful state changes. |
| Fantasy-fan audience | Reflective students, broad adults | Supports a distinctive voice and world without requiring clinical framing. |
| Five discrete celestial states | Orbital dial, standard slider | Easier to understand, prototype, compare, and make accessible. |
| Prepared rule-based forecasts | One fixed result, simulated AI framing | Gives each selection a meaningful outcome without a backend or misleading analysis claim. |
| Entire private entry is sealed | Hide reflection only, label-only privacy | Makes the privacy setting visible and behaviorally testable. |
| Temporary unsealing | Permanent state change | Demonstrates user control without adding persistence, editing, or account complexity. |
| Local fictional data | Real entries, cloud data | Meets the assignment constraint and avoids sensitive information. |

---

## 15. Assumptions

- The prototype is assessed as an interactive design artifact rather than a production service.
- One person uses the prototype on one device in a single session.
- The default device is a modern portrait phone, with 393 × 852 px as the primary design frame.
- Figma Make can use Cormorant Garamond and Inter; use Georgia and the platform sans-serif only if those fonts are unavailable.
- All data is prepared locally, requires no network, and may reset when the prototype restarts.
- Performance should feel immediate except for the intentional 1.8-second forecast ritual.
- Production security, analytics, monitoring, authentication, localization, and long-term maintenance are outside scope.
- A later React Native implementation can translate the documented tokens, components, and TypeScript-shaped data contracts without changing the experience.
