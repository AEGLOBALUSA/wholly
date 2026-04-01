import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const Card: React.FC<CardProps> = ({ children, style, testID }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E8E0DC',
      padding: 16,
    },
  });

  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};

export default Card;
