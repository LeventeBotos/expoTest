import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Palette, Radii } from '@/constants/design';

type Props = {
  children: ReactNode;
  tone?: 'primary' | 'peach' | 'sage' | 'ink' | 'foam';
};

export function Pill({ children, tone = 'primary' }: Props) {
  const background = getTone(tone);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {children}
    </View>
  );
}

function getTone(tone: Props['tone']) {
  switch (tone) {
    case 'peach':
      return `${Palette.peach}4D`;
    case 'sage':
      return `${Palette.sage}33`;
    case 'foam':
      return `${Palette.foam}3d`;
    case 'ink':
      return 'rgba(16, 22, 24, 0.08)';
    default:
      return `${Palette.primary}2b`;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
});
