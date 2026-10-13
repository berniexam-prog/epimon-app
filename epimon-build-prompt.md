# Build prompt: Epimon (Expo SDK 57)

> Paste everything below into your coding agent (Claude Code, Cursor, etc.) from the root of your empty Expo SDK 57 project. Attach `epimon-onboarding-v2.html` and `epimon-v4.html` and the Epi mascot images so the agent can use them as the visual source of truth.

---

## 0. Role and working agreement

You are a senior React Native engineer and product-minded designer-developer. You are building **Epimon**, a gamified focus and consistency app, in the empty Expo SDK 57 project in the current directory.

Rules for how you work:

1. **Plan first.** Before writing code, read this whole brief, inspect the project, and reply with a short plan: the folder structure, the dependency list with reasons, and the milestone order. Wait for my "go" only if something in this brief is ambiguous or contradicts the project. Otherwise proceed.
2. **Your training data may predate SDK 57.** Check https://docs.expo.dev for current APIs before using any Expo or React Native API. Install native packages with `npx expo install <pkg>` so versions match the SDK. Run `npx expo-doctor` after each dependency change and fix what it reports.
3. **Work in milestones** (section 12). After each milestone: type-check, lint, run tests, run the app, summarize what changed, and make one git commit with a clear message.
4. **Do not add dependencies outside section 3 without telling me why.** Prefer fewer, well-maintained libraries.
5. **No lorem ipsum, no fake data in shipped paths.** Seed data is allowed only behind a `__DEV__` flag.
6. **Visual source of truth** is the attached HTML design files. Match tokens, spacing, copy and behavior. If the design and this brief conflict, tell me and follow the design.

SDK 57 facts to respect (verify in the docs): SDK 57 targets React Native 0.86 and React 19.2, uses the New Architecture only, and uses Continuous Native Generation, so do not commit `ios/` or `android/` folders. Run `npx expo prebuild` only when needed. React Navigation theme imports in Expo Router now come from `expo-router/react-navigation`, so verify this before writing theme code. Node 22.13+ is required.

---

## 1. Product summary

Epimon helps people stay consistent with their goals by planning their day and focusing in short, protected blocks. Epi is a friendly wolf mascot. The core mechanic is **Moonlight**: every focused minute charges today's moon, and reaching the daily goal makes a full moon. A month of moons is the user's record.

- **No accounts and no authentication.** Everything is local-first and stored on the device.
- **Dark theme only** for v1.
- **Platforms:** iOS and Android, portrait only.
- **Tone:** warm, encouraging, never shaming. Failure is "clouds pass", never "you lost".

### Moonlight rules (single source of truth, implement as pure functions with unit tests)

- `dailyGoalMinutes` is chosen in onboarding (5, 15, 30 or 60).
- `moonFill(day) = clamp(focusedMinutes(day) / dailyGoalMinutes, 0, 1)`.
- Display phases snap to 0, 0.25, 0.5, 0.75, 1 for calendar and week views. The big moon animates continuously.
- A day **counts for the streak** when `moonFill = 1`. Make this a constant `STREAK_THRESHOLD = 1` so it can be changed later.
- **Streak** = consecutive counted days ending today or yesterday. Missing a day resets to 0. Use the user's local time zone and a day boundary at 04:00 local time, so late-night sessions count for the previous day.
- **Glow** (the currency) = 1 per completed focus minute, awarded only for fully completed or properly ended blocks. Store it, show it, but do not build a shop yet.
- **Clouds, not failure.** If the user leaves the app during a focus session, clouds cover the moon. They have a **120-second grace period** to return. If they return in time, the session resumes. If not, the session ends as `rested`, and minutes spent in the foreground before leaving still count.

---

## 2. Design system

Implement these tokens in `src/theme/tokens.ts` and use only tokens in components.

### Color

