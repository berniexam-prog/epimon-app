import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusStore } from '../../stores/focus';
import { color, fontFamily, typography } from '../../theme';
import { Button, Chip, Moon } from '../../ui';

export default function FocusCompleteScreen() {
  const lastCompletedSession = useFocusStore((state) => state.lastCompletedSession);

  if (!lastCompletedSession) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Clouds pass.</Text>
        <Button label="Back home" variant="moon" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const fullMoon = lastCompletedSession.focusedSec >= lastCompletedSession.plannedMin * 60;
  
  // FIXED: Safely round or calculate focused minutes as a clean integer to prevent decimal text expansion bugs
  const focusedMinutes = Math.max(1, Math.round(lastCompletedSession.focusedSec / 60));

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Focus complete</Text>
      <Moon size={120} fill={fullMoon ? 1 : 0.5} />
      <Text style={styles.title}>{fullMoon ? 'Full moon.' : 'Moon charged.'}</Text>
      <Text style={styles.subtitle}>{lastCompletedSession.title}</Text>
      
      {/* FIXED: Uses rounded focusedMinutes and explicit safe styling instead of broken decimals */}
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {focusedMinutes} min
      </Text>

      <View style={styles.chips}>
        <Chip label={fullMoon ? 'Goal complete' : 'On track'} active={fullMoon} />
        <Chip label='+1 glow' />
      </View>

      <Button label="Done" variant="moon" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.night,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  kicker: {
    color: color.mist,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.sm,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.xxl,
    marginTop: 12,
  },
  subtitle: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
  },
  value: {
    color: color.moon,
    fontFamily: fontFamily.heading,
    fontSize: 48, // FIXED: Explicit safe size instead of broken typography.display stretching
    lineHeight: 56,
    letterSpacing: 1,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 8,
  },
});