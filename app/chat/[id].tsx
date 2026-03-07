import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Platform,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  getMessages,
  sendMessage,
  subscribeToMessages,
  unsubscribe,
  markMessagesRead,
} from '../../services/chat';
import { Message } from '../../types/database';
import { FONTS, BORDER_RADIUS } from '../../styles/tokens';
import ThemeToggle from '../../components/ui/ThemeToggle';

const isWeb = Platform.OS === 'web';

export default function ChatRoom() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load messages
  useEffect(() => {
    if (!conversationId || !profile) return;

    const loadMessages = async () => {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      setLoading(false);
      await markMessagesRead(conversationId, profile.id);
    };

    loadMessages();

    // Subscribe to real-time messages
    const channel = subscribeToMessages(conversationId, (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender_id !== profile.id) {
        markMessagesRead(conversationId, profile.id);
      }
    });

    return () => {
      unsubscribe(channel);
    };
  }, [conversationId, profile]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !profile || !conversationId || sending) return;

    setSending(true);
    const msg = await sendMessage(conversationId, profile.id, newMessage);
    if (msg) {
      setNewMessage('');
    }
    setSending(false);
  };

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>Please sign in to chat.</Text>
        <ThemeToggle />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.surfaceBorder, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Conversation</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={[styles.messageList, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.messageContent}
      >
        {loading ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Loading messages...</Text>
        ) : messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Start the Conversation</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              You've both expressed interest. Say hello!
            </Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === profile.id;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  isMine ? [styles.myMessage, { backgroundColor: colors.text }] : [styles.theirMessage, { backgroundColor: colors.surface }],
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMine ? styles.myMessageText : [styles.theirMessageText, { color: colors.text }],
                  ]}
                >
                  {msg.content}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    isMine ? styles.myMessageTime : [styles.theirMessageTime, { color: colors.textMuted }],
                  ]}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputBar, { borderTopColor: colors.surfaceBorder, backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.inputBorder, placeholderTextColor: colors.textMuted }]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={1000}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          onPress={handleSend}
          disabled={sending || !newMessage.trim()}
          style={({ pressed }) => [
            styles.sendButton,
            { backgroundColor: colors.accent },
            (!newMessage.trim() || sending) && styles.sendDisabled,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
      <ThemeToggle />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
  },
  headerTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 17,
  },
  messageList: {
    flex: 1,
  },
  messageContent: {
    padding: 16,
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
  },
  messageTime: {
    fontFamily: FONTS.body,
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.5)',
  },
  theirMessageTime: {
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 15,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
