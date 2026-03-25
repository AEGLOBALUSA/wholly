import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getConversations, subscribeToMessages, unsubscribe } from '../../services/chat';
import { COLORS, FONTS } from '../../styles/tokens';

const isWeb = Platform.OS === 'web';

export default function ChatList() {
  const router = useRouter();
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!profile) return;
    const data = await getConversations(profile.id);
    setConversations(data);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    if (profile?.id) {
      loadConversations();
    } else {
      setLoading(false);
    }
  }, [profile, loadConversations]);

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyText}>
            Sign in to start chatting with your matches.
          </Text>
          <Pressable
            onPress={() => router.push('/auth/sign-in')}
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Loading conversations...</Text>
        </View>
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Conversations Yet</Text>
          <Text style={styles.emptyText}>
            When you and a match both express interest, a conversation will open here automatically.
          </Text>
          <Pressable
            onPress={() => router.push('/onboarding/results')}
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.buttonText}>View Matches</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      {conversations.map((convo) => {
        const name = convo.otherProfile?.first_name || 'Match';
        const initial = name.charAt(0).toUpperCase();
        const lastMsg = convo.lastMessage;
        const preview = lastMsg
          ? (lastMsg.sender_id === profile?.id ? 'You: ' : '') + lastMsg.content
          : 'Tap to start chatting';
        const unread = convo.unreadCount || 0;

        return (
          <Pressable
            key={convo.id}
            onPress={() => router.push(`/chat/${convo.id}`)}
            style={({ pressed }) => [
              styles.convoCard,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.convoInfo}>
              <Text style={[styles.convoName, unread > 0 && { fontFamily: FONTS.bodyBold }]}>
                {name}
              </Text>
              <Text style={styles.convoPreview} numberOfLines={1}>
                {preview}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              {convo.last_message_at && (
                <Text style={styles.convoTime}>
                  {new Date(convo.last_message_at).toLocaleDateString()}
                </Text>
              )}
              {unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{unread}</Text>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
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
    color: COLORS.text,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: COLORS.charcoal,
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
    borderBottomColor: COLORS.borderLight,
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 18,
    color: COLORS.primary,
  },
  convoInfo: {
    flex: 1,
  },
  convoName: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 2,
  },
  convoPreview: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  convoTime: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
});
