import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../styles/tokens';

const isWeb = Platform.OS === 'web';

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id || !isSupabaseConfigured) return;

    // Fetch initial unread count
    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
      setUnreadCount(count ?? 0);
    };

    fetchCount();

    // Subscribe to realtime inserts
    const channel = supabase
      .channel('notifications-bell')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setUnreadCount((prev) => prev + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (!user || unreadCount === 0) return null;

  return (
    <Pressable
      onPress={() => router.push('/profile')}
      style={[styles.container, { borderColor: colors.surfaceBorder }]}
      accessibilityLabel={`${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
      accessibilityRole="button"
    >
      <Text style={styles.bellIcon}>🔔</Text>
      <View style={[styles.badge, { backgroundColor: colors.accent }]}>
        <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  bellIcon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 14,
  },
});
