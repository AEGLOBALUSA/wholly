import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import RadioGroup from '../ui/RadioGroup';
import Input from '../ui/Input';
import CheckboxList from './CheckboxList';
import { useTheme } from '../../context/ThemeContext';

export interface RadioOption {
  value: string;
  label: string;
}

interface QuestionCardProps {
  question: string;
  type: 'radio' | 'text' | 'checkbox' | 'multiple-choice';
  options?: RadioOption[];
  value: string | string[] | null;
  onValueChange: (value: string | string[]) => void;
  errorMessage?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  type,
  options,
  value,
  onValueChange,
  errorMessage,
}) => {
  const isWeb = Platform.OS === 'web';
  const { colors } = useTheme();

  const renderContent = () => {
    switch (type) {
      case 'radio':
        return (
          options && (
            <RadioGroup
              options={options}
              selectedValue={
                typeof value === 'string' ? value : value?.[0] || null
              }
              onSelect={(selectedValue) => onValueChange(selectedValue)}
            />
          )
        );
      case 'multiple-choice':
        return (
          options && (
            <CheckboxList
              options={options}
              selectedValues={Array.isArray(value) ? value : []}
              onToggle={(toggledValue) => onValueChange(toggledValue)}
            />
          )
        );
      case 'text':
        return (
          <View style={styles.inputContainer}>
            <Input
              label="Your answer"
              value={typeof value === 'string' ? value : ''}
              onChangeText={(text) => onValueChange(text)}
              placeholder="Type your answer here..."
              error={errorMessage}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.questionText, { color: colors.text }, isWeb && styles.webFont]}>{question}</Text>
      {renderContent()}
      {errorMessage && type !== 'text' && (
        <Text style={[styles.errorText, isWeb && styles.webFont]}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 28,
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
  inputContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: '#D4726A',
    fontSize: 14,
    marginTop: 8,
  },
});

export default QuestionCard;
