import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Palette } from '@/constants/design';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeading({ title, subtitle, actionLabel, onPressAction }: Props) {
  const scheme = useColorScheme() ?? 'light';

  return (
    <View style={styles.container}>
      <View>
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText style={[styles.subtitle, { color: Colors[scheme].muted }]}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {actionLabel ? (
        <TouchableOpacity style={styles.action} onPress={onPressAction} activeOpacity={0.8}>
          <ThemedText style={[styles.actionText, { color: Palette.primary }]}>
            {actionLabel}
          </ThemedText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  action: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(121, 188, 210, 0.12)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
