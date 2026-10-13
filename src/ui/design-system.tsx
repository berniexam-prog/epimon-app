import IconBell from '@tabler/icons-react-native/IconBell';
import IconCalendarEvent from '@tabler/icons-react-native/IconCalendarEvent';
import IconHome from '@tabler/icons-react-native/IconHome';
import IconMoon from '@tabler/icons-react-native/IconMoon';
import IconMoonStars from '@tabler/icons-react-native/IconMoonStars';
import IconSparkles from '@tabler/icons-react-native/IconSparkles';
import IconSunrise from '@tabler/icons-react-native/IconSunrise';
import IconWind from '@tabler/icons-react-native/IconWind';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useReducedMotion
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, Rect } from 'react-native-svg';
import { color, fontFamily, radius, spacing, typography } from '../theme';

export type ButtonVariant = 'primary' | 'moon' | 'secondary' | 'ghost';
export type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: object;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  icon,
  style,
  fullWidth = true,
}: ButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMoon = variant === 'moon';
  const tonal = {
    primary: { base: color.violet, border: color.violetDeep, text: color.night },
    moon: { base: color.moon, border: color.moonDeep, text: color.night },
    secondary: { base: '#00000000', border: color.line, text: color.text },
    ghost: { base: '#00000000', border: '#00000000', text: color.mist },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={disabled ? 'Action unavailable' : undefined}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        { backgroundColor: tonal.base, borderColor: tonal.border, width: fullWidth ? '100%' : undefined },
        disabled && styles.buttonDisabled,
        pressed && !disabled && !prefersReducedMotion && styles.buttonPressed,
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: tonal.text }]}>{label}</Text>
      {icon ? <View style={styles.buttonIcon}>{icon}</View> : null}
    </Pressable>
  );
}

export function OptionRow({
  label,
  description,
  icon,
  selected = false,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionRow,
        selected && styles.optionRowSelected,
        pressed && !prefersReducedMotion && styles.optionRowPressed,
      ]}
    >
      <View style={styles.optionIconWrap}>{icon}</View>
      <View style={styles.optionTextWrap}>
        <Text style={styles.optionLabel}>{label}</Text>
        {description ? <Text style={styles.optionDescription}>{description}</Text> : null}
      </View>
      {selected ? <View style={styles.optionCheck} /> : null}
    </Pressable>
  );
}

export function Tile({
  label,
  icon,
  selected = false,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, selected && styles.tileSelected, pressed && !prefersReducedMotion && styles.tilePressed]}
    >
      <View style={styles.tileIcon}>{icon}</View>
      <Text style={styles.tileText}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  active = false,
  trailing,
}: {
  label: string;
  active?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      {trailing}
    </View>
  );
}

export function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Segmented({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (item: string) => void;
}) {
  return (
    <View style={styles.segmented}>
      {items.map((item) => {
        const active = item === value;
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(item)}
            style={[styles.segmentedButton, active && styles.segmentedButtonActive]}
          >
            <Text style={[styles.segmentedText, active && styles.segmentedTextActive]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
}: {
  value: boolean;
  onValueChange: (next: boolean) => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? 'Toggle'}
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[styles.toggleOuter, value && styles.toggleOuterOn]}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </Pressable>
  );
}

export function ProgressBar({
  value,
  height = 8,
  accessibilityLabel,
}: {
  value: number;
  height?: number;
  accessibilityLabel?: string;
}) {
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? `Progress ${Math.round(clamped * 100)} percent`}
      accessibilityRole="progressbar"
      style={[styles.progressTrack, { height }]}
    >
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: `${clamped * 100}%`,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

export function Moon({
  size = 88,
  fill = 0,
  clouded = false,
  accessibilityLabel,
}: {
  size?: number;
  fill?: number;
  clouded?: boolean;
  accessibilityLabel?: string;
}) {
  const safeFill = Math.min(1, Math.max(0, fill));
  const clipId = React.useId().replace(/:/g, '');

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? `Moon ${Math.round(safeFill * 100)} percent lit`}
      style={{ width: size, height: size, position: 'relative' }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <ClipPath id={clipId}>
            <Rect y={100 - safeFill * 100} width={100} height={100} />
          </ClipPath>
        </Defs>
        <Circle cx={50} cy={50} r={46} fill="#262A52" />
        <G clipPath={`url(#${clipId})`}>
          <Circle cx={50} cy={50} r={46} fill={color.moon} />
          <Circle cx={34} cy={38} r={8} fill={color.moonDeep} opacity={0.25} />
          <Circle cx={62} cy={58} r={11} fill={color.moonDeep} opacity={0.2} />
          <Circle cx={44} cy={72} r={5} fill={color.moonDeep} opacity={0.25} />
        </G>
      </Svg>
      {clouded ? (
        <View style={[styles.moonCloud, { width: size, height: size }]} pointerEvents="none">
          <View style={styles.cloudLineA} />
          <View style={styles.cloudLineB} />
        </View>
      ) : null}
    </View>
  );
}

