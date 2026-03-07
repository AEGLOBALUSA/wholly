import { View, Text, ScrollView, Platform, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { analytics } from '../../context/AnalyticsContext';
import {
  DEEP_INSIGHTS_SECTIONS,
  TOTAL_DEEP_QUESTIONS,
} from '../../data/questions/deepInsights';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';

const isWeb = Platform.OS === 'web';
const STORAGE_KEY = 'deepInsightsAnswers';

export default function DeepInsightsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Load saved answers
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          // Check if already complete
          if (Object.keys(parsed).length >= TOTAL_DEEP_QUESTIONS) {
            setIsComplete(true);
          }
        }
      } catch (e) {
        console.error('Failed to load deep insights:', e);
      }
    };
    load();
  }, []);

  // Save on change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      } catch (e) {
        console.error('Failed to save deep insights:', e);
      }
    };
    if (Object.keys(answers).length > 0) save();
  }, [answers]);

  const section = DEEP_INSIGHTS_SECTIONS[currentSection];
  const totalAnswered = Object.keys(answers).length;
  const progressPct = Math.round((totalAnswered / TOTAL_DEEP_QUESTIONS) * 100);

  const sectionAnswered = useMemo(() => {
    return section.questions.filter(q => answers[q.id]).length;
  }, [section, answers]);

  const sectionComplete = sectionAnswered === section.questions.length;

  const handleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextSection = () => {
    if (currentSection < DEEP_INSIGHTS_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // All sections done
      setIsComplete(true);
      analytics.track('deep_insights_complete', {
        total_questions: TOTAL_DEEP_QUESTIONS,
        total_answered: totalAnswered + sectionAnswered,
      });
    }
  };

  const handleFinish = () => {
    router.replace('/onboarding/results');
  };

  if (isComplete) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>{'🎉'}</Text>
          <Text style={[styles.title, { color: colors.text }, isWeb && styles.webFont]}>
            Deep Insights Complete
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }, isWeb && styles.webFont]}>
            You've gone deeper than most. Your matches will now reflect a richer understanding of how you love, handle emotions, and bond with others.
          </Text>
        </View>

        {/* Summary */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          {DEEP_INSIGHTS_SECTIONS.map((sec) => {
            const answered = sec.questions.filter(q => answers[q.id]).length;
            return (
              <View key={sec.id} style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 20 }}>{sec.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.text,
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}>
                      {sec.title}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}>
                      {answered}/{sec.questions.length} answered
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: '#4CAF7D',
                    ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                  }}>
                    {'✓'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{
          backgroundColor: colors.accentSubtle,
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 13,
            color: colors.text,
            lineHeight: 20,
            textAlign: 'center',
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            Your compatibility scores will now include attachment compatibility, emotional regulation alignment, and love language matching.
          </Text>
        </View>

        <Button
          title="Back to Matches"
          onPress={handleFinish}
          variant="primary"
        />
        <ThemeToggle />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 4, letterSpacing: 1, ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}) }}>
          OPTIONAL DEEP DIVE
        </Text>
        <Text style={[styles.title, { color: colors.text }, isWeb && styles.webFont]}>
          {section.icon} {section.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }, isWeb && styles.webFont]}>
          {section.subtitle}
        </Text>
      </View>

      {/* Science info block */}
      {'science' in section && (
        <View style={{
          backgroundColor: colors.accentSubtle,
          borderRadius: 10,
          padding: 14,
          marginBottom: 20,
          borderLeftWidth: 3,
          borderLeftColor: colors.accent,
        }}>
          <Text style={{
            fontSize: 11,
            fontWeight: '600',
            color: colors.accent,
            letterSpacing: 0.5,
            marginBottom: 4,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            THE SCIENCE
          </Text>
          <Text style={{
            fontSize: 12,
            color: colors.textSecondary,
            lineHeight: 18,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            {(section as any).science}
          </Text>
        </View>
      )}

      {/* Progress */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: colors.textSecondary,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            Section {currentSection + 1} of {DEEP_INSIGHTS_SECTIONS.length}
          </Text>
          <Text style={{
            fontSize: 12,
            color: colors.textMuted,
            ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
          }}>
            {totalAnswered}/{TOTAL_DEEP_QUESTIONS} total
          </Text>
        </View>
        {/* Progress bar */}
        <View style={{
          height: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: `${progressPct}%`,
            borderRadius: 2,
            backgroundColor: colors.accent,
          }} />
        </View>

        {/* Section dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 }}>
          {DEEP_INSIGHTS_SECTIONS.map((sec, i) => {
            const secAnswered = sec.questions.filter(q => answers[q.id]).length;
            const secDone = secAnswered === sec.questions.length;
            const isCurrent = i === currentSection;
            return (
              <Pressable
                key={sec.id}
                onPress={() => setCurrentSection(i)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 9999,
                  backgroundColor: isCurrent ? colors.accent : secDone ? '#4CAF7D20' : colors.surface,
                  borderWidth: 1,
                  borderColor: isCurrent ? colors.accent : secDone ? '#4CAF7D40' : colors.surfaceBorder,
                }}
              >
                <Text style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: isCurrent ? '#ffffff' : secDone ? '#4CAF7D' : colors.textMuted,
                  ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                }}>
                  {sec.icon} {secDone ? '✓' : `${secAnswered}/${sec.questions.length}`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Questions */}
      <View style={{ gap: 20 }}>
        {section.questions.map((question, qIndex) => (
          <View key={question.id} style={[styles.questionCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Text style={{
              fontSize: 10,
              fontWeight: '600',
              color: colors.textMuted,
              letterSpacing: 0.5,
              marginBottom: 8,
              ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
            }}>
              Q{qIndex + 1}
            </Text>
            <Text style={{
              fontSize: 15,
              fontWeight: '500',
              color: colors.text,
              lineHeight: 22,
              marginBottom: 14,
              ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
            }}>
              {question.text}
            </Text>

            <View style={{ gap: 8 }}>
              {question.options?.map((option) => {
                const isSelected = answers[question.id] === option.value;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => handleSelect(question.id, option.value)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.accent : colors.surfaceBorder,
                      backgroundColor: isSelected ? colors.accentSubtle : 'transparent',
                    }}
                  >
                    <Text style={{
                      fontSize: 13,
                      color: isSelected ? colors.accent : colors.textSecondary,
                      fontWeight: isSelected ? '600' : '400',
                      lineHeight: 20,
                      ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
                    }}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* Footer Actions */}
      <View style={{ gap: 12, marginTop: 32 }}>
        <Button
          title={currentSection < DEEP_INSIGHTS_SECTIONS.length - 1
            ? `Next: ${DEEP_INSIGHTS_SECTIONS[currentSection + 1].title}`
            : 'Finish Deep Insights'}
          onPress={handleNextSection}
          variant="primary"
          disabled={!sectionComplete}
        />
        <Button
          title="Save & Return to Matches"
          onPress={handleFinish}
          variant="secondary"
        />
        <Text style={{
          fontSize: 11,
          color: colors.textMuted,
          textAlign: 'center',
          marginTop: 4,
          ...(isWeb ? { fontFamily: 'Inter, sans-serif' } : {}),
        }}>
          This is completely optional. Your progress is saved automatically.
        </Text>
      </View>

      <ThemeToggle />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginTop: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
  },
  webFont: {
    fontFamily: 'Inter, sans-serif',
  },
  questionCard: {
    borderRadius: 14,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
