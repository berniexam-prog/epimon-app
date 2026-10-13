# Epimon

Epimon is a dark-mode focus and consistency app built with Expo SDK 57 and Expo Router.

## Local development

```bash
npm install
npm start
```

For platform-specific launch:

```bash
npm run ios
npm run android
```

## Development build commands

Because MMKV and other native features require a development build, use:

```bash
npx expo run:ios
npx expo run:android
```

For an EAS development build, use:

```bash
npx eas-cli build --profile development --platform ios
npx eas-cli build --profile development --platform android
```

## Verification and quality checks

```bash
node ./node_modules/expo/bin/cli.js doctor
npx tsc --noEmit
npx expo lint
```

## Release checklist

- [ ] Run the app on a device or simulator with the latest development build.
- [ ] Check the onboarding flow on small and large phones, especially the hold-to-commit and notifications permission flow.
- [ ] Confirm the dark theme, contrast ratio, and reduced-motion behavior are comfortable.
- [ ] Validate the focus timer still resumes correctly after app backgrounding.
- [ ] Test restore or purchase flows when the RevenueCat configuration is available.
- [ ] Submit a TestFlight / Play Internal Testing build after final QA sign-off.

## Notes

- This repo follows the Expo SDK 57 stack and file-based routing expectations.
- The app is intentionally dark-only for the initial v1 implementation.
- Native code dependencies should be validated with Expo Doctor after package changes.
- The design source for onboarding and UI is kept in the attached HTML mock and should be treated as the visual source of truth.

