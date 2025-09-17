import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

type SvgIllustrationProps = {
  xml?: string;
  width?: number | string;
  height?: number | string;
};

const placeholderSvg = `
<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#60A5FA"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="200" height="120" rx="16" fill="url(#g)"/>
  <circle cx="48" cy="60" r="20" fill="rgba(255,255,255,0.9)"/>
  <rect x="80" y="44" width="96" height="12" rx="6" fill="rgba(255,255,255,0.85)"/>
  <rect x="80" y="64" width="72" height="10" rx="5" fill="rgba(255,255,255,0.75)"/>
</svg>`;

export function SvgIllustration({ xml, width = '100%', height = 160 }: SvgIllustrationProps) {
  return (
    <View style={[styles.container, { height }]}> 
      <SvgXml xml={xml || placeholderSvg} width={width} height={height} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});

export default SvgIllustration;


