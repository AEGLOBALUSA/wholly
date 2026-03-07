import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  VerificationRecord,
  VERIFIER_ROLES,
  ATTRIBUTE_CHIPS,
} from '../../data/verification';

const isWeb = Platform.OS === 'web';

interface VerificationBadgeProps {
  verification: VerificationRecord | null;
  size?: 'small' | 'medium';
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verification,
  size = 'medium',
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  if (!verification || verification.status !== 'completed') {
    return null;
  }

  // Get verifier role info
  const roleInfo = VERIFIER_ROLES.find(r => r.id === verification.verifier_role);

  // Get attribute chips that were selected
  const selectedChips = ATTRIBUTE_CHIPS.filter(chip =>
    verification.attributes.includes(chip.id)
  );

  const iconSize = size === 'small' ? 16 : 20;
  const containerGap = size === 'small' ? 4 : 6;

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { gap: containerGap }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        {/* Blue verification tick */}
        <View
          style={[
            styles.tickCircle,
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
            },
          ]}
        >
          <Text style={[styles.tickMark, { fontSize: iconSize * 0.55 }]}>
            ✓
          </Text>
        </View>

        {/* Label text for medium size */}
        {size === 'medium' && (
          <Text style={[styles.label, { color: colors.accent }]}>
            Verified by {roleInfo?.shortLabel || 'Pastor'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Modal for expanded details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.background }]}>
          {/* Close button area */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.surfaceBorder }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.closeButton, { color: colors.accent }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Verification Details
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={styles.modalContentInner}
            showsVerticalScrollIndicator={false}
          >
            {/* Verifier Card */}
            <View
              style={[
                styles.verifierCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                },
              ]}
            >
              <View style={styles.verifierHeader}>
                <View
                  style={[
                    styles.verifierInitials,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text style={styles.initials}>
                    {verification.verifier_name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={styles.verifierInfo}>
                  <Text style={[styles.verifierName, { color: colors.text }]}>
                    {verification.verifier_name}
                  </Text>
                  <Text
                    style={[styles.verifierRole, { color: colors.textSecondary }]}
                  >
                    {roleInfo?.label || 'Church Leader'}
                  </Text>
                </View>
              </View>

              {/* Church info */}
              <View style={styles.churchSection}>
                <Text style={[styles.churchName, { color: colors.text }]}>
                  {verification.verifier_church}
                </Text>
                <Text
                  style={[styles.denomination, { color: colors.textSecondary }]}
                >
                  {verification.verifier_denomination}
                </Text>
              </View>
            </View>

            {/* Attributes section */}
            {selectedChips.length > 0 && (
              <View style={styles.attributesSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Verified Attributes
                </Text>
                <View style={styles.attributesGrid}>
                  {selectedChips.map(chip => (
                    <View
                      key={chip.id}
                      style={[
                        styles.attributeChip,
                        {
                          backgroundColor: colors.accentSubtle,
                          borderColor: colors.accentBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.attributeLabel,
                          { color: colors.accent },
                        ]}
                      >
                        {chip.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Pastor's Note (Premium) */}
            {verification.pastors_note && (
              <View
                style={[
                  styles.noteCard,
                  {
                    backgroundColor: colors.accentSubtle,
                    borderColor: colors.accentBorder,
                  },
                ]}
              >
                <Text
                  style={[styles.noteLabel, { color: colors.textSecondary }]}
                >
                  Pastor's Note
                </Text>
                <Text style={[styles.noteText, { color: colors.text }]}>
                  {verification.pastors_note}
                </Text>
              </View>
            )}

            {/* Verification dates */}
            <View style={styles.datesSection}>
              <Text
                style={[styles.datesText, { color: colors.textSecondary }]}
              >
                Verified {formatDate(verification.completed_at)}
                {verification.expires_at && (
                  <>
                    {' '}
                    • Expires {formatDate(verification.expires_at)}
                  </>
                )}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

/**
 * Format ISO date string to readable format (e.g., "Mar 7, 2025")
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickCircle: {
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb
      ? {
          boxShadow: '0 1px 4px rgba(59,130,246,0.35)',
        }
      : {
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
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.3,
    fontFamily: isWeb ? 'Inter, sans-serif' : undefined,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    paddingTop: isWeb ? 0 : 44,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    fontSize: 24,
    fontWeight: '600',
    width: 24,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalContent: {
    flex: 1,
  },
  modalContentInner: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },

  // Verifier card
  verifierCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  verifierHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  verifierInitials: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  verifierInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  verifierName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  verifierRole: {
    fontSize: 12,
    fontWeight: '500',
  },
  churchSection: {
    gap: 4,
  },
  churchName: {
    fontSize: 14,
    fontWeight: '600',
  },
  denomination: {
    fontSize: 12,
  },

  // Attributes section
  attributesSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attributeChip: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  attributeLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },

  // Pastor's note
  noteCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Dates section
  datesSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  datesText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default VerificationBadge;
