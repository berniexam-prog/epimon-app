import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { color, fontFamily, typography } from '../../theme';
import { Button, Moon } from '../../ui';

const dayDots = Array.from({ length: 30 }, (_, index) => index === 0);

export default function PlanPreviewScreen() {
  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'plan-preview' });
  }, []);

  return (
    <ScreenShell title="Your plan is ready" progress={90} pose="chart">
      <View style={styles.chips}>
        <Text style={styles.chip}>In control</Text>
        <Text style={styles.chip}>Mornings</Text>
        <Text style={styles.chip}>15 min a day</Text>
      </View>

      <Text style={styles.subhead}>Day one</Text>
      <View style={styles.timeline}>
        <View style={styles.blockPlan}><Text style={styles.blockText}>Pick one thing</Text><Text style={styles.blockMeta}>5 min</Text></View>
        <View style={styles.blockFocus}><Text style={styles.blockText}>Starter focus</Text><Text style={styles.blockMeta}>15 min</Text></View>
        <View style={styles.blockRest}><Text style={styles.blockText}>Walk with Epi</Text><Text style={styles.blockMeta}>5 min</Text></View>
      </View>

      <View style={styles.dotGrid}>
        {dayDots.map((active, index) => (
          <Moon key={index} size={16} fill={active ? 1 : 0} />
        ))}
      </View>

      <Button label="Looks good" variant="moon" onPress={() => router.push('/(onboarding)/commit')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: color.dusk,
    color: color.text,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.sm,
  },
  subhead: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
    color: color.mist,
    marginBottom: 10,
  },
  timeline: {
    gap: 8,
    marginBottom: 16,
  },
  blockPlan: {
    backgroundColor: 'rgba(143,134,240,0.14)',
    borderLeftWidth: 4,
    borderLeftColor: color.violet,
    borderRadius: 14,
    padding: 12,
  },
  blockFocus: {
    backgroundColor: 'rgba(246,235,180,0.12)',
    borderLeftWidth: 4,
    borderLeftColor: color.moon,
    borderRadius: 14,
    padding: 12,
  },
  blockRest: {
    backgroundColor: color.den,
    borderLeftWidth: 4,
    borderLeftColor: color.line,
    borderRadius: 14,
    padding: 12,
  },
  blockText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
    color: color.text,
  },
  blockMeta: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
    marginTop: 4,
    color: color.mist,
  },
  dotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
});
