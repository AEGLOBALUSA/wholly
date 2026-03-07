import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Choice {
  id: string;
  label: string;
}

interface ForcedChoiceCardProps {
  question?: string;
  choices: Choice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const ForcedChoiceCard: React.FC<ForcedChoiceCardProps> = ({
  question,
  choices,
  selectedId,
  onSelect,
  disabled = false,
}) => {
  const isWeb = Platform.OS === 'web';
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.surfaceBorder }]}>
      {question && <Text style={[styles.questionText, { color: colors.text }, isWeb && styles.webFont]}>{question}</Text>}
      {!question && (
        <Text style={[styles.instructionText, { color: colors.textMuted }, isWeb && styles.webFont]}>
          Which statement sounds more like you?
        </Text>
      )}
      <View style={styles.choicesContainer}>
        {choices.map((choice, index) => {
          const isSelected = selectedId === choice.id;
          return (
            <React.Fragment key={choice.id}>
              {index > 0 && (
                <View style={styles.orContainer}>
                  <View style={[styles.orLine, { backgroundColor: colors.surfaceBorder }]} />
                  <Text style={[styles.orText, { color: colors.textMuted }, isWeb && styles.webFont]}>or</Text>
                  <View style={[styles.orLine, { backgroundColor: colors.surfaceBorder }]} />
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.choiceButton,
                  { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                  isSelected && { backgroundColor: colors.accentSubtle, borderColor: colors.accentBorder },
                  disabled && styles.disabled,
                ]}
                onPress={() => !disabled && onSelect(choice.id)}
                disabled={disabled}
                activeOpacity={0.7}
              >
                <View style={styles.choiceInner}>
                  <View style={[styles.radio, { borderColor: colors.surfaceBorder }, isSelected && { borderColor: colors.accent }]}>
                    {isSelected && <View style={[styles.radioDot, { backgroundColor: colors.accent }]} />}
                  </View>
                  <Text
                    style={[
                      styles.choiceText,
                      { color: colors.textSecondary },
                      isSelected && { color: colors.text },
                      isWeb && styles.webFont,
                    ]}
                  >
                    {choice.label}
                  </Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingBottom: 16,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
  choicesContainer: {
    gap: 0,
  },
  choiceButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  choiceInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  choiceText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  orText: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ForcedChoiceCard;
