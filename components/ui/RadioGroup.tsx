import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  disabled = false,
}) => {
  const isWeb = Platform.OS === 'web';
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
              isSelected && { backgroundColor: colors.accentSubtle, borderColor: colors.accentBorder },
              disabled && styles.disabled,
            ]}
            onPress={() => !disabled && onSelect(option.value)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radioCircle,
                { borderColor: colors.textMuted },
                isSelected && { borderColor: colors.accent, backgroundColor: colors.accent },
              ]}
            >
              {isSelected && <View style={styles.radioInner} />}
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
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
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

export default RadioGroup;
