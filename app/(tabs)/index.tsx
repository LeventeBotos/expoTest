import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pill } from '@/components/ui/pill';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionHeading } from '@/components/ui/section-heading';
import { Surface } from '@/components/ui/surface';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette, Radii } from '@/constants/design';
import { Fonts } from '@/constants/theme';
import { FocusArea, focusAreas, replays, sessionLibrary } from '@/constants/sessions';
import { useColorScheme } from '@/hooks/use-color-scheme';

const inspiration = [
  { quote: 'You are enough, just as you are today.', author: 'Self-Love Journal' },
  { quote: 'Rest is a productive part of healing.', author: 'Gentle Focus' },
  { quote: 'Small boundaries create wide open calm.', author: 'Weekly Prompt' },
];

const moods = [
  { id: 'calm', label: 'Calm', icon: 'mood' as const },
  { id: 'grateful', label: 'Grateful', icon: 'heart.fill' as const },
  { id: 'energized', label: 'Energized', icon: 'bolt' as const },
  { id: 'reflective', label: 'Reflective', icon: 'brain' as const },
];

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quickNote, setQuickNote] = useState('');
  const [selectedMood, setSelectedMood] = useState(moods[2].id);
  const [moodScore, setMoodScore] = useState(3);
  const [microHabits, setMicroHabits] = useState<Record<string, boolean>>({
    breath: false,
    boundary: false,
    journal: false,
  });
  const currentQuote = inspiration[quoteIndex % inspiration.length];
  const continueSession = sessionLibrary[1];

  const handleShuffleQuote = () => setQuoteIndex((prev) => (prev + 1) % inspiration.length);

  const handleSaveNote = () => {
    Alert.alert('Jegyzet elmentve', 'A mini jegyzet bekerült a visszajátszások közé.');
    setQuickNote('');
  };

  const handleToggleHabit = (id: string) => {
    setMicroHabits((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
          <LinearGradient
            colors={['#fef3eb', '#e2f5fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}>
            <View style={styles.heroHeader}>
              <View style={styles.identity}>
                <View style={styles.avatar}>
                  <LinearGradient
                    colors={['#fff', '#dbeef5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}>
                    <ThemedText style={styles.avatarInitial}>L</ThemedText>
                  </LinearGradient>
                </View>
                <View>
                  <ThemedText style={styles.eyebrow}>Good morning</ThemedText>
                  <ThemedText type="title" style={styles.heroTitle}>
                    Vegyél egy nagy levegőt
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
                <IconSymbol name="bell.fill" size={22} color={Palette.ink} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroCopy}>
              <Pill tone="peach">
                <ThemedText style={styles.badgeText}>10-12 perces mini gyakorlatok</ThemedText>
              </Pill>
              <ThemedText style={styles.heroSubtitle}>
                Puha inspiráció, határhúzás és írás – mind egy helyen.
              </ThemedText>
              <View style={styles.heroActions}>
                <TouchableOpacity style={styles.primaryButton} activeOpacity={0.92}>
                  <IconSymbol name="play.fill" size={18} color="#0D1B1E" />
                  <ThemedText style={styles.primaryText}>Indítsd a mai ajánlót</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ghostButton} activeOpacity={0.9}>
                  <IconSymbol name="book.open" size={18} color="#0D1B1E" />
                  <ThemedText style={styles.ghostText}>Gyakorlatok listája</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <Surface variant="tonal" tone="peach" style={styles.inspirationCard} padding={18}>
            <View style={styles.cardHeading}>
              <IconSymbol name="sparkles" size={18} color={Palette.primaryDeep} />
              <ThemedText style={styles.cardHeadingText}>Daily inspiration</ThemedText>
            </View>
            <ThemedText style={styles.quote}>{currentQuote.quote}</ThemedText>
            <View style={styles.cardFooter}>
              <ThemedText style={styles.quoteAuthor}>— {currentQuote.author}</ThemedText>
              <TouchableOpacity style={styles.shuffle} onPress={handleShuffleQuote} activeOpacity={0.85}>
                <IconSymbol name="arrow.right" size={14} color={Palette.primaryDeep} />
                <ThemedText style={styles.shuffleText}>Új idézet</ThemedText>
              </TouchableOpacity>
            </View>
          </Surface>

          <Surface variant="raised" style={styles.moodCard} padding={16}>
            <View style={styles.moodTopRow}>
              <ThemedText style={styles.moodTitle}>Hangulat + minihabits</ThemedText>
              <Pill tone="foam">
                <ThemedText style={styles.moodPillText}>1 perc check-in</ThemedText>
              </Pill>
            </View>
            <View style={styles.moodScoreRow}>
              {[1, 2, 3, 4, 5].map((score) => {
                const active = score === moodScore;
                return (
                  <TouchableOpacity
                    key={score}
                    onPress={() => setMoodScore(score)}
                    activeOpacity={0.85}
                    style={[
                      styles.moodScoreDot,
                      {
                        backgroundColor: active ? Palette.primary : '#f0f3f6',
                        borderColor: active ? Palette.primaryDeep : '#dbe3e7',
                      },
                    ]}>
                    <ThemedText
                      style={[
                        styles.moodScoreText,
                        { color: active ? '#fff' : Palette.muted },
                      ]}>
                      {score}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.moodChips}>
              {moods.map((mood) => {
                const active = mood.id === selectedMood;
                return (
                  <TouchableOpacity
                    key={mood.id}
                    onPress={() => setSelectedMood(mood.id)}
                    activeOpacity={0.85}
                    style={[
                      styles.moodChip,
                      {
                        backgroundColor: active ? `${Palette.primary}16` : '#fff',
                        borderColor: active ? Palette.primary : '#e2e8ed',
                      },
                    ]}>
                    <IconSymbol
                      name={mood.icon}
                      size={18}
                      color={active ? Palette.primaryDeep : Palette.muted}
                    />
                    <ThemedText
                      style={[
                        styles.moodChipText,
                        { color: active ? Palette.primaryDeep : Palette.muted },
                      ]}>
                      {mood.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.habitRow}>
              {[
                { id: 'breath', label: '2x 4-4-6 légzés', icon: 'mood' as const },
                { id: 'boundary', label: '1 határ kimondása', icon: 'bolt' as const },
                { id: 'journal', label: '3 mondat napló', icon: 'edit.note' as const },
              ].map((habit) => {
                const active = microHabits[habit.id];
                return (
                  <TouchableOpacity
                    key={habit.id}
                    onPress={() => handleToggleHabit(habit.id)}
                    activeOpacity={0.85}
                    style={[
                      styles.habitChip,
                      {
                        backgroundColor: active ? `${Palette.primary}18` : '#f7fafc',
                        borderColor: active ? Palette.primary : '#e3e8ec',
                      },
                    ]}>
                    <IconSymbol
                      name={habit.icon}
                      size={16}
                      color={active ? Palette.primaryDeep : Palette.muted}
                    />
                    <ThemedText
                      style={[
                        styles.habitText,
                        { color: active ? Palette.primaryDeep : Palette.muted },
                      ]}>
                      {habit.label}
                    </ThemedText>
                    <IconSymbol
                      name={active ? 'check.circle.fill' : 'circle.fill'}
                      size={16}
                      color={active ? Palette.primaryDeep : '#c6d2d9'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </Surface>

          <SectionHeading
            title="Fedezd fel a kategóriákat"
            subtitle="Hanganyag + jegyzet + mozdulat"
            actionLabel="Összes megnyitása"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.focusRow}>
            {focusAreas.map((area) => (
              <Surface key={area.id} variant="raised" style={styles.focusCard} padding={16}>
                <View style={[styles.iconBadge, { backgroundColor: `${area.tone}15` }]}>
                  <IconSymbol name={getIcon(area.id)} size={20} color={area.tone} />
                </View>
                <ThemedText type="defaultSemiBold" style={[styles.focusTitle, { color: area.tone }]}>
                  {area.title}
                </ThemedText>
                <ThemedText style={styles.focusDescription}>{area.description}</ThemedText>
                <View style={styles.focusFooter}>
                  <Pill tone="sage">
                    <ThemedText style={styles.focusMeta}>{area.duration}</ThemedText>
                  </Pill>
                  <ThemedText style={[styles.focusAnchor, { color: area.tone }]}>
                    {area.anchor}
                  </ThemedText>
                </View>
              </Surface>
            ))}
          </ScrollView>

          <SectionHeading
            title="Folytasd a gyakorlatot"
            subtitle="Soft-sage energia, épp mint a kedvenc példában"
          />
          <Surface variant="raised" style={styles.practiceCard} padding={18}>
            <View style={styles.practiceTop}>
              <View style={styles.practiceInfo}>
                <View style={styles.practiceIcon}>
                  <IconSymbol name="leaf" size={28} color={Palette.sage} />
                </View>
                <View style={{ gap: 4 }}>
                  <ThemedText style={styles.practiceLabel}>Exercise</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.practiceTitle}>
                    {continueSession.title}
                  </ThemedText>
                  <ThemedText style={styles.practiceMeta}>
                    {continueSession.duration} • {continueSession.format}
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity style={styles.playButton} activeOpacity={0.88}>
                <IconSymbol name="play.fill" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 8 }}>
              <ProgressBar value={35} trackColor="#ecf1f4" progressColor={Palette.primary} />
              <View style={styles.progressLabels}>
                <ThemedText style={styles.progressLabel}>4 perc kész</ThemedText>
                <ThemedText style={styles.progressLabel}>12 perc összesen</ThemedText>
              </View>
            </View>
          </Surface>

          <Surface variant="tonal" tone="primary" style={styles.weeklyCard} padding={18}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={styles.weeklyIcon}>
                <IconSymbol name="lightbulb.fill" size={22} color={Palette.primaryDeep} />
              </View>
              <View style={{ gap: 6, flex: 1 }}>
                <ThemedText style={styles.weeklyLabel}>Heti fókusz</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.weeklyTitle}>
                  Határhúzás, mint önszeretet
                </ThemedText>
                <ThemedText style={styles.weeklyCopy}>
                  Gyakorold a „nem” kimondását olyan dolgokra, amik elviszik az energiádat. Rövid
                  légzés + jegyzet segít rögzíteni.
                </ThemedText>
              </View>
            </View>
          </Surface>

          <SectionHeading title="Legutóbbi visszajátszások" subtitle="Hanganyag + jegyzet + mood" />
          <View style={styles.replayList}>
            {replays.slice(0, 2).map((item) => (
              <Surface key={item.id} variant="raised" padding={16} style={styles.replayCard}>
                <View style={styles.replayTop}>
                  <IconSymbol name="repeat" size={16} color={Palette.primaryDeep} />
                  <ThemedText type="defaultSemiBold" style={styles.replayTitle}>
                    {item.title}
                  </ThemedText>
                </View>
                <ThemedText style={styles.replayMeta}>{item.savedAt} • {item.length}</ThemedText>
                <View style={styles.replayFooter}>
                  <ThemedText style={[styles.replayMood, { color: Palette.primaryDeep }]}>
                    {item.mood}
                  </ThemedText>
                  <TouchableOpacity style={styles.replayButton} activeOpacity={0.88}>
                    <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
                    <ThemedText style={styles.replayButtonText}>Lejátszás</ThemedText>
                  </TouchableOpacity>
                </View>
              </Surface>
            ))}
          </View>

          <SectionHeading
            title="Mini journal"
            subtitle="Pont mint a harmadik minta: mood + jegyzet"
            actionLabel="Összes jegyzet"
          />
          <Surface variant="raised" padding={18} style={styles.journalCard}>
            <ThemedText style={styles.journalEyebrow}>Érzés most</ThemedText>
            <View style={styles.moodRow}>
              {moods.map((mood) => {
                const active = mood.id === selectedMood;
                return (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodButton,
                      {
                        backgroundColor: active ? `${Palette.primary}22` : '#fff',
                        borderColor: active ? Palette.primary : '#e5e8ec',
                      },
                    ]}
                    onPress={() => setSelectedMood(mood.id)}
                    activeOpacity={0.85}>
                    <IconSymbol
                      name={mood.icon}
                      size={22}
                      color={active ? Palette.primaryDeep : Palette.ink}
                    />
                    <ThemedText
                      style={[
                        styles.moodLabel,
                        { color: active ? Palette.primaryDeep : Palette.muted },
                      ]}>
                      {mood.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                multiline
                placeholder="Írd le, hogy hat rád most ez a gyakorlat…"
                placeholderTextColor="#9FB1B5"
                value={quickNote}
                onChangeText={setQuickNote}
              />
            </View>
            <View style={styles.journalActions}>
              <TouchableOpacity style={styles.saveButton} activeOpacity={0.92} onPress={handleSaveNote}>
                <IconSymbol name="sparkles" size={18} color="#fff" />
                <ThemedText style={styles.saveText}>Mentés a naplómba</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipButton} activeOpacity={0.85}>
                <ThemedText style={styles.skipText}>Kihagyom most</ThemedText>
              </TouchableOpacity>
            </View>
          </Surface>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function getIcon(category: FocusArea['id']) {
  switch (category) {
    case 'self-love':
      return 'heart.fill';
    case 'me-time':
      return 'coffee';
    case 'roles':
      return 'diversity.3';
    case 'presence':
      return 'sparkles';
    default:
      return 'sparkles';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    gap: 18,
    borderBottomLeftRadius: Radii.xl,
    borderBottomRightRadius: Radii.xl,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    color: Palette.ink,
  },
  eyebrow: {
    fontSize: 12,
    color: Palette.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: Fonts.bodySemiBold,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: Palette.ink,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7eef2',
  },
  heroCopy: {
    gap: 12,
  },
  badgeText: {
    fontSize: 13,
    color: Palette.ink,
    fontFamily: Fonts.bodySemiBold,
  },
  heroSubtitle: {
    color: Palette.ink,
    fontSize: 16,
    lineHeight: 24,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#dfe9ee',
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
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ghostText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  inspirationCard: {
    marginHorizontal: 18,
    marginTop: 16,
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardHeadingText: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.primaryDeep,
    letterSpacing: 0.5,
  },
  quote: {
    fontSize: 22,
    fontFamily: Fonts.display,
    lineHeight: 30,
    color: Palette.ink,
    marginBottom: 8,
  },
  quoteAuthor: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  shuffle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shuffleText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  moodCard: {
    marginHorizontal: 18,
    marginTop: 10,
    gap: 12,
  },
  moodTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Palette.ink,
  },
  moodPillText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  moodScoreRow: {
    flexDirection: 'row',
    gap: 8,
  },
  moodScoreDot: {
    width: 40,
    height: 40,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodScoreText: {
    fontFamily: Fonts.bodyBold,
  },
  moodChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  moodChipText: {
    fontFamily: Fonts.bodySemiBold,
  },
  habitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
    borderWidth: 1,
    flex: 1,
    minWidth: '30%',
  },
  habitText: {
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
  },
  focusRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  focusCard: {
    width: 180,
    marginRight: 12,
    gap: 10,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusTitle: {
    fontSize: 18,
  },
  focusDescription: {
    color: Palette.ink,
    lineHeight: 20,
  },
  focusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  focusMeta: {
    color: Palette.sage,
    fontFamily: Fonts.bodySemiBold,
  },
  focusAnchor: {
    fontFamily: Fonts.bodySemiBold,
  },
  practiceCard: {
    marginHorizontal: 18,
    marginTop: 10,
    gap: 12,
  },
  practiceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  practiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  practiceIcon: {
    width: 56,
    height: 56,
    borderRadius: Radii.lg,
    backgroundColor: `${Palette.sage}25`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceLabel: {
    color: Palette.sage,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: Fonts.bodySemiBold,
  },
  practiceTitle: {
    fontSize: 18,
    color: Palette.ink,
  },
  practiceMeta: {
    color: Palette.muted,
  },
  playButton: {
    width: 54,
    height: 54,
    borderRadius: Radii.pill,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...{
      shadowColor: 'rgba(121, 188, 210, 0.35)',
      shadowOpacity: 0.6,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  weeklyCard: {
    marginHorizontal: 18,
    marginTop: 16,
  },
  weeklyIcon: {
    width: 42,
    height: 42,
    borderRadius: Radii.md,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weeklyLabel: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  weeklyTitle: {
    fontSize: 18,
    color: Palette.ink,
  },
  weeklyCopy: {
    color: Palette.ink,
    lineHeight: 20,
  },
  replayList: {
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 12,
  },
  replayCard: {
    gap: 8,
  },
  replayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replayTitle: {
    fontSize: 16,
    color: Palette.ink,
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
    fontFamily: Fonts.bodySemiBold,
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecf1f4',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.md,
  },
  replayButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  journalCard: {
    marginHorizontal: 18,
    marginTop: 12,
    gap: 12,
  },
  journalEyebrow: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  moodRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  moodButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  moodLabel: {
    fontFamily: Fonts.bodySemiBold,
  },
  textAreaWrapper: {
    backgroundColor: '#f4f6f8',
    borderRadius: Radii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6eaee',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    color: Palette.ink,
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  journalActions: {
    gap: 10,
  },
  saveButton: {
    backgroundColor: Palette.primary,
    paddingVertical: 14,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  skipButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipText: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
});
