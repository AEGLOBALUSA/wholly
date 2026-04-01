import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { COLORS, FONTS } from '../../styles/tokens';

interface Preferences {
  match_notifications: boolean;
  message_alerts: boolean;
  high_compatibility: boolean;
  weekly_digest: boolean;
  system_updates: boolean;
}

const DEFAULT_PREFS: Preferences = {
  match_notifications: true,
  message_alerts: true,
  high_compatibility: true,
  weekly_digest: true,
  system_updates: true,
};

const LABELS: Record<keyof Preferences, { title: string; desc: string }> = {
  match_notifications: {
    title: 'Match Notifications',
    desc: 'When someone expresses interest or you get a mutual match',
  },
  message_alerts: {
    title: 'Message Alerts',
    desc: 'When you receive a new message from a match',
  },
  high_compatibility: {
    title: 'High Compatibility Alerts',
    desc: 'When a strong or exceptional match is found',
  },
  weekly_digest: {
    title: 'Weekly Digest',
    desc: 'A summary of your week on WHOLLY',
  },
  system_updates: {
    title: 'System Updates',
    desc: 'Account changes, covenant reminders, and platform news',
  },
};

export default function EmailPreferences() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('email_preferences')
        .eq('auth_id', user.id)
        .single();

      if (data?.email_preferences) {
        setPrefs({ ...DEFAULT_PREFS, ...data.email_preferences });
      }
      setLoading(false);
    };

    load();
  }, [user?.id]);

  const toggle = async (key: keyof Preferences) => {
    if (!user?.id || !isSupabaseConfigured) return;

    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);

    await supabase
      .from('profiles')
      .update({ email_preferences: updated })
      .eq('auth_id', user.id);
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>Email Preferences</Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        Choose which emails you'd like to receive.
      </Text>

      {(Object.keys(LABELS) as (keyof Preferences)[]).map((key) => (
        <View
          key={key}
          style={[styles.row, { borderBottomColor: colors.surfaceBorder }]}
        >
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{LABELS[key].title}</Text>
            <Text style={[styles.rowDesc, { color: colors.textMuted }]}>{LABELS[key].desc}</Text>
          </View>
          <Switch
            value={prefs[key]}
            onValueChange={() => toggle(key)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  heading: {
    fontFamily: FONTS.headingMedium,
    fontSize: 18,
    marginBottom: 4,
  },
  subheading: {
    fontFamily: FONTS.body,
    fontSize: 14,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 16,
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: FONTS.bodyMedium, fontSize: 15 },
  rowDesc: { fontFamily: FONTS.body, fontSize: 13, lineHeight: 18 },
});
