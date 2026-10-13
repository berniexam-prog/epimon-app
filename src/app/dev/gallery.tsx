import { StyleSheet, View } from 'react-native';
import { color, typography } from '../../theme';
import { GalleryShell } from '../../ui';

export default function DevGalleryScreen() {
  return (
    <View style={styles.container}>
      <GalleryShell />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.night,
  },
  title: {
    fontSize: typography.xl,
    color: color.text,
  },
});