| Token | Hex | Use |
|---|---|---|
| `night` | `#0E1024` | App background |
| `den` | `#171A36` | Cards |
| `dusk` | `#222648` | Raised surfaces, chips |
| `line` | `#303560` | Borders, rails |
| `text` | `#EEF0FF` | Primary text |
| `mist` | `#9A9EC4` | Secondary text |
| `violet` | `#8F86F0` | Primary actions, active tab |
| `violetDeep` | `#5B52C7` | Button base (tactile edge) |
| `moon` | `#F6EBB4` | Focus, progress, rewards |
| `moonDeep` | `#B9A94F` | Moon button base |
| `ember` | `#FF9E5E` | Streak flame, now-line |
| `mint` | `#5FD6A4` | Success, done |
| `coral` | `#FF7A7A` | Warnings and "lost hours" only |

Rules: each color has one job. Text on `violet` or `moon` is `night`. Never put `mist` text below 12px. Minimum contrast 4.5:1 for body text.

### Typography

- Headings, numbers, buttons: **Fredoka** 600 (via `@expo-google-fonts/fredoka`).
- Body: **DM Sans** 400, 500, 700 (via `@expo-google-fonts/dm-sans`).
- Scale: 12, 14, 16, 20, 26, 34, 64 (display number). Sentence case everywhere. Support Dynamic Type / font scaling up to 1.3x without layout breakage.

### Shape and spacing

- 4pt spacing grid. Screen horizontal padding 20.
- Radii: buttons 16, cards 18, option rows 16, chips 999, phone-level sheets 28.
- Touch targets at least 44x44.

### Components (build these first in `src/ui/`)

- **`Button`**: variants `primary` (violet), `moon`, `secondary` (outline), `ghost`. **Tactile style:** a 4px solid darker base under the button. On press, translate down 3px and shrink the base to 1px, with a light haptic. Disabled state at 40% opacity.
- **`OptionRow`**: icon plus label plus optional description, 2px border with a 4px bottom border. Selected state: moon or violet border and a tinted background. Supports single-select with **auto-advance** (see onboarding).
- **`Tile`**: large centered icon plus label for 2x2 grids.
- **`Chip`**, **`Badge`**, **`Card`**, **`Segmented`**, **`Toggle`**, **`ProgressBar`** (continuous, animated).
- **`Moon`** (`size`, `fill: 0..1`): SVG circle in `#262A52` with a lit layer in `moon` revealed from the bottom up via a clip, plus three subtle crater circles on the lit layer. Animate fill with Reanimated. Provide a `clouded` prop that fades in a cloud overlay.
- **`ProgressRing`** (`size`, `progress`, `children`): SVG ring, 10px stroke, `line` track and `moon` progress, rotated -90deg.
- **`Epi`** (`pose`, `size`): renders a transparent image from `assets/epi/` via `expo-image`. Poses: `wave`, `write`, `build`, `chart`, `cheer`, `rest`, `watch`. Until the real images exist, fall back to the single supplied mascot image with a soft radial mask so nothing looks boxed.
- **`TabBar`**: custom bottom bar with four tabs: Home, Plan, **Focus** (center, raised 54x54 rounded square in `moon`, with a 4px `moonDeep` base), Insights. Inactive icons `mist`, active `violet` (Focus label `moon`). Respect the bottom safe area.
- **`Timeline`** and **`TimelineBlock`** (section 6).

Motion: spring and ease-out, 150 to 350ms. Respect the OS reduce-motion setting by replacing movement with fades. Haptics via `expo-haptics` on taps of primary actions, option selection, commit and completion.

Icons: Tabler icons (`@tabler/icons-react-native`) to match the designs. Verify that it works with SDK 57 and `react-native-svg`. If it does not, use the closest equivalent set and tell me.

---

## 3. Tech stack

- **Expo SDK 57**, TypeScript (strict), **Expo Router** (file-based routes), New Architecture.
- **State:** `zustand` with persistence through `react-native-mmkv` (requires a development build, not Expo Go). Wrap storage behind `src/storage/` so it can be swapped.
- **Animation and gestures:** `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets` (as required by the Reanimated version Expo installs).
- **Graphics:** `react-native-svg`.
- **Images:** `expo-image`. **Fonts:** `expo-font` with the Google font packages above. **Splash:** `expo-splash-screen`.
- **Platform:** `expo-haptics`, `expo-notifications`, `expo-keep-awake`, `expo-linear-gradient` (only if needed), `expo-localization`, `expo-constants`.
- **Purchases:** `react-native-purchases` (RevenueCat) behind a `PurchasesService` interface (section 9).
- **Lists and sheets:** `@gorhom/bottom-sheet` only if the built-in modal approach is not enough.
- **Dates:** `date-fns`.
- **Testing:** `jest-expo`, `@testing-library/react-native`. Optional Maestro flows for onboarding.
- **Quality:** ESLint with the Expo config, Prettier, `tsc --noEmit` in a `typecheck` script.

