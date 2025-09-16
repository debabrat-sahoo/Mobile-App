import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <AlertTriangle size={24} color="#EF4444" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginVertical: 8,
  },
  text: {
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});