/**
 * WHOLLY — Photo Upload Component
 *
 * Allows users to select and upload profile photos.
 * Uses web file input on web, expo-image-picker on native.
 */

import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Platform } from 'react-native';
import { uploadPhoto, deletePhoto, updateProfilePhotos, MAX_PHOTOS } from '../services/photos';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../styles/tokens';

const isWeb = Platform.OS === 'web';

interface PhotoUploadProps {
  profileId: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export default function PhotoUpload({ profileId, photos, onPhotosChange }: PhotoUploadProps) {
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickPhoto = async () => {
    if (photos.length >= MAX_PHOTOS) return;

    if (isWeb) {
      // Trigger hidden file input
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileUri = URL.createObjectURL(file);
    const url = await uploadPhoto(profileId, fileUri, file.name);

    if (url) {
      const newPhotos = [...photos, url];
      await updateProfilePhotos(profileId, newPhotos);
      onPhotosChange(newPhotos);
    }
    setUploading(false);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = async (index: number) => {
    const photoUrl = photos[index];
    await deletePhoto(photoUrl);

    const newPhotos = photos.filter((_, i) => i !== index);
    await updateProfilePhotos(profileId, newPhotos);
    onPhotosChange(newPhotos);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        Photos ({photos.length}/{MAX_PHOTOS})
      </Text>
      <Text style={[styles.hint, { color: colors.textMuted }]}>
        Photos are only shown after mutual interest
      </Text>

      <View style={styles.grid}>
        {photos.map((url, i) => (
          <View key={i} style={styles.photoWrapper}>
            <Image source={{ uri: url }} style={styles.photo} />
            <Pressable
              onPress={() => handleRemovePhoto(i)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeText}>X</Text>
            </Pressable>
          </View>
        ))}

        {photos.length < MAX_PHOTOS && (
          <Pressable
            onPress={handlePickPhoto}
            disabled={uploading}
            style={[styles.addBtn, {
              borderColor: colors.surfaceBorder,
              backgroundColor: colors.surface,
            }]}
          >
            <Text style={{ fontSize: 24, color: colors.textMuted }}>
              {uploading ? '...' : '+'}
            </Text>
            <Text style={{ fontSize: 11, color: colors.textMuted, fontFamily: FONTS.body }}>
              {uploading ? 'Uploading' : 'Add Photo'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Hidden file input for web */}
      {isWeb && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
  },
  hint: {
    fontFamily: FONTS.body,
    fontSize: 12,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  addBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});