Because MMKV and RevenueCat need native code, set up a **development build** (`npx expo run:ios` / `run:android`, or EAS dev builds) and document the commands in the README.

---

## 4. Architecture

```
app/
  _layout.tsx                  # fonts, splash, providers, onboarding gate
  (onboarding)/
    _layout.tsx                # stack, no header, gestures per screen
    welcome.tsx name.tsx about.tsx cost.tsx obstacle.tsx frequency.tsx
    method.tsx identity.tsx besttime.tsx minutes.tsx trajectory.tsx
    building.tsx preview.tsx commit.tsx trial.tsx
  (tabs)/
    _layout.tsx                # custom TabBar
    index.tsx                  # Home
    plan.tsx
    focus.tsx                  # session setup
    insights.tsx
  focus/
    session.tsx                # full-screen live session (gesture back disabled)
    complete.tsx
  block/[id].tsx               # add/edit block (modal)
src/
  theme/ ui/ features/{onboarding,home,plan,focus,insights,rewards}/
  domain/                      # pure logic: moon.ts streak.ts plan.ts sessions.ts insights.ts
  stores/                      # profile, onboarding, plan, sessions, settings
  services/                    # purchases, notifications, companion, analytics
  storage/ lib/ assets/
```

Principles: screens are thin. Pure domain logic lives in `src/domain/` with no React imports and has unit tests. Stores hold state, selectors derive moon fill, streak and weekly stats.

### Types (starting point)

```ts
type Obstacle = 'procrastination' | 'focus' | 'burnout' | 'discipline';
type DelayFrequency = 'daily' | 'few_week' | 'occasional' | 'rare';
type Identity = 'in_control' | 'consistent' | 'reliable' | 'calm';
type BestTime = 'morning' | 'afternoon' | 'evening' | 'varies';

interface Profile {
  name: string;
  ageBracket?: '13-17' | '18-24' | '25-34' | '35+';
  distractionHoursPerDay: number;      // 0..8
  obstacle: Obstacle; delayFrequency: DelayFrequency;
  identity: Identity; bestTime: BestTime;
  dailyGoalMinutes: 5 | 15 | 30 | 60;
  nudgeEnabled: boolean; nudgeTime: string; // 'HH:mm'
  onboardingCompletedAt?: number; createdAt: number;
}
type BlockType = 'focus' | 'plan' | 'rest';
interface Block { id: string; date: string; /* yyyy-MM-dd */ startMin: number; durationMin: number;
  type: BlockType; title: string; doneAt?: number; }
interface FocusSession { id: string; blockId?: string; title: string; plannedMin: number;
  startedAt: number; endedAt?: number; focusedSec: number;
  status: 'completed' | 'rested' | 'ended_early'; mood?: 1 | 2 | 3; }
```

Add a store version and `migrate` function from day one.

---

## 5. Onboarding (15 screens, exact order)

Follow the attached `epimon-onboarding-v2.html`. Shared rules:

- A **continuous progress bar** at the top of question screens (not segmented). Percentages: name 8, about 16, obstacle 30, frequency 42, identity 54, best time 66, minutes 78, trajectory 90. A back arrow returns to the previous screen and preserves answers.
- **Single-choice screens auto-advance** 250ms after a tap, with a selection haptic. No Continue button. Multi-field screens (name, about) use a Continue button.
- Persist each answer immediately so a killed app resumes at the right screen.
- Epi poses: `wave` on the welcome, `write` on question screens, `build` on building, `chart` on the plan preview, `cheer` on commit.
- Log analytics events (section 10) for every step.

