import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { PastoralDepartment } from '../../types';

const isWeb = Platform.OS === 'web';

const DEPARTMENT_LABELS: Record<PastoralDepartment, string> = {
  'senior-pastor': 'Senior Pastor',
  'youth': 'Youth Pastor',
  'young-adults': 'Young Adults',
  'kids': 'Kids Ministry',
  'worship': 'Worship',
  'connect-groups': 'Connect Groups',
  'campus-pastor': 'Campus Pastor',
  'other': 'Church Leader',
};

interface VerifiedBadgeProps {
  department?: PastoralDepartment;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  department,
  size = 'md',
  showLabel = false,
}) => {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const fontSize = size === 'sm' ? 10 : size === 'md' ? 11 : 13;

  return (
    <View style={styles.container}>
      {/* Blue tick SVG as text for cross-platform */}
      <View style={[styles.tickCircle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}>
        <Text style={[styles.tickMark, { fontSize: iconSize * 0.55 }]}>✓</Text>
      </View>
      {showLabel && department && (
        <Text style={[styles.label, { fontSize }]}>
          {DEPARTMENT_LABELS[department] || 'Verified'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tickCircle: {
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb ? {
      boxShadow: '0 1px 4px rgba(59,130,246,0.35)',
    } as any : {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.35,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  tickMark: {
    color: '#ffffff',
    fontWeight: '700',
    marginTop: -1,
  },
  label: {
    color: '#3B82F6',
    fontWeight: '600',
    letterSpacing: 0.3,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },
});

export default VerifiedBadge;
