import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
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
import { focusAreas, replays, weeklyPlan } from '@/constants/sessions';
import { useColorScheme } from '@/hooks/use-color-scheme';

const rituals = [
  { id: 'r1', title: 'Reggeli check-in', detail: '3 perc légzés + 1 mondat', length: '3 perc' },
  { id: 'r2', title: 'Délutáni reset', detail: 'Határ kimondás + nyújtás', length: '5 perc' },
  { id: 'r3', title: 'Esti lecsendesítés', detail: 'Hanganyag + napló', length: '6 perc' },
];

export default function JourneyScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [planDone, setPlanDone] = useState<Record<string, boolean>>(() =>
    weeklyPlan.reduce<Record<string, boolean>>((acc, item) => ({ ...acc, [item.id]: false }), {})
  );
  const [reminders, setReminders] = useState({
    morning: true,
    evening: false,
  });

  const toneByFocus = useMemo(
    () =>
      focusAreas.reduce<Record<(typeof focusAreas)[number]['id'], string>>(
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

  const completedCount = weeklyPlan.filter((plan) => planDone[plan.id]).length;
  const planProgress = Math.round((completedCount / weeklyPlan.length) * 100);
  const nextPlan = weeklyPlan.find((plan) => !planDone[plan.id]) ?? weeklyPlan[0];

  const handleTogglePlan = (id: string) => {
    setPlanDone((prev) => ({ ...prev, [id]: !prev[id] }));
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
            colors={['#e2f5fa', '#fef3eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}>
            <View style={styles.heroTop}>
              <Pill tone="foam">
                <ThemedText style={styles.heroPill}>Út • Jólét</ThemedText>
              </Pill>
              <TouchableOpacity style={styles.heroIcon} activeOpacity={0.85}>
                <IconSymbol name="calendar" size={18} color={Palette.ink} />
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.heroTitle}>Haladj hétfőről vasárnapig</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Válaszd ki a napi mini gyakorlatot, jelöld készre, és kapj emlékeztetőt.
            </ThemedText>
            <View style={styles.heroProgressRow}>
              <ProgressBar value={planProgress} progressColor={Palette.primary} trackColor="#dbe5ea" />
              <ThemedText style={styles.heroProgressText}>{planProgress}% kész</ThemedText>
            </View>
            <View style={styles.heroNext}>
              <ThemedText style={styles.heroNextLabel}>Következő</ThemedText>
              <ThemedText style={[styles.heroNextTitle, { color: toneByFocus[nextPlan.focus] }]}>
                {nextPlan.title}
              </ThemedText>
              <ThemedText style={styles.heroNextMeta}>
                {nextPlan.anchor} • {nextPlan.length}
              </ThemedText>
            </View>
          </LinearGradient>

          <SectionHeading title="Heti ütemterv" subtitle="Pipa, ha kész" />
          <Surface variant="raised" padding={14} style={styles.planCard}>
            <View style={styles.planHeader}>
              <ThemedText style={styles.planTitle}>Gyakorlati lépések</ThemedText>
              <ThemedText style={styles.planValue}>
                {completedCount} / {weeklyPlan.length} kész
              </ThemedText>
            </View>
            <View style={styles.planList}>
              {weeklyPlan.map((item) => {
                const done = planDone[item.id];
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.88}
                    onPress={() => handleTogglePlan(item.id)}
                    style={{ width: '100%' }}>
                    <Surface
                      variant="tonal"
                      tone="foam"
                      padding={12}
                      style={[
                        styles.planItem,
                        {
                          borderColor: done ? Palette.primary : '#e4eaee',
                          backgroundColor: done ? `${Palette.primary}14` : '#fff',
                        },
                      ]}>
                      <View style={styles.planItemHeader}>
                        <View style={[styles.planDay, { backgroundColor: `${toneByFocus[item.focus]}18` }]}>
                          <ThemedText style={[styles.planDayText, { color: toneByFocus[item.focus] }]}>
                            {item.day}
                          </ThemedText>
                        </View>
                        <Pill tone="sage">
                          <ThemedText style={styles.planPill}>{item.length}</ThemedText>
                        </Pill>
                      </View>
                      <ThemedText style={styles.planItemTitle}>{item.title}</ThemedText>
                      <ThemedText style={styles.planItemDetail}>{item.detail}</ThemedText>
                      <View style={styles.planFooter}>
                        <ThemedText style={[styles.planFocus, { color: toneByFocus[item.focus] }]}>
                          {focusAreas.find((area) => area.id === item.focus)?.title}
                        </ThemedText>
                        <IconSymbol
                          name={done ? 'check.circle.fill' : 'circle.fill'}
                          size={18}
                          color={done ? Palette.primaryDeep : Palette.muted}
                        />
                      </View>
                    </Surface>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Surface>

          <SectionHeading title="Napi ritmusok" subtitle="Gyorsan indítható rutinok" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ritualRow}>
            {rituals.map((ritual) => (
              <Surface key={ritual.id} variant="raised" padding={14} style={styles.ritualCard}>
                <View style={styles.ritualTop}>
                  <Pill tone="peach">
                    <ThemedText style={styles.ritualLength}>{ritual.length}</ThemedText>
                  </Pill>
                  <IconSymbol name="timer" size={16} color={Palette.primaryDeep} />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.ritualTitle}>
                  {ritual.title}
                </ThemedText>
                <ThemedText style={styles.ritualDetail}>{ritual.detail}</ThemedText>
                <TouchableOpacity style={styles.ritualButton} activeOpacity={0.88}>
                  <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
                  <ThemedText style={styles.ritualButtonText}>Indítás</ThemedText>
                </TouchableOpacity>
              </Surface>
            ))}
          </ScrollView>

          <SectionHeading title="Visszajátszások" subtitle="Kedvencek a héten" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.replayRow}>
            {replays.map((item) => (
              <Surface key={item.id} variant="raised" padding={14} style={styles.replayCard}>
                <ThemedText style={styles.replayTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.replayMeta}>
                  {item.savedAt} • {item.mood}
                </ThemedText>
                <View style={styles.replayFooter}>
                  <Pill tone="sage">
                    <ThemedText style={styles.replayLength}>{item.length}</ThemedText>
                  </Pill>
                  <TouchableOpacity style={styles.replayButton} activeOpacity={0.88}>
                    <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
                    <ThemedText style={styles.replayButtonText}>Lejátszás</ThemedText>
                  </TouchableOpacity>
                </View>
              </Surface>
            ))}
          </ScrollView>

          <Surface variant="tonal" tone="foam" padding={16} style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <IconSymbol name="bell.fill" size={18} color={Palette.primaryDeep} />
              <ThemedText style={styles.reminderTitle}>Emlékeztetők</ThemedText>
            </View>
            <View style={styles.reminderRow}>
              <View>
                <ThemedText style={styles.reminderLabel}>Reggeli fókusz</ThemedText>
                <ThemedText style={styles.reminderHint}>07:30 – határ + légzés</ThemedText>
              </View>
              <Switch
                value={reminders.morning}
                onValueChange={(value) => setReminders((prev) => ({ ...prev, morning: value }))}
                trackColor={{ false: '#d7dde2', true: `${Palette.primary}70` }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.reminderRow}>
              <View>
                <ThemedText style={styles.reminderLabel}>Esti lecsendesítés</ThemedText>
                <ThemedText style={styles.reminderHint}>21:00 – hanganyag + napló</ThemedText>
              </View>
              <Switch
                value={reminders.evening}
                onValueChange={(value) => setReminders((prev) => ({ ...prev, evening: value }))}
                trackColor={{ false: '#d7dde2', true: `${Palette.primary}70` }}
                thumbColor="#fff"
              />
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
    paddingBottom: 48,
  },
  hero: {
    margin: 18,
    borderRadius: Radii.xl,
    padding: 18,
    gap: 10,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroPill: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#e5eaee',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 22,
    color: Palette.ink,
    lineHeight: 28,
  },
  heroSubtitle: {
    color: Palette.muted,
    lineHeight: 20,
  },
  heroProgressRow: {
    gap: 6,
  },
  heroProgressText: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.primaryDeep,
  },
  heroNext: {
    backgroundColor: '#ffffff',
    borderRadius: Radii.lg,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#e7ecf0',
  },
  heroNextLabel: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.muted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  heroNextTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  heroNextMeta: {
    color: Palette.muted,
  },
  planCard: {
    marginHorizontal: 18,
    marginTop: 4,
    gap: 12,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
  },
  planValue: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.primaryDeep,
  },
  planList: {
    gap: 10,
  },
  planItem: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: 6,
  },
  planItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planDay: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planDayText: {
    fontFamily: Fonts.bodyBold,
  },
  planPill: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  planItemTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Palette.ink,
  },
  planItemDetail: {
    color: Palette.muted,
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planFocus: {
    fontFamily: Fonts.bodySemiBold,
  },
  ritualRow: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 12,
  },
  ritualCard: {
    width: 220,
    marginRight: 12,
    gap: 8,
  },
  ritualTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ritualLength: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  ritualTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Palette.ink,
  },
  ritualDetail: {
    color: Palette.muted,
    lineHeight: 20,
  },
  ritualButton: {
    marginTop: 4,
    backgroundColor: '#ecf1f4',
    paddingVertical: 10,
    borderRadius: Radii.md,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualButtonText: {
    color: '#0D1B1E',
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
  replayTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 16,
  },
  replayMeta: {
    color: Palette.muted,
  },
  replayFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replayLength: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  replayButton: {
    backgroundColor: Palette.peach,
    paddingVertical: 10,
    borderRadius: Radii.md,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  reminderCard: {
    marginHorizontal: 18,
    marginTop: 8,
    gap: 10,
    borderRadius: Radii.lg,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  reminderLabel: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.ink,
  },
  reminderHint: {
    color: Palette.muted,
  },
});