| # | Screen | Behavior and copy |
|---|---|---|
| 1 | Welcome | Epi hero with a violet radial glow. "Meet Epi." / "Your focus coach. Light a moon every day and build a streak that lasts." CTA `moon` "Build my plan". Caption "Takes about 60 seconds". |
| 2 | Name | "What should Epi call you?" Autofocused input, large Fredoka text, moon-colored border. Continue disabled until at least 1 character. Trim and cap at 24 characters. |
| 3 | About you | Age segmented control (13-17, 18-24, 25-34, 35+) and a slider "Hours lost to distraction a day?" 0 to 8+ with default 4, value shown in `coral`. **Age is optional and skippable** (store the bracket only, never a birth date). |
| 4 | The cost | `hoursPerYear = hours * 365`, `days = round(hoursPerYear / 24)`. Dark moon at fill 0.1. "At {h} hours a day, you will lose" / count-up number in `coral` / "hours this year." / card "{days} days. A degree. A book. The habit you keep delaying." CTA "Not this year". **Skip this screen if hours is 0.** |
| 5 | Obstacle | "What gets in your way?" Putting things off, Losing focus, Burnout, No discipline. |
| 6 | Frequency | Epi bubble "Makes sense." / "How often do you delay?" Daily, A few times a week, Occasionally, Rarely. |
| 7 | The method | "The method behind Epi": 1 Find your reason, 2 5-second start, 3 Protected focus (your moon charges while you stay), 4 Fast recovery (clouds pass, pick up where you left off). CTA "Let us do this". |
| 8 | Identity | "Who do you want to be in 30 days?" In control, Consistent, Reliable, Calm. |
| 9 | Best time | 2x2 tiles: Morning, Afternoon, Evening, It changes. Sets default first-block time: 09:00, 14:00, 19:00, 10:00. |
| 10 | Minutes | "How many minutes a day?" 5, 15 (preselected, badge "Epi's pick"), 30, 60+, each with a moon icon of increasing fill. Footer: Epi mini and "Small enough to do on a bad day." |
| 11 | Trajectory | Line chart in SVG: dashed `mist` flat line "On your own", `moon` rising curve "With Epi", gradient area. "30 full moons are in reach." Label it as illustrative in a code comment and keep any real claim out of the copy. CTA "See my plan". |
| 12 | Building | Epi `build` pose. Checklist animates one line at a time (about 700ms each): Reading your pattern, Matching your method, Setting your {n}-minute moon, Mapping day 30. Progress bar fills. Auto-advance at the end, no button. Haptic on each check. |
| 13 | Plan preview | Epi `chart` pose. Chips: identity, best time, "{n} min a day". Day-one timeline starting at the best-time slot: "Pick one thing" 5 min, "Starter focus" `min(15, goal)` min, "Walk with Epi" 5 min. Below, a 30-day grid of moons (day 1 lit). CTA "Looks good". Create today's real blocks from this plan. |
| 14 | Commit | "Make it a promise." Large `ProgressRing` around a moon. **Press and hold** the "Hold to commit" button: ring fills over 1200ms with rising haptics; release early cancels with a soft haptic; completion lights the moon, plays a success haptic, and continues. "Daily nudge from Epi" toggle (default on) showing the best-time hour. Requesting notification permission happens **here, when the toggle is on and the user commits**, with a custom pre-prompt explaining why. "Not now" skips. |
| 15 | Free trial | RevenueCat offering. Yearly (preselected, "Save 52%" computed from real prices, not hardcoded) and monthly. Benefits: unlimited plans and focus blocks, Epi coach in Insights, full moon calendar and gear. Timeline line: Today full access, Day 5 reminder, Day 7 billing starts. CTA "Start free trial". Below: "No payment due now", "Restore purchases", and "Continue with free plan". Close X. Both exits mark onboarding complete and enter the tabs. |

Gating: `app/_layout.tsx` redirects to `/(onboarding)/welcome` until `onboardingCompletedAt` exists.

---

## 6. Main app (4 tabs)

### Home
- Header: "Good morning, {name}" (time-aware), subtitle with minutes done of goal, streak chip with the ember flame.
- **Moon card:** large `Moon` (104) filled to today's `moonFill`, "Moon is {n}% lit", hint text, glow chip. Animate on focus changes.
- **Week strip:** 7 days Monday to Sunday with small moons at snapped phases, today highlighted.
- **Next up card:** next unfinished focus block today with a Start button that opens Focus with that block preselected. Empty state: "Nothing planned. Add a block." with a button to Plan.
- **Epi tip card:** one insight from `CompanionService.homeTip()`.

