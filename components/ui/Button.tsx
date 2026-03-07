import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  style,
  testID,
}) => {
  const isWeb = Platform.OS === 'web';
  const { colors } = useTheme();

  const buttonStyle = [
    styles.baseButton,
    variant === 'primary'
      ? { backgroundColor: colors.accent }
      : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder },
    disabled && styles.disabledButton,
    style,
  ];

  const textStyle = [
    styles.baseText,
    variant === 'primary' ? { color: '#ffffff' } : { color: colors.textSecondary },
    isWeb && styles.webFont,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  baseText: {
    fontSize: 14,
    fontWeight: '600',
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default Button;
