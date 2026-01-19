import { StyleSheet, View } from 'react-native';

import { Palette, Radii } from '@/constants/design';

type Props = {
  value: number;
  trackColor?: string;
  progressColor?: string;
};

export function ProgressBar({ value, trackColor = '#e6eaee', progressColor = Palette.primary }: Props) {
  const width = Math.min(Math.max(value, 0), 100);

  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      <View style={[styles.fill, { width: `${width}%`, backgroundColor: progressColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radii.pill,
  },
});
