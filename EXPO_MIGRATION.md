
# Expo Migration Guide

This document provides instructions for completing the migration from a React web app to an Expo mobile app.

## Step 1: Getting Started

1. Install Expo CLI if you haven't already:
```
npm install -g expo-cli
```

2. Rename `package.json.expo` to `package.json` or copy its contents to your existing package.json.

3. Make sure you have all the required dependencies:
```
npm install
```

## Step 2: Placeholder Assets

Replace the placeholder files in the `assets` folder with actual images:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

## Step 3: Run the App

```
npx expo start
```

## Step 4: Migrating Additional Screens

The current migration includes only the Welcome screen. You'll need to port over the remaining screens from your web app.

For each screen:
1. Create a new file in `src/screens/`
2. Convert the web components to React Native components
3. Update the navigation in `App.tsx`

## Step 5: Handling Web-Specific Dependencies

- Replace `shadcn/ui` components with React Native equivalents or a UI library like React Native Paper
- Replace Tailwind CSS with StyleSheet objects or a library like NativeWind
- Replace React Router with React Navigation (already set up in the template)
- Replace Framer Motion with React Native Reanimated or other React Native animation libraries

## Step 6: Handling Authentication

Update the authentication flow to use AsyncStorage instead of localStorage, using the Supabase client that's already configured.

## Step 7: Testing

Test the app thoroughly on both iOS and Android to ensure functionality works as expected.
