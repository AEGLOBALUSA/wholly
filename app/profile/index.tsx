import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { updateProfile } from '../../services/profiles';
import { COLORS, FONTS, BORDER_RADIUS } from '../../styles/tokens';

const isWeb = Platform.OS === 'web';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, refreshProfile, signOut } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(profile?.bio || '');
  const [city, setCity] = useState(profile?.city || '');
  const [saving, setSaving] = useState(false);

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Sign In Required</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Sign in to view your profile.
          </Text>
          <Pressable
            onPress={() => router.push('/auth/sign-in')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(profile.id, { bio, city });
    await refreshProfile();
    setEditing(false);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const photoUrl = profile.photo_url;
  const initial = (profile.first_name || '?').charAt(0).toUpperCase();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: colors.accent, fontSize: 14, fontFamily: FONTS.bodyMedium }}>
            ← Back
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Avatar & Name */}
      <View style={styles.avatarSection}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 32, fontFamily: FONTS.heading, color: colors.accent }}>
              {initial}
            </Text>
          </View>
        )}
        <Text style={[styles.name, { color: colors.text }]}>
          {profile.first_name}, {profile.age}
        </Text>
        <Text style={[styles.location, { color: colors.textSecondary }]}>
          {profile.city}
        </Text>
        <View style={[styles.denomTag, { backgroundColor: colors.surface }]}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: FONTS.bodyMedium }}>
            {profile.denomination === 'futures-church' ? 'Futures Church' :
             profile.denomination === 'planetshakers' ? 'Planetshakers' :
             profile.denomination}
          </Text>
        </View>
      </View>

      {/* Bio Section */}
      <View style={[styles.section, { borderColor: colors.surfaceBorder }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          {!editing && (
            <Pressable onPress={() => setEditing(true)}>
              <Text style={{ color: colors.accent, fontSize: 13, fontFamily: FONTS.bodyMedium }}>
                Edit
              </Text>
            </Pressable>
          )}
        </View>

        {editing ? (
          <View style={{ gap: 12 }}>
            <TextInput
              style={[styles.input, {
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Write something about yourself..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={300}
            />
            <TextInput
              style={[styles.input, {
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              }]}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={colors.textMuted}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => { setEditing(false); setBio(profile.bio || ''); setCity(profile.city); }}
                style={[styles.editBtn, { backgroundColor: colors.surface }]}
              >
                <Text style={{ color: colors.textSecondary, fontFamily: FONTS.bodyMedium, fontSize: 14 }}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={saving}
                style={[styles.editBtn, { backgroundColor: colors.accent, flex: 2 }]}
              >
                <Text style={{ color: '#fff', fontFamily: FONTS.bodyMedium, fontSize: 14 }}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.textSecondary, fontFamily: FONTS.body, fontSize: 14, lineHeight: 22 }}>
            {profile.bio || 'No bio yet. Tap Edit to add one.'}
          </Text>
        )}
      </View>

      {/* Settings */}
      <View style={[styles.section, { borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>
          Settings
        </Text>

        {/* Theme Toggle */}
        <Pressable
          onPress={toggleTheme}
          style={[styles.settingRow, { borderBottomColor: colors.surfaceBorder }]}
        >
          <Text style={{ color: colors.text, fontFamily: FONTS.body, fontSize: 15 }}>
            Theme
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: FONTS.body, fontSize: 14 }}>
            {isDark ? 'Dark' : 'Light'}
          </Text>
        </Pressable>

        {/* Notifications */}
        <Pressable
          style={[styles.settingRow, { borderBottomColor: colors.surfaceBorder }]}
        >
          <Text style={{ color: colors.text, fontFamily: FONTS.body, fontSize: 15 }}>
            Notifications
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: FONTS.body, fontSize: 14 }}>
            Enabled
          </Text>
        </Pressable>

        {/* Email */}
        <View style={[styles.settingRow, { borderBottomColor: colors.surfaceBorder }]}>
          <Text style={{ color: colors.text, fontFamily: FONTS.body, fontSize: 15 }}>
            Email
          </Text>
          <Text style={{ color: colors.textMuted, fontFamily: FONTS.body, fontSize: 14 }}>
            {profile.email}
          </Text>
        </View>
      </View>

      {/* Sign Out */}
      <Pressable
        onPress={handleSignOut}
        style={[styles.signOutBtn, { borderColor: 'rgba(226,80,80,0.3)' }]}
      >
        <Text style={{ color: '#E25050', fontFamily: FONTS.bodyMedium, fontSize: 14 }}>
          Sign Out
        </Text>
      </Pressable>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 24,
    paddingBottom: 48,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    marginBottom: 24,
  },
  backBtn: { padding: 8 },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 20,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 32,
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
    backgroundColor: COLORS.charcoal,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: BORDER_RADIUS.full,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  buttonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 16,
    overflow: 'hidden',
  },
  name: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    marginBottom: 4,
  },
  location: {
    fontFamily: FONTS.body,
    fontSize: 15,
    marginBottom: 8,
  },
  denomTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
  },
  input: {
    fontFamily: FONTS.body,
    fontSize: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  signOutBtn: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
});
