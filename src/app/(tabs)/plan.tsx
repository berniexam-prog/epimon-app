import { StyleSheet, Text, View } from 'react-native';
import { color, fontFamily, typography } from '../../theme';
import { Button, Card, Chip, Timeline } from '../../ui';

export default function PlanScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Plan</Text>
        <Chip label="Week" active />
      </View>

      <View style={styles.dateRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <View key={day} style={[styles.dateCell, index === 2 && styles.dateCellActive]}>
            <Text style={[styles.dateDay, index === 2 && styles.dateDayActive]}>{day}</Text>
            <Text style={[styles.dateNumber, index === 2 && styles.dateNumberActive]}>{index + 8}</Text>
          </View>
        ))}
      </View>

      <Card style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Today</Text>
        <Timeline
          blocks={[
            { id: 'a', label: 'Pick one thing', start: 9, duration: 10, kind: 'plan', timeLabel: '9:00' },
            { id: 'b', label: 'Starter focus', start: 9, duration: 20, kind: 'focus', glow: 15, timeLabel: '9:10' },
            { id: 'c', label: 'Walk with Epi', start: 9, duration: 10, kind: 'rest', timeLabel: '9:30' },
          ]}
        />
      </Card>

      <View style={styles.footerRow}>
        <Button label="Inbox" variant="secondary" fullWidth={false} />
        <Button label="Plan with Epi" variant="moon" fullWidth={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.night,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.xxl,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  dateCell: {
    width: 42,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: color.den,
  },
  dateCellActive: {
    backgroundColor: 'rgba(246,235,180,0.08)',
    borderWidth: 1,
    borderColor: color.moon,
  },
  dateDay: {
    color: color.mist,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.xs,
  },
  dateDayActive: {
    color: color.moon,
  },
  dateNumber: {
    color: color.text,
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.sm,
    marginTop: 6,
  },
  dateNumberActive: {
    color: color.moon,
  },
  timelineCard: {
    padding: 18,
    marginBottom: 18,
  },
  timelineTitle: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
});
