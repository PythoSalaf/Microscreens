# Microscreens

![CI](https://github.com/PythoSalaf/Microscreens/actions/workflows/ci.yml/badge.svg)

A polished tech news app built in public: **50 days, 50 mobile and web UI builds.** Each day adds one real feature, posted as a screen recording.

<p align="center">
  <img src="./docs/demo.gif" width="280" alt="Microscreens demo" />
</p>

## Download

**[Install the Android APK](https://expo.dev/accounts/bravecoder/projects/Microscreens/builds/c238a236-e822-4b81-a4f3-9c0783ee4efa)**: open it on your phone and try it yourself.

Demo login: `emilys` / `emilyspass`

## Features

- Animated onboarding with floating 3D art and a colour-blending background
- Live feed from the Hacker News API with a hero story, skeleton loaders, and error and empty states
- Custom pull-to-refresh built from gestures and Reanimated
- Infinite scroll with prefetched story comments
- Search with debounce, topic chips with a sliding highlight, and a story detail screen
- Bookmarks that persist across restarts, with a Saved tab and swipe-to-remove
- Login and sign-up with validation, a secure session, and protected routes
- Offline mode: cached feed, animated offline banner, and persisted query cache
- Custom animated tab bar and branded splash screen
- Unit tests and CI on every push

## Progress

| Day | Build                                            |
| --- | ------------------------------------------------ |
| 01  | Animated onboarding carousel                     |
| 02  | Tech news feed with custom pull-to-refresh       |
| 03  | Bookmarks, Saved tab and animated tab bar        |
| 04  | Search, topic chips and story detail             |
| 05  | Auth flow, protected routes and profile          |
| 06  | TanStack Query, infinite scroll and offline mode |
| 07  | Branded splash, tests, CI and installable APK    |

## Tech stack

| Area      | Tools                                       |
| --------- | ------------------------------------------- |
| App       | Expo, React Native, TypeScript, Expo Router |
| Styling   | NativeWind (Tailwind)                       |
| Animation | Reanimated, Gesture Handler                 |
| Data      | TanStack Query, NetInfo                     |
| State     | Zustand, AsyncStorage, SecureStore          |
| Forms     | React Hook Form, Zod                        |
| Quality   | Jest, GitHub Actions                        |
| Build     | EAS Build                                   |

## Project structure

```
src/
  app/           routes (Expo Router, protected groups)
  screens/       one file per screen
  components/    shared UI components
  hooks/         data and UI hooks
  services/      API clients
  store/         Zustand stores
  schemas/       Zod validation schemas
  lib/           query client and persistence
  utils/         helpers
  __tests__/     unit tests
```

## Run locally

```bash
git clone https://github.com/PythoSalaf/microscreens.git
cd microscreens
npm install
npx expo start
```

## Build the APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

## Tests

```bash
npm run typecheck
npm test
```

## Notes

- News data comes from the Hacker News Algolia API.
- Login uses the DummyJSON demo API. Sign-up is simulated, so new accounts are not stored.
- 3D illustrations were generated with Magnific.

## Author

Built by **Afolabi Taoheed**, a React Native and frontend developer open to remote roles.

[Portfolio](https://afolabi-taoheed-portfolio.vercel.app) · [LinkedIn](https://linkedin.com/in/pythosalaf) · [GitHub](https://github.com/PythoSalaf)
