import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { COLORS, FONTS, BORDER_RADIUS } from '../../styles/tokens';

const isWeb = Platform.OS === 'web';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, any>;
  read: boolean;
  created_at: string;
}

export default function NotificationList() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    setNotifications(data ?? []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user?.id || !isSupabaseConfigured) return;

    const channel = supabase
      .channel('notifications-list')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No notifications yet
        </Text>
      </View>
    );
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <View style={styles.container}>
      {hasUnread && (
        <Pressable onPress={markAllAsRead} style={styles.markAllBtn}>
          <Text style={[styles.markAllText, { color: colors.accent }]}>
            Mark all as read
          </Text>
        </Pressable>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => !item.read && markAsRead(item.id)}
            style={[
              styles.item,
              {
                backgroundColor: item.read ? colors.background : colors.surface,
                borderBottomColor: colors.surfaceBorder,
              },
            ]}
          >
            <View style={styles.itemHeader}>
              {!item.read && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
              <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.itemTime, { color: colors.textMuted }]}>
                {formatTime(item.created_at)}
              </Text>
            </View>
            <Text style={[styles.itemBody, { color: colors.textSecondary }]} numberOfLines={2}>
              {item.body}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { padding: 40, alignItems: 'center' },
  emptyText: { fontFamily: FONTS.body, fontSize: 15 },
  markAllBtn: {
    padding: 12,
    alignItems: 'flex-end',
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  markAllText: { fontFamily: FONTS.bodyMedium, fontSize: 13 },
  item: {
    padding: 16,
    borderBottomWidth: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  itemTitle: { fontFamily: FONTS.bodySemiBold, fontSize: 15, flex: 1 },
  itemTime: { fontFamily: FONTS.body, fontSize: 12 },
  itemBody: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 20 },
});
