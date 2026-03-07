import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = (current / total) * 100;
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.barContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.filledBar, { width: `${progress}%`, backgroundColor: colors.accent }]} />
      </View>
      <Text style={[styles.stepCounter, { color: colors.textMuted }]}>
        {current} of {total}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barContainer: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  filledBar: {
    height: '100%',
    borderRadius: 2,
  },
  stepCounter: {
    fontSize: 12,
    textAlign: 'right',
  },
});

export default ProgressBar;
