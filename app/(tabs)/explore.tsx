import { useMemo, useState } from 'react';
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
import {
  FocusArea,
  focusAreas,
  replays,
  sessionLibrary,
  weeklyPlan,
  writingPrompts,
} from '@/constants/sessions';
import { useColorScheme } from '@/hooks/use-color-scheme';

type MatchCard = { id: string; text: string };

const criticalThoughts: MatchCard[] = [
  { id: 't1', text: '"Nem teszek eleget ma."' },
  { id: 't2', text: '"Jobb kellene legyek, mint mások."' },
  { id: 't3', text: '"Most nem számítanak a szükségleteim."' },
];

const reframes: MatchCard[] = [
  { id: 'r1', text: '"Egyedi vagyok és a saját gyönyörű utamat járom."' },
  { id: 'r2', text: '"A pihenés is gyógyulás – belefér a tempómba."' },
  { id: 'r3', text: '"Ha a saját szükségleteimre figyelek, jobban tudok jelen lenni."' },
];

const moods = [
  { id: 'calm', label: 'Calm', icon: 'mood' as const },
  { id: 'grateful', label: 'Grateful', icon: 'heart.fill' as const },
  { id: 'energized', label: 'Energized', icon: 'bolt' as const },
  { id: 'reflective', label: 'Reflective', icon: 'brain' as const },
  { id: 'soft', label: 'Vulnerable', icon: 'leaf' as const },
];

type TaskTemplateId = 'match' | 'drag' | 'write' | 'audio';

type TaskTemplate = {
  id: TaskTemplateId;
  label: string;
  description: string;
  duration: number;
  example: string;
  badge: string;
};

type BuilderTask = {
  id: string;
  type: TaskTemplateId;
  title: string;
  focus: FocusArea['id'];
  note?: string;
};

type GameId = 'quiz' | 'breath' | 'draw';

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: string;
  tip: string;
};

type DrawCard = {
  id: string;
  title: string;
  prompt: string;
  action: string;
};

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Mi a leggyengédebb válasz egy belső kritikára?',
    options: [
      '„Gyorsan felejtsük el és menjünk tovább.”',
      '„Értem, hogy ezt érzem, és adok rá időt.”',
      '„Nem szabad gyengének lenni.”',
    ],
    correct: '„Értem, hogy ezt érzem, és adok rá időt.”',
    tip: 'Az elfogadás + idő adása csökkenti a belső feszültséget.',
  },
  {
    id: 'q2',
    question: 'Milyen ritmus segít a 4-4-6 légzésben?',
    options: ['4 belégzés • 4 tartás • 6 kifújás', '6 belégzés • 4 tartás • 4 kifújás', '4 belégzés • 6 tartás • 4 kifújás'],
    correct: '4 belégzés • 4 tartás • 6 kifújás',
    tip: 'A hosszabb kifújás aktiválja a paraszimpatikus idegrendszert.',
  },
  {
    id: 'q3',
    question: 'Hogyan jelensz meg az „én-idő” határhúzásban?',
    options: ['Mindig mindenkinek igent mondok.', 'Előre jelzem, mikor vagyok elérhető.', 'Csak akkor szólok, ha már fáradt vagyok.'],
    correct: 'Előre jelzem, mikor vagyok elérhető.',
    tip: 'A megelőző kommunikáció csökkenti a bűntudatot és erősíti a határokat.',
  },
];

const drawDeck: DrawCard[] = [
  {
    id: 'd1',
    title: 'Affirmáció kártya',
    prompt: 'Írj 2 kedves mondatot magadhoz ma estére.',
    action: 'Mond ki hangosan, majd nyújtózz nagyot.',
  },
  {
    id: 'd2',
    title: 'Én-idő kártya',
    prompt: 'Nevezz meg egy apró határt, amit ma tartanál.',
    action: 'Írd le, mikor és hogyan jelzed ezt.',
  },
  {
    id: 'd3',
    title: 'Reziliencia kártya',
    prompt: 'Sorolj fel 3 támaszt, ami most segít (ember, szokás, hely).',
    action: 'Válassz egyet, amit ma aktiválsz.',
  },
  {
    id: 'd4',
    title: 'Szerep-átírás kártya',
    prompt: 'Melyik szabályt írnád át ma? Írj új, saját verziót.',
    action: 'Kövesd egy mély belégzés + kifújás után.',
  },
];

const dailyChallenge = {
  title: 'Napi kihívás: légzés + jegyzet',
  minutes: 10,
  steps: ['2 kör 4-4-6 légzés', 'Írj 3 kedves mondatot', 'Indíts egy mentett flow-t'],
  reward: '+10 jóllét pont',
};

const taskTemplates: TaskTemplate[] = [
  {
    id: 'match',
    label: 'Párosítás',
    description: 'Kritikus gondolat + kedves újrafogalmazás.',
    duration: 3,
    example: '„Nem teszek eleget ma.” → „Pont elég vagyok.”',
    badge: 'Önszeretet',
  },
  {
    id: 'drag',
    label: 'Behúzogatós sorrend',
    description: 'Lépések rendezése: légzés → mantra → írás.',
    duration: 3,
    example: 'Rendezd a 4-4-6 légzés, mantra, nyújtás sorrendjét.',
    badge: 'Én-idő',
  },
  {
    id: 'write',
    label: 'Írás / napló',
    description: 'Kérdés, amire 3-5 mondatot ír a résztvevő.',
    duration: 2,
    example: '„Miben voltál ma figyelmes magaddal?”',
    badge: 'Napló',
  },
  {
    id: 'audio',
    label: 'Hang + mozdulat',
    description: 'Rövid hanganyag, majd 2 mozdulat és visszajelzés.',
    duration: 4,
    example: 'Affirmáció + vállnyitás + 1 mondatos értékelés.',
    badge: 'Rutin',
  },
];

const defaultFlow: BuilderTask[] = [
  {
    id: 'flow-1',
    type: 'match',
    title: 'Önszeretet párosító',
    focus: 'self-love',
    note: 'Gondolat vs. kedves reframing',
  },
  {
    id: 'flow-2',
    type: 'drag',
    title: 'Sorrend: légzés → mantra → írás',
    focus: 'me-time',
    note: 'Behúzogatós lépések',
  },
  {
    id: 'flow-3',
    type: 'write',
    title: 'Írás: mit viszel tovább?',
    focus: 'self-love',
    note: '3-5 mondat reflexió',
  },
];

const breathPhases = ['Belégzés 4 mp', 'Tartsd bent 4 mp', 'Kilégzés 6 mp'];
const breathTargetRounds = 3;

