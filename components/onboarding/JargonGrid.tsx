import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Jargon {
  id: string;
  label: string;
}

interface JargonGridProps {
  items: Jargon[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  disabled?: boolean;
  columns?: number;
}

const JargonGrid: React.FC<JargonGridProps> = ({
  items,
  selectedIds,
  onToggle,
  disabled = false,
  columns = 2,
}) => {
  const isWeb = Platform.OS === 'web';
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: Jargon }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.chip,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
          isSelected && { backgroundColor: colors.accentSubtle, borderColor: colors.accentBorder },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && onToggle(item.id)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.chipText,
            { color: colors.textSecondary },
            isSelected && { color: colors.text },
            isWeb && styles.webFont,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={styles.row}
        style={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default JargonGrid;
