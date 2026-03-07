import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getConversations } from '../../services/chat';
import { FONTS } from '../../styles/tokens';
import ThemeToggle from '../../components/ui/ThemeToggle';

const isWeb = Platform.OS === 'web';

export default function ChatList() {
  const router = useRouter();
  const { profile } = useAuth();
  const { colors } = useTheme();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadConversations();
    } else {
      setLoading(false);
    }
  }, [profile]);

  const loadConversations = async () => {
    if (!profile) return;
    const data = await getConversations(profile.id);
    setConversations(data);
    setLoading(false);
  };

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Sign In Required</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Sign in to start chatting with your matches.
          </Text>
          <Pressable
            onPress={() => router.push('/auth/sign-in')}
            style={({ pressed }) => [styles.button, { backgroundColor: colors.text }, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
        </View>
        <ThemeToggle />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading conversations...</Text>
        </View>
        <ThemeToggle />
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        </View>
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Conversations Yet</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            When you and a match both express interest, a conversation will open here automatically.
          </Text>
          <Pressable
            onPress={() => router.push('/onboarding/results')}
            style={({ pressed }) => [styles.button, { backgroundColor: colors.text }, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.buttonText}>View Matches</Text>
          </Pressable>
        </View>
        <ThemeToggle />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
      </View>

      {conversations.map((convo) => (
        <Pressable
          key={convo.id}
          onPress={() => router.push(`/chat/${convo.id}`)}
          style={({ pressed }) => [
            styles.convoCard,
            { borderBottomColor: colors.surfaceBorder },
            pressed && { opacity: 0.8 },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
            <Text style={[styles.avatarText, { color: colors.accent }]}>
              {/* First initial of the other person */}
              ?
            </Text>
          </View>
          <View style={styles.convoInfo}>
            <Text style={[styles.convoName, { color: colors.text }]}>Match</Text>
            <Text style={[styles.convoPreview, { color: colors.textMuted }]}>Tap to start chatting</Text>
          </View>
          {convo.last_message_at && (
            <Text style={[styles.convoTime, { color: colors.textMuted }]}>
              {new Date(convo.last_message_at).toLocaleDateString()}
            </Text>
          )}
        </Pressable>
      ))}
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
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 28,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 120,
  },
  emptyTitle: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 9999,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  buttonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  convoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 18,
  },
  convoInfo: {
    flex: 1,
  },
  convoName: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  convoPreview: {
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  convoTime: {
    fontFamily: FONTS.body,
    fontSize: 12,
  },
});
