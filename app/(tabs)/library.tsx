import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pill } from '@/components/ui/pill';
import { SectionHeading } from '@/components/ui/section-heading';
import { Surface } from '@/components/ui/surface';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette, Radii } from '@/constants/design';
import { Fonts } from '@/constants/theme';
import { FocusArea, focusAreas, replays, sessionLibrary, writingPrompts } from '@/constants/sessions';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LibraryScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [selectedFocus, setSelectedFocus] = useState<FocusArea['id'] | 'all'>('all');
  const [downloads, setDownloads] = useState<Record<string, boolean>>({});
  const [noteFilter, setNoteFilter] = useState('');
  const totalDownloads = useMemo(
    () => Object.values(downloads).filter(Boolean).length,
    [downloads]
  );

  const toneByFocus = useMemo(
    () =>
      focusAreas.reduce<Record<FocusArea['id'], string>>(
        (acc, item) => ({ ...acc, [item.id]: item.tone }),
        {
          'self-love': '#F06B73',
          'me-time': '#53B59B',
          roles: '#8F7CEE',
          presence: '#E8A23C',
        }
      ),
    []
  );

  const filteredSessions =
    selectedFocus === 'all'
      ? sessionLibrary
      : sessionLibrary.filter((session) => session.category === selectedFocus);

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
          <View style={styles.topAppBar}>
            <View>
              <ThemedText style={styles.topEyebrow}>Könyvtár</ThemedText>
              <ThemedText type="title" style={styles.topTitle}>
                Gyakorlatok + jegyzetek
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.topIcon} activeOpacity={0.85}>
              <IconSymbol name="download" size={20} color={Palette.ink} />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#e4f3fb', '#fef3eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}>
            <View style={styles.heroRow}>
              <View style={{ flex: 1, gap: 6 }}>
                <ThemedText style={styles.heroLabel}>Offline + mentett tartalom</ThemedText>
                <ThemedText style={styles.heroTitle}>Kedvencek, jegyzetek, hanganyagok</ThemedText>
                <ThemedText style={styles.heroMeta}>
                  {filteredSessions.length} gyakorlat • {replays.length} visszajátszás •{' '}
                  {totalDownloads} offline
                </ThemedText>
              </View>
              <View style={styles.heroPill}>
                <IconSymbol name="bookmark.fill" size={18} color={Palette.primaryDeep} />
                <ThemedText style={styles.heroPillText}>Mentett</ThemedText>
              </View>
            </View>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <ThemedText style={styles.heroStatLabel}>Hang + mozdulat</ThemedText>
                <ThemedText style={styles.heroStatValue}>{sessionLibrary.length} db</ThemedText>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <ThemedText style={styles.heroStatLabel}>Jegyzet témák</ThemedText>
                <ThemedText style={styles.heroStatValue}>{writingPrompts.length} kérdés</ThemedText>
              </View>
            </View>
          </LinearGradient>

          <Surface variant="raised" padding={14} style={styles.filterCard}>
            <ThemedText style={styles.filterTitle}>Szűrj hangulat szerint</ThemedText>
            <View style={styles.filterChips}>
              <TouchableOpacity
                onPress={() => setSelectedFocus('all')}
                activeOpacity={0.85}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selectedFocus === 'all' ? `${Palette.primary}18` : '#f5f8fa',
                    borderColor: selectedFocus === 'all' ? Palette.primary : '#e3e7eb',
                  },
                ]}>
                <ThemedText
                  style={[
                    styles.filterChipText,
                    { color: selectedFocus === 'all' ? Palette.primaryDeep : Palette.muted },
                  ]}>
                  Mind
                </ThemedText>
              </TouchableOpacity>
              {focusAreas.map((area) => {
                const active = selectedFocus === area.id;
                return (
                  <TouchableOpacity
                    key={area.id}
                    onPress={() => setSelectedFocus(area.id)}
                    activeOpacity={0.85}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: active ? `${area.tone}18` : '#f5f8fa',
                        borderColor: active ? area.tone : '#e3e7eb',
                      },
                    ]}>
                    <ThemedText
                      style={[
                        styles.filterChipText,
                        { color: active ? area.tone : Palette.muted },
                      ]}>
                      {area.title}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Surface>

          <SectionHeading title="Mentett gyakorlatok" subtitle="Hang + írás + mozdulat" />
          <View style={styles.sessionGrid}>
            {filteredSessions.map((item) => {
              const downloaded = downloads[item.id];
              return (
                <Surface
                  key={item.id}
                  variant="raised"
                  padding={16}
                  style={[
                    styles.sessionCard,
                    downloaded ? { borderColor: Palette.primary, borderWidth: 1 } : null,
                  ]}>
                  <View style={styles.sessionTop}>
                    <Pill tone="foam">
                      <ThemedText style={styles.sessionDuration}>{item.duration}</ThemedText>
                    </Pill>
                    <ThemedText style={[styles.sessionAnchor, { color: toneByFocus[item.category] }]}>
                      {item.anchor}
                    </ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.sessionTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.sessionDescription}>{item.description}</ThemedText>
                  <ThemedText style={styles.sessionFormat}>{item.format}</ThemedText>
                  <View style={styles.sessionActions}>
                    <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
                      <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
                      <ThemedText style={styles.primaryButtonText}>Indítás</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      activeOpacity={0.85}
                      onPress={() =>
                        setDownloads((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }>
                      <IconSymbol
                        name={downloaded ? 'check.circle.fill' : 'download'}
                        size={16}
                        color={downloaded ? Palette.primaryDeep : Palette.ink}
                      />
                      <ThemedText style={styles.secondaryButtonText}>
                        {downloaded ? 'Letöltve' : 'Offline'}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </Surface>
              );
            })}
          </View>

          <SectionHeading title="Gyors jegyzetek" subtitle="Saját kérdések + válaszok" />
          <Surface variant="raised" padding={14} style={styles.notesCard}>
            <ThemedText style={styles.noteLabel}>Keresés a jegyzetekben</ThemedText>
            <View style={styles.noteInputRow}>
              <IconSymbol name="edit.note" size={18} color={Palette.muted} />
              <TextInput
                value={noteFilter}
                onChangeText={setNoteFilter}
                placeholder="Pl.: határ, reziliencia, szerepek"
                placeholderTextColor="#9FB1B5"
                style={styles.noteInput}
              />
            </View>
            <View style={styles.promptRow}>
              {writingPrompts.map((prompt) => {
                const hidden =
                  noteFilter.trim().length > 0 &&
                  !prompt.title.toLowerCase().includes(noteFilter.toLowerCase());
                if (hidden) return null;
                return (
                  <Surface key={prompt.id} variant="tonal" tone="peach" padding={12} style={styles.promptCard}>
                    <View style={styles.promptTop}>
                      <ThemedText type="defaultSemiBold" style={styles.promptTitle}>
                        {prompt.title}
                      </ThemedText>
                      <Pill tone="foam">
                        <ThemedText style={styles.promptMinutes}>{prompt.minutes} perc</ThemedText>
                      </Pill>
                    </View>
                    <ThemedText style={styles.promptPlaceholder}>{prompt.placeholder}</ThemedText>
                    <TouchableOpacity style={styles.promptButton} activeOpacity={0.9}>
                      <ThemedText style={styles.promptButtonText}>Jegyzet megnyitása</ThemedText>
                    </TouchableOpacity>
                  </Surface>
                );
              })}
            </View>
          </Surface>

          <SectionHeading title="Visszanézhető lejátszások" subtitle="Legutóbbi mentések" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.replayRow}>
            {replays.map((item) => (
              <Surface key={item.id} variant="raised" padding={14} style={styles.replayCard}>
                <View style={styles.replayTop}>
                  <ThemedText style={styles.replayTitle}>{item.title}</ThemedText>
                  <Pill tone="sage">
                    <ThemedText style={styles.replayLength}>{item.length}</ThemedText>
                  </Pill>
                </View>
                <ThemedText style={styles.replayMeta}>{item.savedAt}</ThemedText>
                <View style={styles.replayFooter}>
                  <ThemedText style={styles.replayMood}>{item.mood}</ThemedText>
                  <TouchableOpacity style={styles.replayButton} activeOpacity={0.88}>
                    <IconSymbol name="repeat" size={16} color={Palette.primaryDeep} />
                    <ThemedText style={styles.replayButtonText}>Újra</ThemedText>
                  </TouchableOpacity>
                </View>
              </Surface>
            ))}
          </ScrollView>
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
    paddingBottom: 42,
  },
  hero: {
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: Radii.xl,
    padding: 16,
    gap: 10,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  heroLabel: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.muted,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    color: Palette.ink,
    lineHeight: 24,
  },
  heroMeta: {
    color: Palette.muted,
  },
  heroPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#e4e9ed',
    backgroundColor: '#fff',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPillText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroStat: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Radii.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e6eaee',
    gap: 4,
  },
  heroStatLabel: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },
  heroStatValue: {
    color: Palette.ink,
    fontFamily: Fonts.bodyBold,
  },
  heroDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#dbe3e7',
    alignSelf: 'stretch',
  },
  topAppBar: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topEyebrow: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: Palette.muted,
    textTransform: 'uppercase',
    fontFamily: Fonts.bodySemiBold,
  },
  topTitle: {
    fontSize: 20,
    color: Palette.ink,
    fontFamily: Fonts.bodyBold,
  },
  topIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#e4e9ed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  filterCard: {
    marginHorizontal: 18,
    marginBottom: 8,
    gap: 10,
  },
  filterTitle: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.ink,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  filterChipText: {
    fontFamily: Fonts.bodySemiBold,
  },
  sessionGrid: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 12,
  },
  sessionCard: {
    gap: 10,
  },
  sessionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionDuration: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  sessionAnchor: {
    fontFamily: Fonts.bodySemiBold,
  },
  sessionTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 17,
  },
  sessionDescription: {
    color: Palette.muted,
    lineHeight: 20,
  },
  sessionFormat: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#ecf1f4',
    paddingVertical: 10,
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#e2e7eb',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: Palette.ink,
    fontFamily: Fonts.bodySemiBold,
  },
  notesCard: {
    marginHorizontal: 18,
    marginTop: 8,
    gap: 12,
  },
  noteLabel: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.ink,
  },
  noteInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#e3e8ec',
    borderRadius: Radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f7fafc',
  },
  noteInput: {
    flex: 1,
    fontFamily: Fonts.body,
    color: Palette.ink,
  },
  promptRow: {
    gap: 10,
  },
  promptCard: {
    borderRadius: Radii.lg,
    gap: 6,
  },
  promptTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptTitle: {
    color: Palette.ink,
  },
  promptMinutes: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  promptPlaceholder: {
    color: Palette.muted,
    lineHeight: 20,
  },
  promptButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5eaee',
  },
  promptButtonText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  replayRow: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 12,
  },
  replayCard: {
    width: 220,
    marginRight: 12,
    gap: 8,
  },
  replayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replayTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 16,
  },
  replayLength: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  replayMeta: {
    color: Palette.muted,
  },
  replayFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replayMood: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.md,
    backgroundColor: Palette.peach,
  },
  replayButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
});
