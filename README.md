# Microscreens

![CI](https://github.com/PythoSalaf/microscreens/actions/workflows/ci.yml/badge.svg)

A polished tech news app built in public: **50 days, 50 mobile and web UI builds.** Each day adds one real feature, posted as a screen recording.

<p align="center">
  <img src="./docs/demo.gif" width="280" alt="Microscreens demo" />
</p>

## Download

**[Download the Android APK](REPLACE_WITH_RELEASE_LINK)**: install it and try it yourself. Demo login: `emilys` / `emilyspass`.

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
app/           routes (Expo Router, protected groups)
screens/       one file per screen
components/    shared UI components
hooks/         data and UI hooks
services/      API clients
store/         Zustand stores
schemas/       Zod validation schemas
lib/           query client and persistence
__tests__/     unit tests
```

## Run locally

```bash
git clone https://github.com/PythoSalaf/microscreens.git
cd microscreens
npm install
npx expo start
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
