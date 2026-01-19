import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pill } from '@/components/ui/pill';
import { SectionHeading } from '@/components/ui/section-heading';
import { Surface } from '@/components/ui/surface';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette, Radii } from '@/constants/design';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const supportLinks = [
  { id: 'faq', title: 'GYIK + tippek', icon: 'lightbulb.fill' as const },
  { id: 'community', title: 'Közösség + támogatók', icon: 'diversity.3' as const },
  { id: 'feedback', title: 'Visszajelzés küldése', icon: 'paperplane.fill' as const },
];

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoDownloads, setAutoDownloads] = useState(false);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.safeArea,
        { backgroundColor: scheme === 'dark' ? Palette.backgroundDark : Palette.backgroundLight },
      ]}>
      <ThemedView style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces>
          <Surface variant="raised" padding={16} style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarInitial}>L</ThemedText>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText style={styles.name}>Saját profil</ThemedText>
                <ThemedText style={styles.meta}>Önszeretet + én-idő</ThemedText>
              </View>
              <Pill tone="peach">
                <ThemedText style={styles.tier}>Free</ThemedText>
              </Pill>
            </View>
            <TouchableOpacity style={styles.upgradeButton} activeOpacity={0.9}>
              <IconSymbol name="star.fill" size={18} color="#0D1B1E" />
              <ThemedText style={styles.upgradeText}>Frissítés prémiumra</ThemedText>
            </TouchableOpacity>
          </Surface>

          <SectionHeading title="Beállítások" subtitle="Értesítés, haptika, téma" />
          <Surface variant="raised" padding={14} style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View>
                <ThemedText style={styles.settingTitle}>Értesítések</ThemedText>
                <ThemedText style={styles.settingHint}>Napi fókusz + emlékeztetők</ThemedText>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d7dde2', true: `${Palette.primary}70` }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingRow}>
              <View>
                <ThemedText style={styles.settingTitle}>Haptika</ThemedText>
                <ThemedText style={styles.settingHint}>Finom rezgés gombnyomáskor</ThemedText>
              </View>
              <Switch
                value={haptics}
                onValueChange={setHaptics}
                trackColor={{ false: '#d7dde2', true: `${Palette.primary}70` }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingRow}>
              <View>
                <ThemedText style={styles.settingTitle}>Sötét mód</ThemedText>
                <ThemedText style={styles.settingHint}>Automatikus sémát vált</ThemedText>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#d7dde2', true: `${Palette.primary}70` }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingRow}>
              <View>
                <ThemedText style={styles.settingTitle}>Offline mentés</ThemedText>
                <ThemedText style={styles.settingHint}>Wi-Fi-n töltse le a kedvenceket</ThemedText>
              </View>
              <Switch
                value={autoDownloads}
                onValueChange={setAutoDownloads}
                trackColor={{ false: '#d7dde2', true: `${Palette.primary}70` }}
                thumbColor="#fff"
              />
            </View>
          </Surface>

          <SectionHeading title="Támogatás" subtitle="Közösség, tippek, visszajelzés" />
          <View style={styles.supportRow}>
            {supportLinks.map((link) => (
              <Surface key={link.id} variant="raised" padding={14} style={styles.supportCard}>
                <View style={styles.supportIcon}>
                  <IconSymbol name={link.icon} size={18} color={Palette.primaryDeep} />
                </View>
                <ThemedText style={styles.supportTitle}>{link.title}</ThemedText>
                <TouchableOpacity style={styles.supportButton} activeOpacity={0.88}>
                  <ThemedText style={styles.supportButtonText}>Megnyitás</ThemedText>
                  <IconSymbol name="arrow.right" size={14} color={Palette.primaryDeep} />
                </TouchableOpacity>
              </Surface>
            ))}
          </View>

          <SectionHeading title="Adatvédelem" subtitle="Átlátható beállítások" />
          <Surface variant="tonal" tone="foam" padding={14} style={styles.privacyCard}>
            <View style={styles.privacyRow}>
              <ThemedText style={styles.privacyTitle}>Adatkezelés</ThemedText>
              <IconSymbol name="settings" size={18} color={Palette.primaryDeep} />
            </View>
            <ThemedText style={styles.privacyCopy}>
              A jegyzeteid csak helyben tárolódnak. A felhő mentést külön engedélyezheted.
            </ThemedText>
            <View style={styles.privacyActions}>
              <TouchableOpacity style={styles.privacyButton} activeOpacity={0.88}>
                <IconSymbol name="download" size={16} color="#0D1B1E" />
                <ThemedText style={styles.privacyButtonText}>Adat export</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.privacyGhost} activeOpacity={0.9}>
                <ThemedText style={styles.privacyGhostText}>Törlés kérése</ThemedText>
              </TouchableOpacity>
            </View>
          </Surface>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    margin: 18,
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radii.xl,
    backgroundColor: '#ecf1f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: Fonts.bodyBold,
    fontSize: 20,
    color: Palette.ink,
  },
  name: {
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    color: Palette.ink,
  },
  meta: {
    color: Palette.muted,
  },
  tier: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  upgradeButton: {
    backgroundColor: Palette.peach,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  upgradeText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodyBold,
  },
  settingsCard: {
    marginHorizontal: 18,
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingTitle: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.ink,
  },
  settingHint: {
    color: Palette.muted,
  },
  supportRow: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 12,
  },
  supportCard: {
    gap: 10,
    borderRadius: Radii.lg,
  },
  supportIcon: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    backgroundColor: '#f3f7f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 15,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  supportButtonText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  privacyCard: {
    margin: 18,
    gap: 10,
    borderRadius: Radii.lg,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 16,
  },
  privacyCopy: {
    color: Palette.muted,
    lineHeight: 20,
  },
  privacyActions: {
    flexDirection: 'row',
    gap: 10,
  },
  privacyButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e4e9ed',
  },
  privacyButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  privacyGhost: {
    flex: 1,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.peach,
  },
  privacyGhostText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
});
