import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  multiline,
  numberOfLines,
  style: extraStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isWeb = Platform.OS === 'web';
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.labelText, { color: colors.textSecondary }, isWeb && styles.webFont]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.inputBg, borderColor: isFocused ? colors.inputBorderFocus : colors.inputBorder },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            isWeb && styles.webFont,
            multiline && styles.multilineInput,
            multiline && isWeb && { minHeight: 100 },
            extraStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines || (multiline ? 4 : 1)}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...textInputProps}
        />
      </View>
      {error && <Text style={[styles.errorText, isWeb && styles.webFont]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  labelText: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    padding: 0,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#D4726A',
    marginTop: 6,
  },
});

export default Input;