export default function ExploreScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [matches, setMatches] = useState<Record<string, string>>({
    [criticalThoughts[2].id]: reframes[2].id,
  });
  const [selectedThought, setSelectedThought] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState(moods[1].id);
  const [journalText, setJournalText] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<FocusArea['id']>('self-love');
  const [targetLength, setTargetLength] = useState(12);
  const [builderTasks, setBuilderTasks] = useState<BuilderTask[]>(defaultFlow);
  const [customQuestion, setCustomQuestion] = useState('Miben voltál ma gyengéd magaddal?');
  const [customNote, setCustomNote] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameId>('quiz');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const [breathRound, setBreathRound] = useState(1);
  const [breathPhase, setBreathPhase] = useState(0);
  const [currentCard, setCurrentCard] = useState<DrawCard>(drawDeck[0]);
  const [drawCount, setDrawCount] = useState(1);
  const [streakDays, setStreakDays] = useState(3);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [flowSavedCount, setFlowSavedCount] = useState(1);
  const [notesSaved, setNotesSaved] = useState(0);
  const [quizRuns, setQuizRuns] = useState(0);
  const [quizBest, setQuizBest] = useState(0);
  const [breathSessions, setBreathSessions] = useState(0);
  const [planDone, setPlanDone] = useState<Record<string, boolean>>(() =>
    weeklyPlan.reduce<Record<string, boolean>>((acc, item) => ({ ...acc, [item.id]: false }), {})
  );
  const [favoriteSessions, setFavoriteSessions] = useState<Record<string, boolean>>({});

  const placedCount = Object.keys(matches).length;
  const progressValue = 40 + placedCount * 20;

  const session = sessionLibrary[0];

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

  const wellbeingPoints = streakDays * 2 + flowSavedCount * 3 + quizBest + breathSessions * 2;
  const planCompletedCount = weeklyPlan.filter((plan) => planDone[plan.id]).length;
  const planProgress = Math.round((planCompletedCount / weeklyPlan.length) * 100);
  const nextPlan = weeklyPlan.find((plan) => !planDone[plan.id]) ?? weeklyPlan[0];

  const achievements = useMemo(
    () => [
      {
        id: 'streak',
        title: 'Streak építő',
        detail: `${streakDays} nap egymás után`,
        tone: Palette.primaryDeep,
        icon: 'star.fill' as const,
      },
      {
        id: 'quiz',
        title: 'Kvíz mester',
        detail: `Legjobb pont: ${quizBest} / ${quizQuestions.length}`,
        tone: Palette.sage,
        icon: 'brain' as const,
      },
      {
        id: 'breath',
        title: 'Légzés hős',
        detail: `${breathSessions} teljesített ritmus`,
        tone: Palette.peach,
        icon: 'heart.fill' as const,
      },
      {
        id: 'cards',
        title: 'Kártya gyűjtő',
        detail: `${drawCount} húzás`,
        tone: Palette.lilac,
        icon: 'sparkles' as const,
      },
      {
        id: 'notes',
        title: 'Napló csillag',
        detail: `${notesSaved} mentett reflexió`,
        tone: Palette.primary,
        icon: 'edit.note' as const,
      },
    ],
    [streakDays, quizBest, breathSessions, drawCount, notesSaved]
  );

  const taskTemplateMap = useMemo(
    () =>
      taskTemplates.reduce<Record<TaskTemplateId, TaskTemplate>>(
        (acc, template) => ({ ...acc, [template.id]: template }),
        {} as Record<TaskTemplateId, TaskTemplate>
      ),
    []
  );

  const totalMinutes = builderTasks.reduce(
    (total, task) => total + (taskTemplateMap[task.type]?.duration ?? 2),
    0
  );
  const builderProgress = Math.min(100, Math.round((totalMinutes / targetLength) * 100));
  const currentQuestion = quizQuestions[quizIndex];
  const hasMoreQuestions = quizIndex < quizQuestions.length - 1;
  const breathStepsTotal = breathTargetRounds * breathPhases.length;
  const breathCurrentStep = (breathRound - 1) * breathPhases.length + (breathPhase + 1);
  const breathProgress = Math.min(100, Math.round((breathCurrentStep / breathStepsTotal) * 100));

  const handleMatch = (reframeId: string) => {
    if (!selectedThought) {
      return;
    }
    setMatches((prev) => ({ ...prev, [selectedThought]: reframeId }));
    setSelectedThought(null);
  };

  const handleAddTaskType = (type: TaskTemplateId) => {
    const template = taskTemplateMap[type];
    if (!template) {
      return;
    }
    setBuilderTasks((prev) => [
      ...prev,
      {
        id: `${type}-${Date.now()}`,
        type,
        title: template.example,
        focus: selectedFocus,
        note: template.description,
      },
    ]);
  };

  const handleMoveTask = (taskId: string, direction: -1 | 1) => {
    setBuilderTasks((prev) => {
      const index = prev.findIndex((task) => task.id === taskId);
      if (index === -1) {
        return prev;
      }
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) {
        return prev;
      }
      const clone = [...prev];
      const [item] = clone.splice(index, 1);
      clone.splice(nextIndex, 0, item);
      return clone;
    });
  };

  const handleAddCustomQuestion = () => {
    if (!customQuestion.trim()) {
      return;
    }
    setBuilderTasks((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        type: 'write',
        title: customQuestion.trim(),
        focus: selectedFocus,
        note: customNote.trim() || undefined,
      },
    ]);
    setCustomQuestion('');
    setCustomNote('');
  };

  const handleSave = () => {
    Alert.alert('Mentve', 'A reflexió bekerült a naplódba.');
    setJournalText('');
    setNotesSaved((prev) => prev + 1);
  };

  const handleSaveFlow = () => {
    Alert.alert('Foglalkozás mentve', 'A 10-12 perces foglalkozás bekerült a visszajátszások közé.');
    setFlowSavedCount((prev) => prev + 1);
  };

  const handleSubmitQuiz = () => {
    if (!quizChoice) {
      return;
    }
    const correct = quizChoice === currentQuestion.correct;
    const nextScore = correct ? quizScore + 1 : quizScore;
    setQuizScore(nextScore);
    setQuizFeedback(correct ? 'correct' : 'wrong');
    if (!hasMoreQuestions) {
      setQuizDone(true);
      setQuizRuns((prev) => prev + 1);
      setQuizBest((prev) => Math.max(prev, nextScore));
    }
  };

  const handleNextQuiz = () => {
    if (hasMoreQuestions) {
      setQuizIndex((prev) => prev + 1);
      setQuizChoice(null);
      setQuizFeedback(null);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setQuizChoice(null);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizDone(false);
  };

  const handleBreathAdvance = () => {
    if (breathRound >= breathTargetRounds && breathPhase === breathPhases.length - 1) {
      setBreathSessions((prev) => prev + 1);
      return;
    }
    setBreathPhase((prev) => {
      const next = (prev + 1) % breathPhases.length;
      if (next === 0) {
        setBreathRound((round) => Math.min(breathTargetRounds, round + 1));
      }
      return next;
    });
  };

  const handleBreathReset = () => {
    setBreathRound(1);
    setBreathPhase(0);
  };

  const handleDrawCard = () => {
    const nextCard = drawDeck[Math.floor(Math.random() * drawDeck.length)];
    setCurrentCard(nextCard);
    setDrawCount((prev) => prev + 1);
  };

  const handleCompleteDaily = () => {
    if (dailyCompleted) {
      return;
    }
    setDailyCompleted(true);
    setStreakDays((prev) => Math.min(prev + 1, 30));
  };

  const handleTogglePlan = (id: string) => {
    setPlanDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleFavorite = (id: string) => {
    setFavoriteSessions((prev) => ({ ...prev, [id]: !prev[id] }));
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
          <View style={styles.topAppBar}>
            <TouchableOpacity style={styles.appIcon} activeOpacity={0.85}>
              <IconSymbol name="bell" size={22} color={Palette.ink} />
            </TouchableOpacity>
            <View style={styles.topTitles}>
              <ThemedText style={styles.topEyebrow}>Self-love session</ThemedText>
              <ThemedText type="subtitle" style={styles.topTitle}>
                Matching exercise
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.appIcon} activeOpacity={0.85}>
              <IconSymbol name="lightbulb.fill" size={22} color={Palette.primaryDeep} />
            </TouchableOpacity>
          </View>

          <View style={styles.progressWrapper}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressTitle}>Session progress</ThemedText>
              <ThemedText style={styles.progressValue}>{progressValue}%</ThemedText>
            </View>
            <ProgressBar value={progressValue} progressColor={Palette.primary} trackColor="#e2e7eb" />
          </View>

          <Surface variant="raised" padding={16} style={styles.quickPlanCard}>
            <View style={styles.quickPlanTop}>
              <View style={{ gap: 6, flex: 1 }}>
                <ThemedText style={styles.quickPlanLabel}>Ajánlott következő</ThemedText>
                <ThemedText style={styles.quickPlanTitle}>{nextPlan.title}</ThemedText>
                <ThemedText style={[styles.quickPlanAnchor, { color: toneByFocus[nextPlan.focus] }]}>
                  {nextPlan.anchor} • {nextPlan.length}
                </ThemedText>
              </View>
              <TouchableOpacity style={styles.quickPlanButton} activeOpacity={0.9}>
                <IconSymbol name="play.fill" size={18} color="#fff" />
                <ThemedText style={styles.quickPlanButtonText}>Indítás</ThemedText>
              </TouchableOpacity>
            </View>
            <ProgressBar value={planProgress} progressColor={Palette.primary} trackColor="#ecf1f4" />
            <ThemedText style={styles.quickPlanMeta}>
              Heti terv: {planCompletedCount} / {weeklyPlan.length} kész
            </ThemedText>
          </Surface>

          <View style={styles.streakRow}>
            <Surface variant="raised" padding={14} style={styles.streakCard}>
              <View style={styles.streakHeader}>
                <IconSymbol name="star.fill" size={18} color={Palette.primaryDeep} />
                <ThemedText style={styles.streakLabel}>Napi streak</ThemedText>
              </View>
              <View style={styles.streakValueRow}>
                <ThemedText style={styles.streakValue}>{streakDays} nap</ThemedText>
                <Pill tone="foam">
                  <ThemedText style={styles.streakPill}>{dailyCompleted ? 'Mai kész' : 'Ma még vár'}</ThemedText>
                </Pill>
              </View>
              <ThemedText style={styles.streakHint}>Mentett flow-k: {flowSavedCount}</ThemedText>
            </Surface>
            <Surface variant="tonal" tone="peach" padding={14} style={styles.pointsCard}>
              <View style={styles.pointsHeader}>
                <IconSymbol name="sparkles" size={18} color={Palette.primaryDeep} />
                <ThemedText style={styles.pointsLabel}>Jóllét pontok</ThemedText>
              </View>
              <ThemedText style={styles.pointsValue}>{wellbeingPoints}</ThemedText>
              <ThemedText style={styles.pointsHint}>
                Kvíz csúcs: {quizBest} / {quizQuestions.length} • Légzés: {breathSessions}x
              </ThemedText>
            </Surface>
          </View>

          <Surface variant="raised" padding={16} style={styles.dailyCard}>
            <View style={styles.dailyHeader}>
              <ThemedText style={styles.dailyTitle}>{dailyChallenge.title}</ThemedText>
              <Pill tone="sage">
                <ThemedText style={styles.dailyMinutes}>{dailyChallenge.minutes} perc</ThemedText>
              </Pill>
            </View>
            <ThemedText style={styles.dailyMeta}>Fókusz: légzés + önszeretet írás</ThemedText>
            <View style={styles.dailySteps}>
              {dailyChallenge.steps.map((step) => (
                <View key={step} style={styles.dailyStep}>
                  <IconSymbol name="check.circle.fill" size={16} color={Palette.primaryDeep} />
                  <ThemedText style={styles.dailyStepText}>{step}</ThemedText>
                </View>
              ))}
            </View>
            <View style={styles.dailyFooter}>
              <ThemedText style={styles.dailyReward}>{dailyChallenge.reward}</ThemedText>
              <TouchableOpacity
                style={[
                  styles.dailyButton,
                  { backgroundColor: dailyCompleted ? '#cfd8dc' : Palette.primary },
                ]}
                onPress={handleCompleteDaily}
                activeOpacity={0.9}>
                <IconSymbol
                  name={dailyCompleted ? 'check.circle.fill' : 'play.fill'}
                  size={16}
                  color="#0D1B1E"
                />
                <ThemedText style={styles.dailyButtonText}>
                  {dailyCompleted ? 'Kész a mai kihívás' : 'Jelölöm késznek'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Surface>

          <SectionHeading title="Heti ütemterv" subtitle="Rövid foglalkozások minden napra" />
          <Surface variant="raised" padding={16} style={styles.planCard}>
            <View style={styles.planHeader}>
              <ThemedText style={styles.planTitle}>Haladás</ThemedText>
              <ThemedText style={styles.planProgressValue}>{planProgress}%</ThemedText>
            </View>
            <ProgressBar value={planProgress} progressColor={Palette.primary} trackColor="#ecf1f4" />
            <ThemedText style={styles.planHint}>
              {planCompletedCount} / {weeklyPlan.length} mini gyakorlás kész
            </ThemedText>
            <View style={styles.planList}>
              {weeklyPlan.map((item) => {
                const done = planDone[item.id];
                return (
                  <Surface
                    key={item.id}
                    variant="tonal"
                    tone="foam"
                    padding={12}
                    style={[
                      styles.planItem,
                      { borderColor: done ? Palette.primary : '#e6eaee' },
                    ]}>
                    <View style={styles.planItemHeader}>
                      <View style={[styles.planDay, { backgroundColor: `${toneByFocus[item.focus]}15` }]}>
                        <ThemedText style={[styles.planDayText, { color: toneByFocus[item.focus] }]}>
                          {item.day}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.planAnchor}>{item.anchor}</ThemedText>
                    </View>
                    <ThemedText style={styles.planItemTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.planItemMeta}>
                      {item.length} • {item.detail}
                    </ThemedText>
                    <View style={styles.planFooter}>
                      <ThemedText style={[styles.planFocus, { color: toneByFocus[item.focus] }]}>
                        {focusAreas.find((area) => area.id === item.focus)?.title}
                      </ThemedText>
                      <TouchableOpacity
                        onPress={() => handleTogglePlan(item.id)}
                        activeOpacity={0.9}
                        style={[
                          styles.planButton,
                          { backgroundColor: done ? Palette.primaryDeep : '#ecf1f4' },
                        ]}>
                        <IconSymbol
                          name={done ? 'check.circle.fill' : 'play.fill'}
                          size={16}
                          color={done ? '#fff' : '#0D1B1E'}
                        />
                        <ThemedText
                          style={[
                            styles.planButtonText,
                            { color: done ? '#fff' : '#0D1B1E' },
                          ]}>
                          {done ? 'Kész' : 'Indítom'}
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </Surface>
                );
              })}
            </View>
          </Surface>

          <View style={styles.headlineBlock}>
            <ThemedText style={styles.headlineText}>
              Húzd a kedvesebb reframing kártyát a megfelelő gondolathoz.
            </ThemedText>
          </View>

          <View style={styles.matchGrid}>
            <View style={styles.column}>
              <ThemedText style={styles.columnLabel}>Kritikus gondolatok</ThemedText>
              {criticalThoughts.map((thought) => {
                const matched = matches[thought.id];
                const active = selectedThought === thought.id;
                return (
                  <TouchableOpacity
                    key={thought.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedThought(thought.id)}
                    style={{ width: '100%' }}>
                    <Surface
                      variant="raised"
                      padding={14}
                      style={[
                        styles.thoughtCard,
                        active ? styles.cardSelected : undefined,
                        matched ? styles.thoughtMatched : styles.thoughtIdle,
                      ]}>
                      <IconSymbol
                        name={matched ? 'check.circle.fill' : 'sparkles'}
                        size={18}
                        color={matched ? Palette.primaryDeep : Palette.muted}
                        style={styles.thoughtIcon}
                      />
                      <ThemedText
                        style={[
                          styles.thoughtText,
                          { color: matched ? Palette.primaryDeep : Palette.ink },
                        ]}>
                        {thought.text}
                      </ThemedText>
                      {matched ? (
                        <ThemedText style={styles.matchedLabel}>Matched</ThemedText>
                      ) : (
                        <ThemedText style={styles.placeholderText}>Keresd a párját…</ThemedText>
                      )}
                    </Surface>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.column}>
              <ThemedText style={styles.columnLabel}>Reframe kártyák</ThemedText>
              {reframes.map((card) => {
                const alreadyUsed = Object.values(matches).includes(card.id);
                return (
                  <TouchableOpacity
                    key={card.id}
                    activeOpacity={alreadyUsed ? 1 : 0.9}
                    onPress={() => (!alreadyUsed ? handleMatch(card.id) : undefined)}
                    style={{ width: '100%' }}>
                    <Surface
                      variant="raised"
                      tone="peach"
                      padding={16}
                      style={[
                        styles.reframeCard,
                        alreadyUsed ? styles.reframeDisabled : styles.reframeActive,
                      ]}>
                      <View style={styles.reframeTop}>
                        <IconSymbol name="sparkles" size={18} color={Palette.primaryDeep} />
                        <IconSymbol name="leaf" size={18} color={Palette.sage} />
                      </View>
                      <ThemedText
                        style={[
                          styles.reframeText,
                          { color: alreadyUsed ? Palette.muted : Palette.ink },
                        ]}>
                        {card.text}
                      </ThemedText>
                      <View style={styles.reframeFoot}>
                        <ThemedText style={styles.reframeHint}>
                          {alreadyUsed ? 'Elhelyezve' : 'Fogd és illeszd oda'}
                        </ThemedText>
                        <IconSymbol
                          name={alreadyUsed ? 'check.circle.fill' : 'arrow.right'}
                          size={14}
                          color={alreadyUsed ? Palette.primaryDeep : Palette.ink}
                        />
                      </View>
                    </Surface>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.checkBar}>
            <TouchableOpacity style={styles.primaryCta} activeOpacity={0.9}>
              <ThemedText style={styles.primaryCtaText}>Ellenőrzés</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.counterText}>
              {placedCount} / {criticalThoughts.length} párosítva
            </ThemedText>
          </View>

          <SectionHeading
            title="Reflektív napló"
            subtitle="Pont mint a harmadik minta – mood + gondolat"
          />
          <Surface variant="raised" padding={18} style={styles.journalCard}>
            <View style={styles.moodHeader}>
              <ThemedText style={styles.moodTitle}>Hangoltság</ThemedText>
              <Pill tone="primary">
                <ThemedText style={styles.moodPillText}>{session.duration} vezetett meditáció</ThemedText>
              </Pill>
            </View>
            <View style={styles.moodRow}>
              {moods.map((mood) => {
                const active = mood.id === selectedMood;
                return (
                  <TouchableOpacity
                    key={mood.id}
                    onPress={() => setSelectedMood(mood.id)}
                    activeOpacity={0.85}
                    style={[
                      styles.moodButton,
                      {
                        backgroundColor: active ? `${Palette.primary}20` : '#fff',
                        borderColor: active ? Palette.primary : '#dfe4e8',
                      },
                    ]}>
                    <View style={styles.moodIcon}>
                      <IconSymbol
                        name={mood.icon}
                        size={22}
                        color={active ? Palette.primaryDeep : Palette.ink}
                      />
                    </View>
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
              <ThemedText style={styles.promptLabel}>Reflections</ThemedText>
              <TextInput
                style={styles.textArea}
                multiline
                placeholder="Írd le, hogyan érintett a gyakorlat ma…"
                placeholderTextColor="#9FB1B5"
                value={journalText}
                onChangeText={setJournalText}
              />
            </View>
            <View style={styles.journalActions}>
              <TouchableOpacity style={styles.saveButton} activeOpacity={0.92} onPress={handleSave}>
                <IconSymbol name="sparkles" size={18} color="#fff" />
                <ThemedText style={styles.saveText}>Mentés a naplómba</ThemedText>
              </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} activeOpacity={0.85}>
              <ThemedText style={styles.skipText}>Kihagyom</ThemedText>
            </TouchableOpacity>
          </View>
        </Surface>

          <SectionHeading
            title="Játék tér"
            subtitle="Játssz kvízt, ritmusos légzést vagy húzz kártyát"
          />
          <Surface variant="raised" padding={16} style={styles.gamesCard}>
            <View style={styles.gameTabs}>
              {[
                { id: 'quiz' as GameId, label: 'Kvíz', icon: 'brain' as const },
                { id: 'breath' as GameId, label: 'Légzés játék', icon: 'heart.fill' as const },
                { id: 'draw' as GameId, label: 'Kártyahúzás', icon: 'sparkles' as const },
              ].map((game) => {
                const active = selectedGame === game.id;
                return (
                  <TouchableOpacity
                    key={game.id}
                    onPress={() => setSelectedGame(game.id)}
                    activeOpacity={0.88}
                    style={[
                      styles.gameTab,
                      {
                        backgroundColor: active ? `${Palette.primary}18` : '#f5f8fa',
                        borderColor: active ? Palette.primary : '#e1e7eb',
                      },
                    ]}>
                    <IconSymbol
                      name={game.icon}
                      size={18}
                      color={active ? Palette.primaryDeep : Palette.muted}
                    />
                    <ThemedText
                      style={[
                        styles.gameTabText,
                        { color: active ? Palette.primaryDeep : Palette.muted },
                      ]}>
                      {game.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedGame === 'quiz' && (
              <View style={styles.quizCard}>
                <View style={styles.quizHeader}>
                  <Pill tone="peach">
                    <ThemedText style={styles.quizPillText}>
                      {quizIndex + 1} / {quizQuestions.length} kérdés
                    </ThemedText>
                  </Pill>
                  <ThemedText style={styles.quizScore}>Pontszám: {quizScore}</ThemedText>
                </View>
                <ThemedText style={styles.quizQuestion}>{currentQuestion.question}</ThemedText>
                <View style={styles.quizOptions}>
                  {currentQuestion.options.map((option) => {
                    const selected = quizChoice === option;
                    const isCorrectOption = quizDone || quizFeedback
                      ? option === currentQuestion.correct
                      : false;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setQuizChoice(option)}
                        activeOpacity={0.88}
                        style={[
                          styles.quizOption,
                          selected ? styles.quizOptionSelected : undefined,
                          isCorrectOption ? styles.quizOptionCorrect : undefined,
                        ]}>
                        <IconSymbol
                          name={isCorrectOption ? 'check.circle.fill' : 'circle.fill'}
                          size={18}
                          color={
                            isCorrectOption
                              ? Palette.primaryDeep
                              : selected
                                ? Palette.ink
                                : Palette.muted
                          }
                        />
                        <ThemedText
                          style={[
                            styles.quizOptionText,
                            {
                              color: isCorrectOption
                                ? Palette.primaryDeep
                                : selected
                                  ? Palette.ink
                                  : Palette.muted,
                            },
                          ]}>
                          {option}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {quizDone && (
                  <ThemedText style={styles.quizDoneText}>
                    Kész! Pontszám: {quizScore} / {quizQuestions.length}
                  </ThemedText>
                )}
                <ThemedText style={styles.quizTip}>
                  Tipp: {quizFeedback === 'wrong' ? 'Nézd meg újra a légzés vagy határhúzás lépéseit.' : currentQuestion.tip}
                </ThemedText>
                <View style={styles.quizActions}>
                  {!quizDone ? (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.quizButton,
                          { opacity: quizChoice ? 1 : 0.5 },
                        ]}
                        onPress={handleSubmitQuiz}
                        disabled={!quizChoice}>
                        <IconSymbol name="arrow.right" size={16} color="#fff" />
                        <ThemedText style={styles.quizButtonText}>Ellenőrzés</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.quizGhostButton,
                          { opacity: quizFeedback ? 1 : 0.45 },
                        ]}
                        onPress={handleNextQuiz}
                        disabled={!quizFeedback}>
                        <ThemedText style={styles.quizGhostText}>
                          {hasMoreQuestions ? 'Következő kérdés' : 'Utolsó kérdés'}
                        </ThemedText>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity style={styles.quizReset} onPress={handleResetQuiz} activeOpacity={0.9}>
                      <IconSymbol name="repeat" size={16} color="#fff" />
                      <ThemedText style={styles.quizResetText}>Újrajátszom a kvízt</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {selectedGame === 'breath' && (
              <View style={styles.breathCard}>
                <View style={styles.breathHeader}>
                  <ThemedText style={styles.breathTitle}>4-4-6 légzés játék</ThemedText>
                  <Pill tone="foam">
                    <ThemedText style={styles.breathPill}>
                      {breathRound} / {breathTargetRounds} kör
                    </ThemedText>
                  </Pill>
                </View>
                <ThemedText style={styles.breathPhase}>{breathPhases[breathPhase]}</ThemedText>
                <ProgressBar value={breathProgress} progressColor={Palette.primary} trackColor="#ecf1f4" />
                <View style={styles.breathSteps}>
                  {breathPhases.map((phase, index) => (
                    <View
                      key={phase}
                      style={[
                        styles.breathStep,
                        index === breathPhase ? styles.breathStepActive : undefined,
                      ]}>
                      <IconSymbol
                        name="sparkles"
                        size={14}
                        color={index === breathPhase ? Palette.primaryDeep : Palette.muted}
                      />
                      <ThemedText
                        style={[
                          styles.breathStepText,
                          { color: index === breathPhase ? Palette.primaryDeep : Palette.muted },
                        ]}>
                        {phase}
                      </ThemedText>
                    </View>
                  ))}
                </View>
                <View style={styles.breathActions}>
                  <TouchableOpacity style={styles.breathButton} onPress={handleBreathAdvance} activeOpacity={0.9}>
                    <IconSymbol name="play.fill" size={18} color="#fff" />
                    <ThemedText style={styles.breathButtonText}>Következő ritmus</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.breathGhost} onPress={handleBreathReset} activeOpacity={0.85}>
                    <ThemedText style={styles.breathGhostText}>Újrakezdem</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedGame === 'draw' && (
              <View style={styles.drawCard}>
                <View style={styles.drawHeader}>
                  <ThemedText style={styles.drawTitle}>{currentCard.title}</ThemedText>
                  <Pill tone="peach">
                    <ThemedText style={styles.drawPill}>Húzás #{drawCount}</ThemedText>
                  </Pill>
                </View>
                <Surface variant="raised" padding={12} style={styles.drawPrompt}>
                  <ThemedText style={styles.drawLabel}>Feladat</ThemedText>
                  <ThemedText style={styles.drawText}>{currentCard.prompt}</ThemedText>
                </Surface>
                <Surface variant="tonal" tone="foam" padding={12} style={styles.drawAction}>
                  <ThemedText style={styles.drawLabel}>Teendő</ThemedText>
                  <ThemedText style={styles.drawText}>{currentCard.action}</ThemedText>
                </Surface>
                <TouchableOpacity style={styles.drawButton} onPress={handleDrawCard} activeOpacity={0.9}>
                  <IconSymbol name="sparkles" size={18} color="#fff" />
                  <ThemedText style={styles.drawButtonText}>Új kártya húzása</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </Surface>

          <Surface variant="tonal" tone="foam" padding={16} style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <IconSymbol name="sparkles" size={18} color={Palette.primaryDeep} />
              <ThemedText style={styles.statsTitle}>Játék statisztika</ThemedText>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Kvíz futások</ThemedText>
                <ThemedText style={styles.statValue}>{quizRuns}x</ThemedText>
                <ThemedText style={styles.statSub}>Csúcs: {quizBest} pont</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Légzés körök</ThemedText>
                <ThemedText style={styles.statValue}>{breathSessions}x</ThemedText>
                <ThemedText style={styles.statSub}>4-4-6 készre</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Kártya húzások</ThemedText>
                <ThemedText style={styles.statValue}>{drawCount}x</ThemedText>
                <ThemedText style={styles.statSub}>Reflexiók: {notesSaved}</ThemedText>
              </View>
            </View>
          </Surface>

          <SectionHeading
            title="Saját 10-12 perces flow"
            subtitle="Önszeretet, én-idő, női szerepek – online feladatokkal"
          />
          <Surface variant="raised" padding={16} style={styles.builderCard}>
            <View style={styles.builderTop}>
              <View style={{ gap: 6 }}>
                <ThemedText style={styles.builderLabel}>Fókusz</ThemedText>
                <ThemedText style={styles.builderTitle}>Válassz témát és feladattípust</ThemedText>
              </View>
              <Pill tone="foam">
                <ThemedText style={styles.builderPillText}>{targetLength} perces csomag</ThemedText>
              </Pill>
            </View>

            <View style={styles.focusChips}>
              {focusAreas.map((area) => {
                const active = area.id === selectedFocus;
                return (
                  <TouchableOpacity
                    key={area.id}
                    onPress={() => setSelectedFocus(area.id)}
                    activeOpacity={0.88}
                    style={[
                      styles.focusChip,
                      {
                        backgroundColor: active ? `${area.tone}18` : '#fff',
                        borderColor: active ? area.tone : '#e0e6ea',
                      },
                    ]}>
                    <ThemedText
                      style={[
                        styles.focusChipText,
                        { color: active ? area.tone : Palette.muted },
                      ]}>
                      {area.title}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.lengthRow}>
              {[10, 12].map((minutes) => {
                const active = minutes === targetLength;
                return (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.lengthChip,
                      { backgroundColor: active ? `${Palette.primary}18` : '#f5f8fa' },
                    ]}
                    onPress={() => setTargetLength(minutes)}
                    activeOpacity={0.85}>
                    <IconSymbol
                      name="timer"
                      size={16}
                      color={active ? Palette.primaryDeep : Palette.muted}
                    />
                    <ThemedText
                      style={[
                        styles.lengthText,
                        { color: active ? Palette.primaryDeep : Palette.muted },
                      ]}>
                      {minutes} perc
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.builderProgressHeader}>
              <ThemedText style={styles.builderProgressText}>
                {totalMinutes} / {targetLength} percnyi feladat
              </ThemedText>
              <ThemedText style={styles.builderProgressSub}>
                {builderProgress < 100 ? 'Kiegészítheted még' : 'Kész az ütemezés'}
              </ThemedText>
            </View>
            <ProgressBar
              value={builderProgress}
              progressColor={Palette.primary}
              trackColor="#ecf1f4"
            />

            <View style={styles.templateHeader}>
              <ThemedText style={styles.templateLabel}>Feladattípus választó</ThemedText>
              <ThemedText style={styles.templateHint}>Párosítós, behúzogatós, írásos</ThemedText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateRow}>
              {taskTemplates.map((template) => (
                <Surface
                  key={template.id}
                  variant="tonal"
                  tone="foam"
                  padding={14}
                  style={styles.templateCard}>
                  <View style={styles.templateTop}>
                    <Pill tone="peach">
                      <ThemedText style={styles.templateBadge}>{template.badge}</ThemedText>
                    </Pill>
                    <View style={styles.templateMinutes}>
                      <IconSymbol name="timer" size={16} color={Palette.primaryDeep} />
                      <ThemedText style={styles.templateMinutesText}>
                        {template.duration} perc
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.templateTitle}>
                    {template.label}
                  </ThemedText>
                  <ThemedText style={styles.templateDescription}>{template.description}</ThemedText>
                  <Surface variant="raised" padding={10} style={styles.templateExample}>
                    <View style={styles.templateExampleRow}>
                      <IconSymbol name="sparkles" size={16} color={Palette.primaryDeep} />
                      <ThemedText style={styles.templateExampleLabel}>Minta</ThemedText>
                    </View>
                    <ThemedText style={styles.templateExampleText}>{template.example}</ThemedText>
                  </Surface>
                  <TouchableOpacity
                    style={styles.addTaskButton}
                    activeOpacity={0.88}
                    onPress={() => handleAddTaskType(template.id)}>
                    <IconSymbol name="arrow.right" size={16} color="#fff" />
                    <ThemedText style={styles.addTaskButtonText}>Hozzáadom</ThemedText>
                  </TouchableOpacity>
                </Surface>
              ))}
            </ScrollView>

            <View style={styles.sequenceHeader}>
              <ThemedText style={styles.sequenceLabel}>Aktív foglalkozás</ThemedText>
              <ThemedText style={styles.sequenceMeta}>
                {builderTasks.length} feladat • {totalMinutes} perc
              </ThemedText>
            </View>
            <View style={styles.sequenceList}>
              {builderTasks.map((task, index) => {
                const template = taskTemplateMap[task.type];
                return (
                  <Surface key={task.id} variant="raised" padding={12} style={styles.sequenceCard}>
                    <View style={styles.sequenceTopRow}>
                      <View style={styles.sequenceTitles}>
                        <ThemedText style={styles.sequenceTitle}>{task.title}</ThemedText>
                        <ThemedText style={styles.sequenceDescription}>
                          {template?.label} • {task.note ?? template?.description}
                        </ThemedText>
                        <ThemedText style={[styles.sequenceTag, { color: toneByFocus[task.focus] }]}>
                          {focusAreas.find((area) => area.id === task.focus)?.title ?? 'Fókusz'}
                        </ThemedText>
                      </View>
                      <View style={styles.reorderButtons}>
                        <TouchableOpacity
                          onPress={() => handleMoveTask(task.id, -1)}
                          disabled={index === 0}
                          style={[styles.reorderButton, index === 0 && styles.reorderDisabled]}
                          activeOpacity={0.85}>
                          <IconSymbol
                            name="arrow.up"
                            size={18}
                            color={index === 0 ? Palette.muted : Palette.primaryDeep}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleMoveTask(task.id, 1)}
                          disabled={index === builderTasks.length - 1}
                          style={[
                            styles.reorderButton,
                            index === builderTasks.length - 1 && styles.reorderDisabled,
                          ]}
                          activeOpacity={0.85}>
                          <IconSymbol
                            name="arrow.down"
                            size={18}
                            color={
                              index === builderTasks.length - 1 ? Palette.muted : Palette.primaryDeep
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.sequenceMetaRow}>
                      <ThemedText style={styles.sequenceDuration}>
                        {template?.duration ?? 2} perc • online feladat
                      </ThemedText>
                      <IconSymbol name="repeat" size={16} color={Palette.primaryDeep} />
                    </View>
                  </Surface>
                );
              })}
            </View>

            <View style={styles.customInput}>
              <ThemedText style={styles.customLabel}>Adj hozzá saját kérdést vagy feladatot</ThemedText>
              <TextInput
                value={customQuestion}
                onChangeText={setCustomQuestion}
                style={styles.customField}
                placeholder="Pl.: Mit szeretnél ma elengedni? Írd le 3 mondatban."
                placeholderTextColor="#9FB1B5"
                multiline
              />
              <TextInput
                value={customNote}
                onChangeText={setCustomNote}
                style={styles.customField}
                placeholder="Instrukció / variáció (pl.: 3 lehetőség, 1 helyes válasz)"
                placeholderTextColor="#9FB1B5"
                multiline
              />
              <TouchableOpacity
                style={styles.saveFlowButton}
                onPress={handleAddCustomQuestion}
                activeOpacity={0.9}>
                <IconSymbol name="edit.note" size={18} color="#fff" />
                <ThemedText style={styles.saveFlowButtonText}>Feladat hozzáadása a flow-hoz</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.flowActions}>
              <TouchableOpacity
                style={styles.primaryFlowButton}
                activeOpacity={0.9}
                onPress={handleSaveFlow}>
                <IconSymbol name="tray.and.arrow.down" size={18} color="#0D1B1E" />
                <ThemedText style={styles.primaryFlowText}>Mentem és visszajátszható</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryFlowButton} activeOpacity={0.88}>
                <IconSymbol name="play.fill" size={18} color={Palette.primaryDeep} />
                <ThemedText style={styles.secondaryFlowText}>Indítás most</ThemedText>
              </TouchableOpacity>
            </View>
          </Surface>

          <SectionHeading title="Gyakorlatsorok" subtitle="Fedezd fel további flow-kat" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.focusRow}>
            {sessionLibrary.slice(0, 4).map((item) => {
              const isFav = favoriteSessions[item.id];
              return (
                <Surface
                  key={item.id}
                  variant="raised"
                  padding={16}
                  style={[
                    styles.sessionCard,
                    isFav ? { borderColor: Palette.primary, borderWidth: 1 } : null,
                  ]}>
                  <View style={styles.sessionTopRow}>
                    <Pill tone="foam">
                      <ThemedText style={styles.sessionPillText}>{item.duration}</ThemedText>
                    </Pill>
                    <View style={styles.sessionTopRight}>
                      <ThemedText style={[styles.sessionAnchor, { color: toneByFocus[item.category] }]}>
                        {item.anchor}
                      </ThemedText>
                      <TouchableOpacity
                        onPress={() => handleToggleFavorite(item.id)}
                        activeOpacity={0.85}
                        style={styles.favoriteButton}>
                        <IconSymbol
                          name={isFav ? 'heart.fill' : 'heart'}
                          size={18}
                          color={isFav ? Palette.primaryDeep : Palette.muted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.sessionTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.sessionDescription}>{item.description}</ThemedText>
                  <ThemedText style={styles.sessionMeta}>{item.format}</ThemedText>
                  <TouchableOpacity style={styles.sessionButton} activeOpacity={0.88}>
                    <IconSymbol name="play.fill" size={16} color="#0D1B1E" />
                    <ThemedText style={styles.sessionButtonText}>
                      {isFav ? 'Folytatás' : 'Indítás'}
                    </ThemedText>
                  </TouchableOpacity>
                </Surface>
              );
            })}
          </ScrollView>

          <SectionHeading
            title="Visszanézhető foglalkozások"
            subtitle="Mentett 10-12 perces csomagok, feladattípusokkal"
          />
          <View style={styles.replayList}>
            {replays.map((item) => (
              <Surface key={item.id} variant="raised" padding={14} style={styles.replayCard}>
                <View style={styles.replayTop}>
                  <View style={{ gap: 4, flex: 1 }}>
                    <ThemedText style={styles.replayTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.replayMeta}>
                      {item.savedAt} • {item.mood}
                    </ThemedText>
                  </View>
                  <Pill tone="sage">
                    <ThemedText style={styles.replayLength}>{item.length}</ThemedText>
                  </Pill>
                </View>
                <View style={styles.replayActions}>
                  <TouchableOpacity style={styles.replayPlay} activeOpacity={0.9}>
                    <IconSymbol name="play.fill" size={18} color="#fff" />
                    <ThemedText style={styles.replayPlayText}>Újra lejátszom</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replayGhost} activeOpacity={0.85}>
                    <IconSymbol name="repeat" size={18} color={Palette.primaryDeep} />
                    <ThemedText style={styles.replayGhostText}>Szerkesztés</ThemedText>
                  </TouchableOpacity>
                </View>
              </Surface>
            ))}
          </View>

          <SectionHeading title="Jelvények" subtitle="Haladásod röviden" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeRow}>
            {achievements.map((badge) => (
              <Surface key={badge.id} variant="raised" padding={14} style={styles.badgeCard}>
                <View style={[styles.badgeIcon, { backgroundColor: `${badge.tone}22` }]}>
                  <IconSymbol name={badge.icon} size={18} color={badge.tone} />
                </View>
                <ThemedText style={[styles.badgeTitle, { color: badge.tone }]}>
                  {badge.title}
                </ThemedText>
                <ThemedText style={styles.badgeDetail}>{badge.detail}</ThemedText>
              </Surface>
            ))}
          </ScrollView>

          <SectionHeading title="Gyors jegyzet" subtitle="Későbbi folytatáshoz" />
          <View style={styles.promptsRow}>
            {writingPrompts.map((prompt) => (
              <Surface key={prompt.id} variant="raised" padding={14} style={styles.promptCard}>
                <View style={styles.promptTop}>
                  <IconSymbol name="edit.note" size={18} color={Palette.primaryDeep} />
                  <ThemedText type="defaultSemiBold" style={styles.promptTitle}>
                    {prompt.title}
                  </ThemedText>
                </View>
                <ThemedText style={styles.promptMinutes}>{prompt.minutes} perc írás</ThemedText>
                <ThemedText style={styles.promptPlaceholder}>{prompt.placeholder}</ThemedText>
                <TouchableOpacity style={styles.promptButton} activeOpacity={0.9}>
                  <ThemedText style={styles.promptButtonText}>Jegyzet megnyitása</ThemedText>
                </TouchableOpacity>
              </Surface>
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
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 42,
  },
  topAppBar: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appIcon: {
    width: 46,
    height: 46,
    borderRadius: Radii.lg,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7ebef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitles: {
    alignItems: 'center',
  },
  topEyebrow: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  topTitle: {
    fontSize: 18,
    color: Palette.ink,
  },
  progressWrapper: {
    paddingHorizontal: 18,
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 13,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Palette.muted,
  },
  progressValue: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodyBold,
  },
  quickPlanCard: {
    marginHorizontal: 18,
    marginTop: 10,
    gap: 8,
  },
  quickPlanTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickPlanLabel: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  quickPlanTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    color: Palette.ink,
    lineHeight: 24,
  },
  quickPlanAnchor: {
    fontFamily: Fonts.bodySemiBold,
  },
  quickPlanButton: {
    backgroundColor: Palette.primaryDeep,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickPlanButtonText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
  },
  quickPlanMeta: {
    color: Palette.muted,
  },
  headlineBlock: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headlineText: {
    textAlign: 'center',
    fontSize: 20,
    color: Palette.ink,
    lineHeight: 26,
    fontFamily: Fonts.bodyBold,
  },
  matchGrid: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  columnLabel: {
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  thoughtCard: {
    gap: 8,
    minHeight: 120,
    justifyContent: 'center',
  },
  thoughtIdle: {
    borderStyle: 'dashed',
    borderColor: '#e2e7eb',
  },
  thoughtMatched: {
    backgroundColor: `${Palette.primary}10`,
    borderColor: `${Palette.primary}55`,
  },
  cardSelected: {
    borderColor: Palette.primary,
  },
  thoughtIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  thoughtText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Fonts.bodyBold,
  },
  placeholderText: {
    color: Palette.muted,
    fontSize: 12,
  },
  matchedLabel: {
    color: Palette.primaryDeep,
    fontSize: 12,
    fontFamily: Fonts.bodySemiBold,
  },
  reframeCard: {
    gap: 10,
    minHeight: 120,
  },
  reframeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reframeText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Fonts.bodySemiBold,
  },
  reframeFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reframeHint: {
    color: Palette.muted,
    fontSize: 12,
  },
  reframeActive: {
    borderColor: '#f0e1d9',
    backgroundColor: `${Palette.peach}25`,
  },
  reframeDisabled: {
    opacity: 0.55,
  },
  checkBar: {
    padding: 18,
    gap: 8,
    alignItems: 'center',
  },
  primaryCta: {
    width: '100%',
    height: 54,
    backgroundColor: Palette.primary,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...{
      shadowColor: 'rgba(121, 188, 210, 0.3)',
      shadowOpacity: 0.6,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  },
  primaryCtaText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  counterText: {
    color: Palette.muted,
    fontSize: 12,
    fontFamily: Fonts.bodySemiBold,
  },
  journalCard: {
    marginHorizontal: 18,
    marginTop: 10,
    gap: 14,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodTitle: {
    fontSize: 14,
    color: Palette.ink,
    fontFamily: Fonts.bodyBold,
  },
  moodPillText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
  moodIcon: {
    width: 28,
    height: 28,
    borderRadius: Radii.md,
    backgroundColor: '#f1f5f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodLabel: {
    fontFamily: Fonts.bodySemiBold,
  },
  textAreaWrapper: {
    backgroundColor: '#f7f9fb',
    borderRadius: Radii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6eaee',
    gap: 8,
  },
  promptLabel: {
    color: Palette.muted,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: Fonts.bodySemiBold,
  },
  textArea: {
    minHeight: 140,
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
  builderCard: {
    marginHorizontal: 18,
    marginTop: 10,
    gap: 12,
  },
  builderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  builderLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  builderTitle: {
    fontSize: 18,
    color: Palette.ink,
    fontFamily: Fonts.bodyBold,
    lineHeight: 24,
  },
  builderPillText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  focusChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  focusChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  focusChipText: {
    fontFamily: Fonts.bodySemiBold,
  },
  lengthRow: {
    flexDirection: 'row',
    gap: 10,
  },
  lengthChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lengthText: {
    fontFamily: Fonts.bodySemiBold,
  },
  builderProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  builderProgressText: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.ink,
  },
  builderProgressSub: {
    color: Palette.muted,
    fontSize: 12,
  },
  templateHeader: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateLabel: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
  },
  templateHint: {
    color: Palette.muted,
  },
  templateRow: {
    paddingVertical: 8,
    gap: 12,
  },
  templateCard: {
    width: 240,
    marginRight: 12,
    gap: 8,
    borderRadius: Radii.lg,
  },
  templateTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateBadge: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  templateMinutes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  templateMinutesText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  templateTitle: {
    fontSize: 16,
    color: Palette.ink,
  },
  templateDescription: {
    color: Palette.muted,
    lineHeight: 20,
  },
  templateExample: {
    backgroundColor: '#fff',
    borderRadius: Radii.md,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5eaee',
  },
  templateExampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  templateExampleLabel: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  templateExampleText: {
    color: Palette.ink,
    fontFamily: Fonts.body,
  },
  addTaskButton: {
    marginTop: 8,
    backgroundColor: Palette.primary,
    paddingVertical: 10,
    borderRadius: Radii.md,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskButtonText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
  },
  sequenceHeader: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sequenceLabel: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.ink,
  },
  sequenceMeta: {
    color: Palette.muted,
  },
  sequenceList: {
    gap: 8,
  },
  sequenceCard: {
    borderRadius: Radii.lg,
    gap: 8,
  },
  sequenceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sequenceTitles: {
    flex: 1,
    gap: 4,
  },
  sequenceTitle: {
    fontSize: 15,
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
  },
  sequenceDescription: {
    color: Palette.muted,
    lineHeight: 18,
  },
  sequenceTag: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },
  reorderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  reorderButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#e1e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fafc',
  },
  reorderDisabled: {
    opacity: 0.4,
  },
  sequenceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sequenceDuration: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },
  customInput: {
    marginTop: 10,
    gap: 10,
  },
  customLabel: {
    color: Palette.ink,
    fontFamily: Fonts.bodySemiBold,
  },
  customField: {
    borderWidth: 1,
    borderColor: '#e1e6ea',
    borderRadius: Radii.lg,
    padding: 12,
    minHeight: 72,
    textAlignVertical: 'top',
    fontFamily: Fonts.body,
    color: Palette.ink,
  },
  saveFlowButton: {
    backgroundColor: Palette.primary,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveFlowButtonText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
  },
  flowActions: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  primaryFlowButton: {
    flex: 1,
    backgroundColor: Palette.peach,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryFlowText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodyBold,
  },
  secondaryFlowButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Palette.primary,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryFlowText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  replayList: {
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 10,
  },
  replayCard: {
    gap: 10,
  },
  replayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  replayTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 16,
  },
  replayMeta: {
    color: Palette.muted,
  },
  replayLength: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  replayActions: {
    flexDirection: 'row',
    gap: 10,
  },
  replayPlay: {
    flex: 1,
    backgroundColor: Palette.primaryDeep,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayPlayText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
  },
  replayGhost: {
    flex: 1,
    backgroundColor: '#ecf1f4',
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayGhostText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  gamesCard: {
    marginHorizontal: 18,
    marginTop: 10,
    gap: 12,
  },
  gameTabs: {
    flexDirection: 'row',
    gap: 10,
  },
  gameTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  gameTabText: {
    fontFamily: Fonts.bodySemiBold,
  },
  quizCard: {
    gap: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizPillText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  quizScore: {
    color: Palette.ink,
    fontFamily: Fonts.bodySemiBold,
  },
  quizQuestion: {
    fontSize: 16,
    color: Palette.ink,
    fontFamily: Fonts.bodyBold,
    lineHeight: 22,
  },
  quizOptions: {
    gap: 8,
  },
  quizOption: {
    borderWidth: 1,
    borderColor: '#e2e7eb',
    borderRadius: Radii.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
  },
  quizOptionSelected: {
    borderColor: Palette.primary,
    backgroundColor: `${Palette.primary}12`,
  },
  quizOptionCorrect: {
    borderColor: Palette.primaryDeep,
    backgroundColor: `${Palette.primary}20`,
  },
  quizOptionText: {
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
    lineHeight: 20,
  },
  quizTip: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  quizDoneText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  quizActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  quizButton: {
    flex: 1,
    backgroundColor: Palette.primary,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizButtonText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
  },
  quizGhostButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Radii.lg,
    backgroundColor: '#edf2f5',
  },
  quizGhostText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  quizReset: {
    width: '100%',
    backgroundColor: Palette.primaryDeep,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizResetText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
  },
  breathCard: {
    gap: 12,
  },
  breathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breathTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 16,
  },
  breathPill: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  breathPhase: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
  },
  breathSteps: {
    flexDirection: 'row',
    gap: 8,
  },
  breathStep: {
    borderWidth: 1,
    borderColor: '#e3e9ed',
    borderRadius: Radii.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breathStepActive: {
    borderColor: Palette.primary,
    backgroundColor: `${Palette.primary}12`,
  },
  breathStepText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },
  breathActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  breathButton: {
    flex: 1,
    backgroundColor: Palette.primaryDeep,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  breathButtonText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
  },
  breathGhost: {
    flex: 1,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#e1e6ea',
    paddingVertical: 12,
    alignItems: 'center',
  },
  breathGhostText: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  drawCard: {
    gap: 10,
  },
  drawHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Palette.ink,
  },
  drawPill: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  drawPrompt: {
    borderRadius: Radii.lg,
    gap: 4,
    borderWidth: 1,
    borderColor: '#e6eaee',
  },
  drawAction: {
    borderRadius: Radii.lg,
    gap: 4,
  },
  drawLabel: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  drawText: {
    color: Palette.ink,
    fontFamily: Fonts.body,
    lineHeight: 20,
  },
  drawButton: {
    backgroundColor: Palette.primary,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  drawButtonText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
  },
  focusRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  sessionCard: {
    width: 220,
    marginRight: 12,
    gap: 10,
  },
  sessionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionPillText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  sessionAnchor: {
    fontFamily: Fonts.bodySemiBold,
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#e4e9ed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f9fb',
  },
  sessionTitle: {
    color: Palette.ink,
    fontSize: 18,
  },
  sessionDescription: {
    color: Palette.muted,
    lineHeight: 20,
  },
  sessionMeta: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  sessionButton: {
    marginTop: 4,
    backgroundColor: '#ecf1f4',
    paddingVertical: 10,
    borderRadius: Radii.md,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodySemiBold,
  },
  promptsRow: {
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 12,
  },
  promptCard: {
    gap: 8,
  },
  promptTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promptTitle: {
    color: Palette.ink,
  },
  promptMinutes: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  promptPlaceholder: {
    color: Palette.muted,
  },
  promptButton: {
    backgroundColor: `${Palette.primary}16`,
    paddingVertical: 10,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  promptButtonText: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  streakRow: {
    paddingHorizontal: 18,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  streakCard: {
    flex: 1,
    gap: 6,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakLabel: {
    fontFamily: Fonts.bodySemiBold,
    color: Palette.muted,
    fontSize: 12,
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakValue: {
    fontFamily: Fonts.bodyBold,
    fontSize: 22,
    color: Palette.ink,
  },
  streakPill: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  streakHint: {
    color: Palette.muted,
  },
  pointsCard: {
    width: 150,
    gap: 6,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsLabel: {
    color: Palette.ink,
    fontFamily: Fonts.bodySemiBold,
  },
  pointsValue: {
    fontSize: 22,
    fontFamily: Fonts.bodyBold,
    color: Palette.primaryDeep,
  },
  pointsHint: {
    color: Palette.muted,
  },
  dailyCard: {
    marginHorizontal: 18,
    marginTop: 12,
    gap: 10,
  },
  dailyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyTitle: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
  },
  dailyMinutes: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  dailyMeta: {
    color: Palette.muted,
  },
  dailySteps: {
    gap: 8,
  },
  dailyStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dailyStepText: {
    color: Palette.ink,
    fontFamily: Fonts.bodySemiBold,
  },
  dailyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyReward: {
    color: Palette.primaryDeep,
    fontFamily: Fonts.bodySemiBold,
  },
  dailyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
  },
  dailyButtonText: {
    color: '#0D1B1E',
    fontFamily: Fonts.bodyBold,
  },
  planCard: {
    marginHorizontal: 18,
    marginTop: 10,
    gap: 10,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
  },
  planProgressValue: {
    fontFamily: Fonts.bodyBold,
    color: Palette.primaryDeep,
    fontSize: 16,
  },
  planHint: {
    color: Palette.muted,
  },
  planList: {
    gap: 10,
  },
  planItem: {
    borderWidth: 1,
    borderRadius: Radii.lg,
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
  planAnchor: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  planItemTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: Palette.ink,
  },
  planItemMeta: {
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
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.lg,
  },
  planButtonText: {
    fontFamily: Fonts.bodyBold,
  },
  statsCard: {
    marginHorizontal: 18,
    marginTop: 10,
    gap: 12,
    borderRadius: Radii.lg,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsTitle: {
    color: Palette.ink,
    fontFamily: Fonts.bodyBold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Radii.md,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#e6eaee',
  },
  statLabel: {
    color: Palette.muted,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  statValue: {
    fontFamily: Fonts.bodyBold,
    color: Palette.ink,
    fontSize: 18,
  },
  statSub: {
    color: Palette.muted,
    fontSize: 12,
  },
  badgeRow: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 12,
  },
  badgeCard: {
    width: 180,
    marginRight: 12,
    gap: 6,
    borderRadius: Radii.lg,
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
  },
  badgeDetail: {
    color: Palette.muted,
    lineHeight: 18,
  },
});
