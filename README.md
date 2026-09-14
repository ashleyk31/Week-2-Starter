# Emotion Weather Station

Native Expo / React Native version of the Figma Make prototype in the adjacent `Implement Spec` folder. The app uses Expo SDK 57 and includes locally bundled fonts, SVG orbital artwork, five emotional temperatures, optional reflections, sealed readings, and a seven-day fictional history.

## Run

```sh
npm install
npm start
```

Press `i` to open an iOS simulator, or scan the terminal QR code in an SDK-57-compatible Expo Go app. `npm run web` opens the optional browser preview. No account, API key, or backend is required.

## Check

```sh
npm run typecheck
npm test
npx expo-doctor
```

Today is fixed to Sunday, September 20 for the fictional demo. New readings update Today, Result, and Weekly Climate together. State resets on reload. Leaving Climate reseals temporarily revealed entries. Back from Result preserves the draft and allows regenerating that same day’s reading.

In development, hold “Development: hold here to test retry” on New Reading for 800 ms to make the next generation fail; Try Again then succeeds. Cancel during generation to confirm no reading is saved.

The source prototype remains untouched. The native app uses React Native controls, `react-native-svg`, bundled Inter and Cormorant Garamond fonts, safe-area insets, keyboard avoidance, and reduced-motion support. Sealing is a local display behavior for fictional entries, not authentication or encryption.

## Technical concepts demonstrated

| Concept | Where to demonstrate it | Implementation |
| --- | --- | --- |
| Touchables / action controls | Today, New Reading, Result, Climate, and the unseal modal | `Pressable` handles primary actions, navigation, selectors, back, cancel, retry, and modal actions with pressed, focus, and disabled states. |
| Form inputs | New Reading | `TextInput` captures an optional fictional field note and `Switch` controls sealing. The field announces its label, helper text, and 180-character count. |
| Screen layout safety | Every screen and the unseal modal | `SafeAreaProvider`, `SafeAreaView`, and `useSafeAreaInsets` protect the header, bottom navigation, and modal actions from device cutouts and home indicators. |
| Keyboard management | New Reading | `KeyboardAvoidingView`, `keyboardShouldPersistTaps`, `keyboardDismissMode`, and submit-time dismissal keep the field usable while the keyboard is open. |
| Responsive design | New Reading, Result, and Climate | Flex rows, wrapped chips, horizontal state selection, scrollable content, safe-area padding, and width-aware containers support narrow phone layouts without device-specific coordinates. |
| State-based navigation | Every screen transition | The typed `Screen` union and `stationReducer` implement conditional “poor person’s navigation” without a navigation dependency. |

## Evaluator walkthrough

1. Launch on Today and tap **Take Today’s Reading**.
2. Try **Consult the Observatory** before choosing a state; it remains disabled.
3. Choose each of the five states and observe the selected treatment and preview orb.
4. Enter a field note, reach the 180-character limit, dismiss the keyboard by dragging, and turn on **Seal this reading**.
5. Submit, cancel during the generation ritual, then submit again to reach Forecast Result.
6. Open Weekly Climate, confirm today’s reading is synchronized, reveal a sealed entry, dismiss the modal, reveal it again, and leave/re-enter Climate to confirm it reseals.
7. Use the development-only long press on **Development: hold here to test retry** to verify the error screen and retry path.

The expected checks are `npm run typecheck`, `npm test`, `npx expo-doctor`, and `npx expo export --platform ios --platform android`.
