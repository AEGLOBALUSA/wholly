import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxListProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  disabled?: boolean;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  options,
  selectedValues,
  onToggle,
  disabled = false,
}) => {
  const isWeb = Platform.OS === 'web';
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
              isSelected && { backgroundColor: colors.accentSubtle, borderColor: colors.accentBorder },
              disabled && styles.disabled,
            ]}
            onPress={() => !disabled && onToggle(option.value)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.textMuted },
                isSelected && { borderColor: colors.accent, backgroundColor: colors.accent },
              ]}
            >
              {isSelected && <View style={styles.checkmark} />}
            </View>
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary },
                isSelected && { color: colors.text },
                isWeb && styles.webFont,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#ffffff',
    marginLeft: 2,
    marginBottom: 2,
    transform: [{ rotate: '-45deg' }],
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CheckboxList;
