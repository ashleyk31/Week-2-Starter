# Emotion Weather Station

Native Expo / React Native version of the Figma Make prototype in the adjacent `Implement Spec` folder. The app uses SDK 54 and includes locally bundled fonts, SVG orbital artwork, five emotional temperatures, optional reflections, sealed readings, and a seven-day fictional history.

## Run

```sh
npm install
npm start
```

Press `i` to open an iOS simulator, or scan the terminal QR code in an SDK-54-compatible Expo Go app. `npm run web` opens the optional browser preview. No account, API key, or backend is required.

## Check

```sh
npm run typecheck
npm test
npx expo-doctor
```

Today is fixed to Sunday, September 20 for the fictional demo. New readings update Today, Result, and Weekly Climate together. State resets on reload. Leaving Climate reseals temporarily revealed entries. Back from Result preserves the draft and allows regenerating that same day’s reading.

In development, hold “Development: hold here to test retry” on New Reading for 800 ms to make the next generation fail; Try Again then succeeds. Cancel during generation to confirm no reading is saved.

The source prototype remains untouched. The native app uses React Native controls, `react-native-svg`, bundled Inter and Cormorant Garamond fonts, safe-area insets, keyboard avoidance, and reduced-motion support. Sealing is a local display behavior for fictional entries, not authentication or encryption.
