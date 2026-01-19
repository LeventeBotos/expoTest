import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { FocusArea, focusAreas, sessionLibrary, writingPrompts } from '@/constants/sessions';

type FocusFilter = FocusArea['id'] | 'all';

export default function ExploreScreen() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const [selectedFocus, setSelectedFocus] = useState<FocusFilter>('all');

  useEffect(() => {
    if (focus && focusAreas.some((item) => item.id === focus)) {
      setSelectedFocus(focus as FocusFilter);
    }
  }, [focus]);

  const filteredSessions = useMemo(
    () =>
      selectedFocus === 'all'
        ? sessionLibrary
        : sessionLibrary.filter((session) => session.category === selectedFocus),
    [selectedFocus]
  );

  const featured = filteredSessions[0] ?? sessionLibrary[0];

  const handleStart = (title: string) => {
    Alert.alert('Indítás', `${title} online indul. Jegyzetelhetsz közben is.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces
          contentContainerStyle={{ paddingBottom: 32 }}>
          <LinearGradient
            colors={['#0D1B1E', '#12353C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={styles.heroBadge}>
                <IconSymbol name="headphones" size={16} color="#F6F0E7" />
                <ThemedText style={styles.heroBadgeText}>Hanganyag + írás + mozdulat</ThemedText>
              </View>
              <ThemedText type="title" style={styles.heroTitle}>
                Gyakorlatok, 10-12 percben
              </ThemedText>
              <ThemedText style={styles.heroSubtitle}>
                Válassz témát, indítsd online, jegyzeteld le az érzéseidet, és bármikor visszanézheted.
              </ThemedText>
              <View style={styles.heroChips}>
                <FilterChip
                  label="Mind"
                  icon="sparkles"
                  active={selectedFocus === 'all'}
                  onPress={() => setSelectedFocus('all')}
                />
                {focusAreas.map((area) => (
                  <FilterChip
                    key={area.id}
                    label={area.title}
                    icon={getIcon(area.id)}
                    active={selectedFocus === area.id}
                    onPress={() => setSelectedFocus(area.id)}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Ajánlott ebből a fókuszból
          </ThemedText>
          <ThemedText style={styles.sectionHint}>
            {featured.vibe} • {featured.duration}
          </ThemedText>
        </View>
        <View style={styles.featuredCard}>
          <View style={styles.featuredTopRow}>
            <View style={[styles.featuredPill, { backgroundColor: '#E7F0ED' }]}>
              <IconSymbol name="sparkles" size={14} color="#0D1B1E" />
              <ThemedText style={styles.featuredPillText}>{featured.anchor}</ThemedText>
            </View>
            <ThemedText style={styles.featuredDuration}>{featured.duration}</ThemedText>
          </View>
          <ThemedText type="defaultSemiBold" style={styles.featuredTitle}>
            {featured.title}
          </ThemedText>
          <ThemedText style={styles.featuredDescription}>{featured.description}</ThemedText>
          <View style={styles.featuredSteps}>
            {featured.steps.slice(0, 3).map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <IconSymbol name="circle.fill" size={8} color="#0D1B1E" />
                <ThemedText style={styles.stepText}>{step}</ThemedText>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.featuredButton}
            activeOpacity={0.9}
            onPress={() => handleStart(featured.title)}>
            <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
            <ThemedText style={styles.featuredButtonText}>Indítás</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Témák & fókuszok
          </ThemedText>
          <ThemedText style={styles.sectionHint}>Hang, írás, mozdulat és replay</ThemedText>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.focusRow}>
          {focusAreas.map((area) => (
            <TouchableOpacity
              key={area.id}
              activeOpacity={0.9}
              onPress={() => setSelectedFocus(area.id)}
              style={[
                styles.focusCard,
                { backgroundColor: area.accent, borderColor: selectedFocus === area.id ? area.tone : 'transparent' },
              ]}>
              <ThemedText type="defaultSemiBold" style={[styles.focusTitle, { color: area.tone }]}>
                {area.title}
              </ThemedText>
              <ThemedText style={styles.focusDescription}>{area.description}</ThemedText>
              <View style={styles.focusFooter}>
                <ThemedText style={styles.focusDuration}>{area.duration}</ThemedText>
                <ThemedText style={[styles.focusAnchor, { color: area.tone }]}>{area.anchor}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Gyakorlatsorok
          </ThemedText>
          <ThemedText style={styles.sectionHint}>
            Kiválasztott fókusz: {selectedFocus === 'all' ? 'Mind' : focusAreas.find((f) => f.id === selectedFocus)?.title}
          </ThemedText>
        </View>
        <View style={styles.sessionList}>
          {filteredSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionTopRow}>
                <ThemedText style={[styles.sessionCategory, { color: getCategoryColor(session.category) }]}>
                  {session.anchor}
                </ThemedText>
                <ThemedText style={styles.sessionDuration}>{session.duration}</ThemedText>
              </View>
              <ThemedText type="defaultSemiBold" style={styles.sessionTitle}>
                {session.title}
              </ThemedText>
              <ThemedText style={styles.sessionDescription}>{session.description}</ThemedText>
              <View style={styles.steps}>
                {session.steps.slice(0, 3).map((step, index) => (
                  <View key={index} style={styles.stepRow}>
                    <IconSymbol name="circle.fill" size={8} color="#0D1B1E" />
                    <ThemedText style={styles.stepText}>{step}</ThemedText>
                  </View>
                ))}
              </View>
              <View style={styles.sessionFooter}>
                <ThemedText style={styles.sessionMeta}>{session.format}</ThemedText>
                <TouchableOpacity
                  style={styles.sessionButton}
                  activeOpacity={0.88}
                  onPress={() => handleStart(session.title)}>
                  <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
                  <ThemedText style={styles.sessionButtonText}>Indítás</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {filteredSessions.length === 0 && (
            <ThemedText style={{ color: '#4B5563' }}>
              Nincs találat ehhez a fókuszhoz.
            </ThemedText>
          )}
        </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Gyors jegyzet & replay
            </ThemedText>
            <ThemedText style={styles.sectionHint}>Írd le és mentsd el a gondolatokat</ThemedText>
          </View>
          <View style={styles.promptRow}>
            {writingPrompts.map((prompt) => (
              <View key={prompt.id} style={styles.promptCard}>
                <View style={styles.promptTop}>
                  <IconSymbol name="pencil.and.outline" size={16} color="#0D1B1E" />
                  <ThemedText type="defaultSemiBold" style={styles.promptTitle}>
                    {prompt.title}
                  </ThemedText>
                </View>
                <ThemedText style={styles.promptMinutes}>{prompt.minutes} perc írás</ThemedText>
                <ThemedText style={styles.promptPlaceholder}>{prompt.placeholder}</ThemedText>
                <TouchableOpacity style={styles.promptButton} activeOpacity={0.9}>
                  <ThemedText style={styles.promptButtonText}>Jegyzet megnyitása</ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: IconSymbolName;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? '#F6F0E7' : '#14323A', borderColor: active ? '#F6F0E7' : '#14323A' },
      ]}>
      <IconSymbol name={icon} size={14} color={active ? '#0D1B1E' : '#F6F0E7'} />
      <ThemedText style={[styles.chipText, { color: active ? '#0D1B1E' : '#F6F0E7' }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'self-love':
      return '#D65B67';
    case 'me-time':
      return '#2F8E75';
    case 'roles':
      return '#7C6BE3';
    case 'presence':
      return '#E8A23C';
    default:
      return Colors.light.text;
  }
}

function getIcon(category: FocusArea['id']): IconSymbolName {
  switch (category) {
    case 'self-love':
      return 'heart.fill';
    case 'me-time':
      return 'figure.walk';
    case 'roles':
      return 'person.2.fill';
    case 'presence':
      return 'sparkles';
    default:
      return 'sparkles';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  screen: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
    gap: 14,
  },
  heroTop: {
    gap: 12,
  },
  heroBadge: {
    backgroundColor: '#123F4A',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    color: '#F6F0E7',
    fontFamily: Fonts.bodySemiBold,
  },
  heroTitle: {
    color: '#F6F0E7',
    fontSize: 30,
    lineHeight: 34,
  },
  heroSubtitle: {
    color: '#D1E2E5',
    lineHeight: 22,
  },
  heroChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: Fonts.bodySemiBold,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 22,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#0D1B1E',
  },
  sectionHint: {
    color: '#4B5563',
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featuredPillText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  featuredDuration: {
    color: '#4B5563',
    fontFamily: Fonts.bodySemiBold,
  },
  featuredTitle: {
    color: '#0D1B1E',
    fontSize: 18,
  },
  featuredDescription: {
    color: '#4B5563',
  },
  featuredSteps: {
    gap: 6,
    marginTop: 2,
  },
  focusRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  focusCard: {
    width: 220,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    gap: 8,
    borderWidth: 1,
  },
  focusTitle: {
    fontSize: 18,
  },
  focusDescription: {
    color: '#111827',
  },
  focusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focusDuration: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  focusAnchor: {
    fontFamily: Fonts.bodySemiBold,
  },
  sessionList: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 12,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionCategory: {
    fontFamily: Fonts.bodySemiBold,
  },
  sessionDuration: {
    color: '#4B5563',
  },
  sessionTitle: {
    fontSize: 18,
    color: '#0D1B1E',
  },
  sessionDescription: {
    color: '#4B5563',
  },
  steps: {
    gap: 6,
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepText: {
    color: '#111827',
    flex: 1,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sessionMeta: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  sessionButton: {
    backgroundColor: '#E7F0ED',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  featuredButton: {
    backgroundColor: '#E7F0ED',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  featuredButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  promptRow: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 12,
  },
  promptCard: {
    backgroundColor: '#0D1B1E',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  promptTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promptTitle: {
    color: '#F6F0E7',
  },
  promptMinutes: {
    color: '#C4D6D9',
  },
  promptPlaceholder: {
    color: '#9FB1B5',
  },
  promptButton: {
    backgroundColor: '#F6F0E7',
    marginTop: 6,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  promptButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
});
