import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import {
  FocusArea,
  focusAreas,
  replays,
  sessionLibrary,
  weeklyPlan,
  writingPrompts,
} from '@/constants/sessions';

type Prompt = (typeof writingPrompts)[number];

export default function HomeScreen() {
  const router = useRouter();
  const [activePrompt] = useState<Prompt>(writingPrompts[0]);
  const [journalText, setJournalText] = useState('');
  const featuredSession = sessionLibrary[0];
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

  const handleNavigate = (focus?: FocusArea['id']) => {
    if (focus) {
      router.push(`/explore?focus=${focus}`);
      return;
    }
    router.push('/explore');
  };

  const handleSaveNote = () => {
    Alert.alert('Jegyzet elmentve', 'A jegyzet bekerült a visszajátszások közé.');
    setJournalText('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces>
        <LinearGradient
          colors={['#FFDFC8', '#FFE1E7', '#E6F6EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <View style={styles.heroHeader}>
            <View style={styles.badge}>
              <IconSymbol name="timer" size={16} color="#D65B67" />
              <ThemedText style={styles.badgeText}>10-12 perces online foglalkozások</ThemedText>
            </View>
            <ThemedText type="title" style={styles.heroTitle}>
              Lélekpercek
            </ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Gyengéd, de fókuszált mini-gyakorlatok önszeretethez, én-időhöz és rugalmas
              jelenléthez.
            </ThemedText>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.9}
                onPress={() => handleNavigate(featuredSession.category)}>
                <IconSymbol name="play.circle.fill" size={22} color="#0D1B1E" />
                <ThemedText style={styles.primaryText}>Kezdj egy 10 perces resetet</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ghostButton}
                activeOpacity={0.9}
                onPress={() => handleNavigate()}>
                <IconSymbol name="book" size={18} color="#0D1B1E" />
                <ThemedText style={styles.ghostText}>Nézd meg a gyakorlatsort</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.statCard}>
              <IconSymbol name="heart.fill" size={18} color="#D65B67" />
              <ThemedText type="defaultSemiBold" style={styles.statLabel}>
                Önszeretet
              </ThemedText>
              <ThemedText style={styles.statValue}>12 perc • esti rutin</ThemedText>
            </View>
            <View style={styles.statCard}>
              <IconSymbol name="figure.walk" size={18} color="#2F8E75" />
              <ThemedText type="defaultSemiBold" style={styles.statLabel}>
                Én-idő séta
              </ThemedText>
              <ThemedText style={styles.statValue}>10 perc • reggeli indulás</ThemedText>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Témák, amikre most figyelhetsz
          </ThemedText>
          <ThemedText style={styles.sectionHint}>Hanganyag + írás + mozdulat</ThemedText>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.focusRow}>
          {focusAreas.map((area) => (
            <View key={area.id} style={[styles.focusCard, { backgroundColor: area.accent }]}>
              <ThemedText type="defaultSemiBold" style={[styles.focusTitle, { color: area.tone }]}>
                {area.title}
              </ThemedText>
              <ThemedText style={styles.focusDescription}>{area.description}</ThemedText>
              <View style={styles.focusFooter}>
                <ThemedText style={[styles.pill, { color: area.tone }]}>{area.duration}</ThemedText>
                <ThemedText style={styles.focusAnchor}>{area.anchor}</ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Ajánlott ma
          </ThemedText>
          <ThemedText style={styles.sectionHint}>
            {featuredSession.vibe} hangulat • {featuredSession.duration}
          </ThemedText>
        </View>
        <LinearGradient
          colors={['#FDF6EA', '#F0E9FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <View style={styles.featuredBadge}>
              <IconSymbol name="star.fill" size={14} color="#0D1B1E" />
              <ThemedText style={styles.featuredBadgeText}>{featuredSession.anchor}</ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={styles.featuredTitle}>
              {featuredSession.title}
            </ThemedText>
            <ThemedText style={styles.featuredDescription}>{featuredSession.description}</ThemedText>
          </View>
          <View style={styles.featuredSteps}>
            {featuredSession.steps.slice(0, 2).map((step, index) => (
              <View key={index} style={styles.featuredStepRow}>
                <IconSymbol name="sparkles" size={14} color="#0D1B1E" />
                <ThemedText style={styles.featuredStepText}>{step}</ThemedText>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.featuredButton}
            activeOpacity={0.9}
            onPress={() => handleNavigate(featuredSession.category)}>
            <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
            <ThemedText style={styles.featuredButtonText}>Indítás most</ThemedText>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Heti terv (10-12 perc)
          </ThemedText>
          <ThemedText style={styles.sectionHint}>Minden blokk visszanézhető</ThemedText>
        </View>
        <View style={styles.planGrid}>
          {weeklyPlan.map((item) => (
            <View key={item.id} style={[styles.planCard, { borderColor: toneByFocus[item.focus] }]}>
              <View style={styles.planTopRow}>
                <View style={[styles.dayBadge, { backgroundColor: toneByFocus[item.focus] + '22' }]}>
                  <ThemedText type="defaultSemiBold" style={styles.dayBadgeText}>
                    {item.day}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.timeText, { color: toneByFocus[item.focus] }]}>
                  {item.anchor}
                </ThemedText>
              </View>
              <ThemedText type="defaultSemiBold" style={styles.planTitle}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.planDetail}>{item.detail}</ThemedText>
              <View style={styles.planFooter}>
                <ThemedText style={styles.planLength}>{item.length}</ThemedText>
                <TouchableOpacity
                  style={styles.planButton}
                  activeOpacity={0.85}
                  onPress={() => handleNavigate(item.focus)}>
                  <ThemedText style={[styles.planButtonText, { color: toneByFocus[item.focus] }]}>
                    Kezdés
                  </ThemedText>
                  <IconSymbol name="arrow.right" size={14} color={toneByFocus[item.focus]} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Jegyzet most
          </ThemedText>
          <ThemedText style={styles.sectionHint}>
            {activePrompt.minutes} perc írás, hogy le is rögzüljön
          </ThemedText>
        </View>
        <View style={styles.journalCard}>
          <View style={styles.journalHeader}>
            <IconSymbol name="pencil.and.outline" size={18} color="#0D1B1E" />
            <ThemedText type="defaultSemiBold" style={styles.journalTitle}>
              {activePrompt.title}
            </ThemedText>
          </View>
          <TextInput
            placeholder={activePrompt.placeholder}
            placeholderTextColor="#6B7280"
            value={journalText}
            onChangeText={setJournalText}
            multiline
            style={styles.textArea}
          />
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.9} onPress={handleSaveNote}>
            <IconSymbol name="tray.and.arrow.down" size={16} color="#0D1B1E" />
            <ThemedText style={styles.saveText}>Mentés és visszanézés</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Legutóbbi visszajátszások
          </ThemedText>
          <ThemedText style={styles.sectionHint}>Hanganyagok + jegyzetek</ThemedText>
        </View>
        <View style={styles.replayColumn}>
          {replays.map((item) => (
            <View key={item.id} style={styles.replayCard}>
              <View style={styles.replayTop}>
                <IconSymbol name="repeat" size={16} color="#0D1B1E" />
                <ThemedText type="defaultSemiBold" style={styles.replayTitle}>
                  {item.title}
                </ThemedText>
              </View>
              <ThemedText style={styles.replayMeta}>{item.savedAt}</ThemedText>
              <View style={styles.replayFooter}>
                <ThemedText style={styles.replayMood}>{item.mood}</ThemedText>
                <ThemedText style={styles.replayLength}>{item.length}</ThemedText>
                <TouchableOpacity style={styles.replayButton} activeOpacity={0.85}>
                  <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
                  <ThemedText style={styles.replayButtonText}>Lejátszás</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 28,
    gap: 24,
  },
  heroHeader: {
    gap: 12,
  },
  badge: {
    backgroundColor: '#0D1B1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    color: '#FFF',
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
  },
  heroTitle: {
    fontSize: 36,
    color: '#0D1B1E',
  },
  heroSubtitle: {
    color: '#1F2937',
    fontSize: 16,
    lineHeight: 24,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#F6F0E7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  ghostButton: {
    borderColor: '#0D1B1E',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ghostText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#0D1B1E',
    padding: 14,
    borderRadius: 14,
    width: '47%',
    gap: 6,
  },
  statLabel: {
    color: '#FFF',
  },
  statValue: {
    color: '#D1D5DB',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#0D1B1E',
  },
  sectionHint: {
    color: '#4B5563',
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
  pill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontFamily: Fonts.bodySemiBold,
  },
  focusAnchor: {
    color: '#111827',
  },
  featuredCard: {
    marginHorizontal: 24,
    marginTop: 12,
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  featuredHeader: {
    gap: 8,
  },
  featuredBadge: {
    backgroundColor: '#0D1B1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuredBadgeText: {
    color: '#FFF',
    fontFamily: Fonts.bodySemiBold,
  },
  featuredTitle: {
    color: '#0D1B1E',
    fontSize: 18,
  },
  featuredDescription: {
    color: '#1F2937',
  },
  featuredSteps: {
    gap: 6,
  },
  featuredStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredStepText: {
    color: '#0D1B1E',
    flex: 1,
  },
  featuredButton: {
    backgroundColor: '#0D1B1E',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  featuredButtonText: {
    color: '#FDF6EA',
    fontFamily: Fonts.bodySemiBold,
  },
  planGrid: {
    paddingHorizontal: 24,
    paddingTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    width: '48%',
    gap: 6,
  },
  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dayBadgeText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  timeText: {
    fontFamily: Fonts.bodySemiBold,
  },
  planTitle: {
    fontSize: 17,
    color: '#0D1B1E',
  },
  planDetail: {
    color: '#4B5563',
  },
  planFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  planLength: {
    color: '#1F2937',
    fontFamily: Fonts.bodySemiBold,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planButtonText: {
    fontFamily: Fonts.bodySemiBold,
  },
  journalCard: {
    backgroundColor: '#0D1B1E',
    marginHorizontal: 24,
    marginTop: 12,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  journalTitle: {
    color: '#FFF',
    fontSize: 17,
  },
  textArea: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    minHeight: 110,
    color: '#F9FAFB',
    textAlignVertical: 'top',
    fontFamily: Fonts.body,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#F6F0E7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  replayColumn: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 12,
  },
  replayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  replayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replayTitle: {
    color: '#0D1B1E',
    fontSize: 16,
  },
  replayMeta: {
    color: '#6B7280',
  },
  replayFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
  },
  replayMood: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  replayLength: {
    color: '#4B5563',
  },
  replayButton: {
    backgroundColor: '#E7F0ED',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  replayButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
});
