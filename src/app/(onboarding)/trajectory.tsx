import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { color, fontFamily, typography } from '../../theme';
import { Button, Moon } from '../../ui';

export default function TrajectoryScreen() {
  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'trajectory' });
  }, []);

  return (
    <ScreenShell title="Your trajectory" progress={90} pose="chart">
      <View style={styles.card}>
        <Svg width="100%" height={140} viewBox="0 0 300 160" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="moonArea" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor={color.moon} stopOpacity={0.38} />
              <Stop offset="1" stopColor={color.moon} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d="M0 105 Q80 90 150 55 T300 15" fill="none" stroke={color.moon} strokeWidth={3} />
          <Path d="M0 105 Q100 112 150 110 T300 114" fill="none" stroke={color.mist} strokeWidth={2} strokeDasharray="4 4" />
          <Path d="M0 105 Q80 90 150 55 T300 15 L300 160 L0 160 Z" fill="url(#moonArea)" />
        </Svg>
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}><Text style={{ color: color.moon }}>●</Text> With Epi</Text>
        <Text style={styles.legendText}><Text style={{ color: color.mist }}>●</Text> On your own</Text>
      </View>
      <View style={styles.summary}>
        <Moon size={44} fill={1} />
        <Text style={styles.summaryText}>30 full moons are in reach.</Text>
      </View>
      <Button label="See my plan" variant="moon" onPress={() => router.push('/(onboarding)/building')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.den,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.line,
    padding: 12,
    marginTop: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  legendText: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: color.den,
    borderRadius: 18,
    padding: 12,
    marginBottom: 18,
  },
  summaryText: {
    flex: 1,
    color: color.text,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
  },
});