### Plan
- Header "Plan" with date, Day/Week segmented control. Horizontal date strip.
- **Timeline:** vertical rail, hour labels, blocks positioned by `startMin` and sized by `durationMin` at `1.6 px per minute`. Colors: focus uses a `moon` tint with a `moon` left border, plan uses `violet`, rest uses `den`. Show "+{n}" glow on focus blocks. Past blocks at 50% opacity. **Now-line** in `ember` with a dot, auto-scrolled into view on open.
- **Free gaps** between blocks render as dashed "Free · 45 min" with an Add chip.
- Add or edit block in a modal sheet: title, type, start time, duration (5-minute steps). Prevent overlaps with a clear message.
- Phase 2 (build the hooks, not the UI): drag to move and resize.
- Bottom actions: "Inbox" (simple list of unscheduled tasks) and "Plan with Epi" (v1: rule-based generation of tomorrow's blocks from best time, goal and past session start hours).
- Week view: seven columns of compact blocks, tap a day to open it.

### Focus
- **Setup screen:** Moon preview with the "this block adds X minutes" hint, task selector (from today's blocks or free text), duration chips 15, 25, 45, 60 (default 25), **Strict mode** toggle ("Leaving the app clouds your moon"), CTA `moon` "Start {n} min".
- Do **not** claim real app blocking. v1 strict mode only affects the cloud behavior. Note future OS-level blocking (Screen Time API / Usage Access) in the README as a later feature.
- **Live session (`focus/session.tsx`):** task chip, `ProgressRing` (250) containing `Moon` and the countdown in Fredoka, "Moon charging · {a} of {b} min", Epi `watch` card, Pause and End early buttons. Disable swipe-back. Keep the screen awake with `expo-keep-awake`.
- **Timer correctness:** never count with `setInterval` ticks alone. Store `startedAt` and accumulated foreground seconds, derive remaining time from timestamps on every render and on `AppState` changes. Pausing and backgrounding must not drift.
- **AppState handling:** on `background`/`inactive` (strict mode on), record `leftAt`, show clouds on return, schedule a local notification at 90 seconds ("Epi is waiting. Come back to keep your moon."). On `active` within 120 seconds, resume. After 120 seconds, finalize as `rested` and show a gentle recap.
- **Completion (`focus/complete.tsx`):** Epi `cheer`, big moon animating to the new fill, "Full moon." when the daily goal is met (otherwise "Moon charged."), streak and glow chips, a 3-emoji "How did that block feel?" row stored as `mood`, CTA "Done". Success haptic and a short moon-glow animation.
- Mark the linked block done and write a `FocusSession`.

### Insights (AI companion)
- Header with Epi avatar, "Your coach", a history icon. Top chips: This week, Why I stall, Plan Monday.
- Chat UI: Epi bubbles (`dusk`), user bubbles (`violet`), a **mini bar chart card** (minutes per day, best days in `moon`), and **action buttons** inside Epi messages (for example "Move deep work to 9am") that apply a real plan change after a confirmation.
- Composer with placeholder "Ask Epi anything".
- **Architecture:** define `CompanionService` with `homeTip()`, `weeklySummary()`, `reply(message, context)`. **v1 ships a local, rule-based implementation** (best focus window from the histogram of session start hours, week-over-week change, longest streak, suggested block moves). All numbers shown must come from real stored sessions. If there are fewer than 3 sessions, show an honest empty state ("Do a few blocks and I'll find your patterns").
- **Phase 2 (design the interface now, build later):** an LLM-backed implementation behind your own small backend proxy. **Never put an API key in the app.** The client sends only aggregated stats by default (minutes per day, start-hour histogram, goal, streak), never raw task titles unless the user opts in. The coach may only make suggestions the user can accept or ignore, and must not give medical or mental-health advice.

---

## 7. Notifications

`NotificationService` wraps `expo-notifications`: permission request with a pre-prompt, daily nudge at the chosen time (re-scheduled when the plan changes), the session grace-period reminder, and a "block starting soon" reminder 5 minutes before planned focus blocks (user-toggleable). Create an Android notification channel. Cancel and reschedule cleanly, and never stack duplicates.

---

## 8. Persistence and resilience

- Persist profile, plan, sessions and settings with MMKV through Zustand. Debounce writes.
- A running session survives app kill: persist `activeSession` and reconcile on launch (apply the 120s rule using timestamps).
- All dates stored as ISO strings or epoch milliseconds, with a single `dayKey(date)` helper implementing the 04:00 boundary.
- Include a "Reset data" action in a hidden dev menu (`__DEV__`).

---

## 9. Purchases

`PurchasesService` interface: `getOfferings()`, `purchase(pkg)`, `restore()`, `isPro()`. Implement with RevenueCat and a mock for tests and Expo Go-less development. Because there is no account system, rely on the store's receipt through RevenueCat's anonymous IDs and the Restore Purchases button. Gate Pro features through a single `usePro()` hook. **Free tier (v1):** 3 planned blocks a day, local rule-based insights summary only. Keep gating logic in one place so limits can change without touching screens. Product IDs and entitlement name come from a config file I will fill in; use clear TODO markers.

---

## 10. Analytics

Define an `Analytics` interface with a no-op default and a console logger in dev. Events: `onboarding_step_viewed {step}`, `onboarding_answer {step, value}`, `onboarding_completed`, `paywall_viewed`, `trial_started`, `plan_block_created`, `focus_started {plannedMin}`, `focus_completed {status, focusedSec}`, `moon_full {streak}`, `insight_action_applied`. Do not log free-text names or task titles.

---

## 11. Quality bar

- **Accessibility:** every control has an accessibility label and role; selected state announced; color is never the only signal; the moon and ring expose text equivalents ("Moon 60 percent lit"); support screen readers and font scaling; respect reduce motion.
- **Performance:** 60fps animations on mid-range Android; animate on the UI thread with Reanimated; memoize list items; no unnecessary re-renders in the live timer.
- **Layout:** works on small phones (360x640) and large ones; safe areas on all edges; Android edge-to-edge.
- **Error handling:** every service call has a failure path with a friendly message. Nothing crashes if notifications or purchases are unavailable.
- **Tests (required):** unit tests for `moonFill`, phase snapping, streak calculation across the 04:00 boundary, timer drift and the 120s grace rule, plan overlap detection and cost-screen math. Component tests for `OptionRow`, `Moon` and the onboarding auto-advance.
- **Types:** strict TypeScript, no `any` in `src/domain`.

---

## 12. Milestones and acceptance criteria

1. **M0 Scaffold:** tooling, folders, fonts, theme tokens, `expo-doctor` clean, development build running on a device or simulator, README with run commands.
2. **M1 Design system:** all primitives in section 2 with a hidden `/dev/gallery` route showing each one, including `Moon` at 0, 25, 50, 75, 100 and `clouded`.
3. **M2 Onboarding:** all 15 screens, persistence, resume, back navigation, analytics events. Trial screen uses the mock purchases service.
4. **M3 Tabs shell, Home, Plan:** custom tab bar, Home with real derived data, Plan timeline with add and edit and overlap prevention.
5. **M4 Focus engine:** setup, live session with correct timer and AppState behavior, completion, rewards and streak, kill-and-resume.
6. **M5 Insights:** rule-based companion, chat UI, bar chart card, applying a suggestion changes the plan.
7. **M6 Purchases and notifications:** RevenueCat integration, restore, free-tier gating, nudges and reminders.
8. **M7 Polish and QA:** accessibility pass, reduce motion, performance pass, real Epi pose images swapped in, final test and lint, release checklist for TestFlight and Play internal testing.

At the end of each milestone, list: what works, what is stubbed, and anything that needs my input (for example product IDs, final Epi images).

---

## 13. Assets I will provide

- Epi mascot images (transparent PNG or WebP) named `epi-wave`, `epi-write`, `epi-build`, `epi-chart`, `epi-cheer`, `epi-rest`, `epi-watch`. Use placeholders until they arrive and keep the `Epi` component's API stable.
- App icon and splash (until then, a moon on `night`).

Start now: inspect the project, then reply with the plan from section 0, point 1.
