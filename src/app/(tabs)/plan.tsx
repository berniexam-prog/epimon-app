import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusStore, CustomPlanBlock } from '../../stores/focus';
import { color, fontFamily, typography } from '../../theme';
import { Button, Card, Chip, Timeline } from '../../ui';

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const { customBlocks, addCustomBlock, removeCustomBlock } = useFocusStore();

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isInboxModalVisible, setIsInboxModalVisible] = useState(false);

  // Modal Form Inputs
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('10:00 AM');
  const [importance, setImportance] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Hard'>('Moderate');

  const handleAddCustomTask = () => {
    if (!taskTitle.trim()) return;

    const newBlock: CustomPlanBlock = {
      id: Date.now().toString(),
      label: taskTitle.trim(),
      timeLabel: taskTime.trim() || '10:00 AM',
      duration: 25,
      kind: 'focus',
      importance,
      difficulty,
    };

    addCustomBlock(newBlock);
    setTaskTitle('');
    setImportance('Medium');
    setDifficulty('Moderate');
    setIsInboxModalVisible(false);
  };

  const handlePlanWithEpi = () => {
    router.push('/(tabs)/insights');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Plan</Text>
        <Chip label="Week" active />
      </View>

      <View style={styles.dateRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
          const isActive = selectedDateIndex === index;
          return (
            <TouchableOpacity
              key={day}
              activeOpacity={0.8}
              onPress={() => setSelectedDateIndex(index)}
              style={[styles.dateCell, isActive && styles.dateCellActive]}
            >
              <Text style={[styles.dateDay, isActive && styles.dateDayActive]}>
                {day}
              </Text>
              <Text style={[styles.dateNumber, isActive && styles.dateNumberActive]}>
                {index + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Card style={styles.timelineCard}>
        <View style={styles.timelineHeaderRow}>
          <Text style={styles.timelineTitle}>
            {selectedDateIndex === 0 ? 'Today' : `Day ${selectedDateIndex + 1} Preview`}
          </Text>
          <TouchableOpacity onPress={() => setIsInboxModalVisible(true)}>
            <Text style={styles.addBlockLink}>+ Add task</Text>
          </TouchableOpacity>
        </View>
        {customBlocks.length === 0 ? (
          <Text style={styles.emptyText}>No plan items yet. Tap inbox or add task to build your schedule.</Text>
        ) : (
          <Timeline blocks={customBlocks} />
        )}
      </Card>

      <View style={styles.footerRow}>
        <Button
          label="Inbox"
          variant="secondary"
          fullWidth={false}
          onPress={() => setIsInboxModalVisible(true)}
        />
        <Button
          label="Plan with Epi"
          variant="moon"
          fullWidth={false}
          onPress={handlePlanWithEpi}
        />
      </View>

      {/* Inbox Modal Input Sheet with Importance & Difficulty */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isInboxModalVisible}
        onRequestClose={() => setIsInboxModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to your plan</Text>
            <Text style={styles.modalSubtitle}>
              Define your task parameters, importance, and mental effort required.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Task Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Deep Work / Study Session"
                placeholderTextColor={color.mist}
                value={taskTitle}
                onChangeText={setTaskTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.textInput}
                placeholder="10:00 AM"
                placeholderTextColor={color.mist}
                value={taskTime}
                onChangeText={setTaskTime}
              />
            </View>

            {/* Importance Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Importance Level</Text>
              <View style={styles.chipSelectRow}>
                {(['High', 'Medium', 'Low'] as const).map((level) => (
                  <TouchableOpacity key={level} onPress={() => setImportance(level)}>
                    <Chip label={level} active={importance === level} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Difficulty Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Difficulty / Effort</Text>
              <View style={styles.chipSelectRow}>
                {(['Easy', 'Moderate', 'Hard'] as const).map((diff) => (
                  <TouchableOpacity key={diff} onPress={() => setDifficulty(diff)}>
                    <Chip label={diff} active={difficulty === diff} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                label="Cancel"
                variant="secondary"
                fullWidth={false}
                onPress={() => setIsInboxModalVisible(false)}
                style={styles.modalBtn}
              />
              <Button
                label="Add task"
                variant="moon"
                fullWidth={false}
                onPress={handleAddCustomTask}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.night },
  contentContainer: { paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  title: { color: color.text, fontFamily: fontFamily.heading, fontSize: typography.xxl },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  dateCell: { width: 42, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: color.den },
  dateCellActive: { backgroundColor: 'rgba(246,235,180,0.08)', borderWidth: 1, borderColor: color.moon },
  dateDay: { color: color.mist, fontFamily: fontFamily.bodyMedium, fontSize: typography.xs },
  dateDayActive: { color: color.moon },
  dateNumber: { color: color.text, fontFamily: fontFamily.bodyBold, fontSize: typography.sm, marginTop: 6 },
  dateNumberActive: { color: color.moon },
  timelineCard: { padding: 18, marginBottom: 18 },
  timelineHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  timelineTitle: { color: color.text, fontFamily: fontFamily.heading, fontSize: typography.lg },
  addBlockLink: { color: color.moon, fontFamily: fontFamily.bodyBold, fontSize: typography.sm },
  emptyText: { color: color.mist, fontFamily: fontFamily.bodyRegular, fontSize: typography.sm, paddingVertical: 12 },
  footerRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 8, 22, 0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: color.den, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderTopWidth: 1, borderColor: color.line },
  modalTitle: { color: color.text, fontFamily: fontFamily.heading, fontSize: typography.xl, marginBottom: 6 },
  modalSubtitle: { color: color.mist, fontFamily: fontFamily.bodyRegular, fontSize: typography.sm, marginBottom: 16, lineHeight: 20 },
  inputGroup: { marginBottom: 14 },
  inputLabel: { color: color.text, fontFamily: fontFamily.bodyMedium, fontSize: typography.xs, marginBottom: 6, textTransform: 'uppercase' },
  textInput: { backgroundColor: color.night, borderWidth: 1, borderColor: color.line, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, color: color.text, fontFamily: fontFamily.bodyRegular, fontSize: typography.md },
  chipSelectRow: { flexDirection: 'row', gap: 8 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  modalBtn: { flex: 1 },
});