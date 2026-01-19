import { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Palette, Radii, Shadows } from '@/constants/design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Tone = 'primary' | 'peach' | 'sage' | 'foam' | 'neutral';

type SurfaceProps = ViewProps & {
  children?: ReactNode;
  variant?: 'raised' | 'tonal' | 'flat';
  tone?: Tone;
  padding?: number;
};

export function Surface({
  children,
  style,
  variant = 'raised',
  tone = 'neutral',
  padding = 16,
  ...rest
}: SurfaceProps) {
  const scheme = useColorScheme() ?? 'light';
  const paletteTone = getToneColor(tone);
  const background =
    variant === 'tonal'
      ? scheme === 'dark'
        ? addAlpha(paletteTone, 0.18)
        : addAlpha(paletteTone, 0.3)
      : Colors[scheme].surface;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: background, padding, borderColor: Colors[scheme].border },
        variant === 'raised' ? styles.raised : undefined,
        variant === 'flat' ? styles.flat : undefined,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

function getToneColor(tone: Tone) {
  switch (tone) {
    case 'primary':
      return Palette.primary;
    case 'peach':
      return Palette.peach;
    case 'sage':
      return Palette.sage;
    case 'foam':
      return Palette.foam;
    default:
      return Palette.ink;
  }
}

function addAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  raised: {
    ...Shadows.card,
  },
  flat: {
    borderWidth: 0,
  },
});