export function ProgressRing({
  size,
  progress,
  children,
}: {
  size: number;
  progress: number;
  children?: React.ReactNode;
}) {
  const clamped = Math.min(1, Math.max(0, progress));
  const radiusValue = 108;
  const circumference = 2 * Math.PI * radiusValue;
  const offset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} viewBox="0 0 240 240" style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={120} cy={120} r={radiusValue} fill="none" stroke={color.line} strokeWidth={10} />
        <Circle
          cx={120}
          cy={120}
          r={radiusValue}
          fill="none"
          stroke={color.moon}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </Svg>
      <View style={styles.progressRingInner}>{children}</View>
    </View>
  );
}

export function Epi({
  pose = 'wave',
  size = 120,
}: {
  pose?: 'wave' | 'write' | 'build' | 'chart' | 'cheer' | 'rest' | 'watch';
  size?: number;
}) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="g" cx="50%" cy="35%" r="50%">
          <stop offset="0%" stop-color="#8F86F0" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#8F86F0" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#g)"/>
      <ellipse cx="100" cy="112" rx="64" ry="58" fill="#F6EBB4" opacity="0.9"/>
      <ellipse cx="80" cy="92" rx="18" ry="20" fill="#0E1024" opacity="0.18"/>
      <ellipse cx="120" cy="92" rx="18" ry="20" fill="#0E1024" opacity="0.18"/>
      <circle cx="80" cy="92" r="7" fill="#0E1024"/>
      <circle cx="120" cy="92" r="7" fill="#0E1024"/>
      <path d="M78 124 Q100 142 122 124" fill="none" stroke="#0E1024" stroke-width="6" stroke-linecap="round"/>
      <path d="M100 70 L110 86 L100 98 L90 86 Z" fill="#0E1024" opacity="0.2"/>
      <path d="M50 70 Q100 30 150 70" fill="none" stroke="#8F86F0" stroke-width="12" stroke-linecap="round" opacity="0.38"/>
    </svg>
  `;

  return (
    <View style={[styles.epiWrap, { width: size, height: size }]}>
      <Image
        source={{ uri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }}
        contentFit="contain"
        style={{ width: size, height: size }}
        accessibilityLabel={`Epi ${pose} pose`}
      />
    </View>
  );
}

export function TabBar({
  activeTab = 0,
  onChange,
}: {
  activeTab?: number;
  onChange: (tab: number) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const tabs = [
    { label: 'Home', icon: IconHome },
    { label: 'Plan', icon: IconCalendarEvent },
    { label: 'Focus', icon: IconMoonStars, center: true },
    { label: 'Insights', icon: IconSparkles },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => {
        const IconComponent = tab.icon;
        const isActive = index === activeTab;
        const isFocus = tab.center;

        return (
          <Pressable
            key={tab.label}
            accessibilityRole="button"
            accessibilityLabel={`${tab.label} tab`}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(index)}
            style={({ pressed }) => [styles.tabButton, isFocus && !prefersReducedMotion && styles.focusTabButton, pressed && styles.tabButtonPressed]}
          >
            {isFocus ? (
              <View style={[styles.focusTabInner, isActive && styles.focusTabInnerActive]}>
                <IconComponent size={24} color={color.night} strokeWidth={2.3} />
              </View>
            ) : (
              <IconComponent
                size={22}
                color={isActive ? color.violet : color.mist}
                strokeWidth={isActive ? 2.4 : 2}
              />
            )}
            {!isFocus ? <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function Timeline({
  blocks,
}: {
  blocks: Array<{ id: string; label: string; start: number; duration: number; kind: 'focus' | 'plan' | 'rest'; glow?: number; timeLabel?: string; dimmed?: boolean }>; 
}) {
  return (
    <View style={styles.timeline}>
      {blocks.map((block) => (
        <TimelineBlock key={block.id} {...block} />
      ))}
    </View>
  );
}

export function TimelineBlock({
  label,
  start,
  duration,
  kind,
  glow,
  timeLabel,
  dimmed = false,
}: {
  label: string;
  start: number;
  duration: number;
  kind: 'focus' | 'plan' | 'rest';
  glow?: number;
  timeLabel?: string;
  dimmed?: boolean;
}) {
  const height = Math.max(40, duration * 1.6);
  const leftColor =
    kind === 'focus' ? color.moon : kind === 'plan' ? color.violet : color.den;

  return (
    <View style={[styles.timelineRow, dimmed && styles.timelineRowDimmed]}>
      <Text style={styles.timelineTime}>{timeLabel ?? `${start}:00`}</Text>
      <View style={styles.timelineRail} />
      <View style={[styles.timelineBlock, { height, borderLeftColor: leftColor, backgroundColor: kind === 'focus' ? 'rgba(246,235,180,0.12)' : kind === 'plan' ? 'rgba(143,134,240,0.18)' : color.den }]}> 
        <View>
          <Text style={styles.timelineBlockTitle}>{label}</Text>
          <Text style={styles.timelineBlockMeta}>{duration} min</Text>
        </View>
        {glow ? <Text style={styles.timelineGlint}>+{glow}</Text> : null}
      </View>
    </View>
  );
}

export function GalleryShell() {
  return (
    <ScrollView contentContainerStyle={styles.galleryContainer}>
      <Text style={styles.galleryTitle}>Epimon design system</Text>
      <Text style={styles.gallerySubtitle}>Buttons, moon states, cards, and the component primitives for the first milestone.</Text>

      <View style={styles.sectionRow}>
        <Button label="Build my plan" variant="moon" />
        <Button label="Continue" variant="primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Ghost" variant="ghost" />
      </View>

      <Card style={styles.previewCard}>
        <Text style={styles.sectionTitle}>Option rows</Text>
        <OptionRow label="Putting things off" icon={<IconWind size={20} color={color.mist} />} selected />
        <OptionRow label="Burnout" icon={<IconBell size={20} color={color.mist} />} />
      </Card>

      <Card style={styles.previewCard}>
        <Text style={styles.sectionTitle}>Tiles & chips</Text>
        <View style={styles.tileGrid}>
          <Tile label="Morning" icon={<IconSunrise size={30} color={color.moon} />} selected />
          <Tile label="Evening" icon={<IconMoon size={30} color={color.mist} />} />
        </View>
        <View style={styles.chipRow}>
          <Chip label="In control" active />
          <Chip label="15 min" />
          <Badge label="Epi's pick" />
        </View>
      </Card>

      <Card style={styles.previewCard}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <ProgressBar value={0.72} />
        <View style={styles.moonRow}>
          <Moon size={56} fill={0} />
          <Moon size={56} fill={0.25} />
          <Moon size={56} fill={0.5} />
          <Moon size={56} fill={0.75} />
          <Moon size={56} fill={1} />
          <Moon size={56} fill={0.6} clouded />
        </View>
      </Card>

      <Card style={styles.previewCard}>
        <Text style={styles.sectionTitle}>Progress ring & Epi</Text>
        <View style={styles.ringRow}>
          <ProgressRing size={160} progress={0.65}>
            <Moon size={72} fill={0.65} />
          </ProgressRing>
          <Epi size={100} pose="wave" />
        </View>
      </Card>

      <Card style={styles.previewCard}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <Timeline
          blocks={[
            { id: 'b1', label: 'Pick one thing', start: 9, duration: 10, kind: 'plan', timeLabel: '9:00' },
            { id: 'b2', label: 'Starter focus', start: 9, duration: 20, kind: 'focus', glow: 15, timeLabel: '9:10' },
            { id: 'b3', label: 'Walk with Epi', start: 9, duration: 10, kind: 'rest', timeLabel: '9:30' },
          ]}
        />
      </Card>

      <Card style={styles.previewCard}>
        <Text style={styles.sectionTitle}>Tab bar</Text>
        <TabBar activeTab={2} onChange={() => undefined} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    minHeight: 48,
    borderRadius: radius.button,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    gap: 8,
  },
  buttonPressed: {
    transform: [{ translateY: 3 }],
  },
  buttonText: {
    fontFamily: fontFamily.heading,
    fontSize: typography.md,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: color.line,
    borderBottomWidth: 4,
    borderRadius: radius.optionRow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: color.den,
    marginBottom: spacing.sm,
  },
  optionRowSelected: {
    borderColor: color.moon,
    backgroundColor: 'rgba(246,235,180,0.08)',
  },
  optionRowPressed: {
    transform: [{ translateY: 1 }],
  },
  optionIconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextWrap: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
    color: color.text,
  },
  optionDescription: {
    fontFamily: fontFamily.bodyRegular,
    color: color.mist,
    fontSize: typography.sm,
  },
  optionCheck: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.moon,
  },
  tile: {
    flex: 1,
    minHeight: 110,
    borderWidth: 2,
    borderColor: color.line,
    borderBottomWidth: 4,
    borderRadius: radius.card,
    backgroundColor: color.den,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileSelected: {
    borderColor: color.moon,
    backgroundColor: 'rgba(246,235,180,0.08)',
  },
  tilePressed: {
    transform: [{ translateY: 1 }],
  },
  tileIcon: {
    marginBottom: spacing.xs,
  },
  tileText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.sm,
    color: color.text,
    textAlign: 'center',
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: color.dusk,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipActive: {
    backgroundColor: color.violet,
  },
  chipText: {
    color: color.text,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.xs,
  },
  chipTextActive: {
    color: color.night,
  },
  badge: {
    backgroundColor: color.moon,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 10,
    color: color.night,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: color.den,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: color.line,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: color.den,
    borderRadius: radius.optionRow,
    borderWidth: 1,
    borderColor: color.line,
    padding: 4,
    gap: 4,
  },
  segmentedButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.optionRow,
  },
  segmentedButtonActive: {
    backgroundColor: color.violet,
  },
  segmentedText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.sm,
    color: color.mist,
  },
  segmentedTextActive: {
    color: color.night,
  },
  toggleOuter: {
    width: 42,
    height: 24,
    borderRadius: 12,
    backgroundColor: color.line,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOuterOn: {
    backgroundColor: color.violet,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: color.text,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  progressTrack: {
    width: '100%',
    backgroundColor: color.line,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: color.moon,
  },
  moonCloud: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(154, 158, 196, 0.16)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudLineA: {
    width: '62%',
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(238,240,255,0.4)',
    marginBottom: 6,
  },
  cloudLineB: {
    width: '82%',
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(238,240,255,0.3)',
  },
  progressRingInner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  epiWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: color.den,
    borderTopWidth: 1,
    borderTopColor: color.line,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: spacing.xs,
    minHeight: 54,
  },
  focusTabButton: {
    transform: [{ translateY: -12 }],
  },
  focusTabInner: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: color.moon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: color.moonDeep,
    shadowColor: color.night,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  focusTabInnerActive: {
    backgroundColor: color.moon,
  },
  tabButtonPressed: {
    opacity: 0.8,
  },
  tabLabel: {
    marginTop: 4,
    color: color.mist,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 11,
  },
  tabLabelActive: {
    color: color.violet,
  },
  timeline: {
    marginTop: spacing.sm,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timelineRowDimmed: {
    opacity: 0.5,
  },
  timelineTime: {
    width: 38,
    fontFamily: fontFamily.bodyRegular,
    color: color.mist,
    fontSize: 11,
  },
  timelineRail: {
    width: 2,
    height: 54,
    backgroundColor: color.line,
    marginRight: spacing.sm,
  },
  timelineBlock: {
    flex: 1,
    borderLeftWidth: 4,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
  },
  timelineBlockTitle: {
    color: color.text,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.sm,
  },
  timelineBlockMeta: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: 11,
  },
  timelineGlint: {
    color: color.moon,
    fontFamily: fontFamily.bodyBold,
    fontSize: 11,
    marginLeft: 'auto',
  },
  galleryContainer: {
    padding: spacing.lg,
    paddingBottom: 64,
    backgroundColor: color.night,
  },
  galleryTitle: {
    fontFamily: fontFamily.heading,
    fontSize: typography.xxl,
    color: color.text,
    marginBottom: spacing.xs,
  },
  gallerySubtitle: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    color: color.mist,
    marginBottom: spacing.lg,
  },
  sectionRow: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
    color: color.text,
    marginBottom: spacing.sm,
  },
  previewCard: {
    marginBottom: spacing.lg,
  },
  tileGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  moonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
