import IconArrowLeft from '@tabler/icons-react-native/IconArrowLeft';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, fontFamily, typography } from '../../theme';
import { Epi } from '../../ui';

export function ScreenShell({
  title,
  subtitle,
  progress,
  onBack,
  children,
  pose = 'write',
}: {
  title: string;
  subtitle?: string;
  progress: number;
  onBack?: () => void;
  children: ReactNode;
  pose?: 'wave' | 'write' | 'build' | 'chart' | 'cheer' | 'rest' | 'watch';
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.progressRow}>
        {onBack ? (
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <IconArrowLeft size={20} color={color.text} />
          </Pressable>
        ) : null}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.heroWrap}>
        <Epi pose={pose} size={110} />
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.night,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.den,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: color.line,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: color.moon,
  },
  heroWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: typography.xl,
    color: color.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    color: color.mist,
    marginBottom: 16,
    lineHeight: 22,
  },
});
