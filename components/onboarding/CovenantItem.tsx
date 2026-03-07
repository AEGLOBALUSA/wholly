import React from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, SPACING, FONT_SIZES } from '../../styles/tokens';

interface CovenantStatement {
  id: string;
  text: string;
}

interface CovenantItemProps {
  statement: CovenantStatement;
  checked: boolean;
  onToggle: (id: string) => void;
  style?: ViewStyle;
}

const CovenantItem: React.FC<CovenantItemProps> = ({
  statement,
  checked,
  onToggle,
  style,
}) => {
  return (
    <Pressable
      onPress={() => onToggle(statement.id)}
      style={[styles.container, style]}
    >
      <View style={styles.checkbox}>
        {checked && (
          <View style={styles.checkboxFill}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>
      <Text style={styles.statement}>{statement.text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    flexShrink: 0,
  },
  checkboxFill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  statement: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
});

export default CovenantItem;
