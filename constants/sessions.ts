export type FocusArea = {
  id: 'self-love' | 'me-time' | 'roles' | 'presence';
  title: string;
  description: string;
  duration: string;
  accent: string;
  tone: string;
  anchor: string;
};

export type Session = {
  id: string;
  category: FocusArea['id'];
  title: string;
  duration: string;
  vibe: string;
  description: string;
  steps: string[];
  format: string;
  anchor: string;
  prompt: string;
};

export type PlanItem = {
  id: string;
  day: string;
  title: string;
  focus: FocusArea['id'];
  anchor: string;
  length: string;
  detail: string;
};

export type Replay = {
  id: string;
  title: string;
  savedAt: string;
  mood: string;
  length: string;
};

export const focusAreas: FocusArea[] = [
  {
    id: 'self-love',
    title: 'Önszeretet',
    description: 'Kíméletes hanganyag + írás, 3 erős mondattal magadhoz.',
    duration: '12 perc',
    accent: '#FFE3E1',
    tone: '#F06B73',
    anchor: 'Esti zárás',
  },
  {
    id: 'me-time',
    title: 'Én-idő',
    description: 'Lassítás, határhúzás, mozdulat + jegyzet. Otthonról, online.',
    duration: '10 perc',
    accent: '#DDF3EC',
    tone: '#53B59B',
    anchor: 'Reggeli indulás',
  },
  {
    id: 'roles',
    title: 'Női szerepek',
    description: 'Saját szabályok, támogatók térképe és rövid vizualizáció.',
    duration: '11 perc',
    accent: '#EBE6FF',
    tone: '#8F7CEE',
    anchor: 'Délutáni reset',
  },
  {
    id: 'presence',
    title: 'Jelenlét & reziliencia',
    description: 'Grounding, légzés, „most vagyok itt” rutin – újrajátszható.',
    duration: '10 perc',
    accent: '#FFEED1',
    tone: '#E8A23C',
    anchor: 'Késő délután',
  },
];

export const sessionLibrary: Session[] = [
  {
    id: 'self-love-ritual',
    category: 'self-love',
    title: 'Önszeretet mini-rutin',
    duration: '12 perc',
    vibe: 'puha jelenlét',
    description: 'Légzés + hanganyag, majd 3 mondat arról, hogyan vagy elég ma.',
    steps: [
      '3 perc lassú légzés és testhangolás',
      'Hanganyag: gyengéd önmegerősítések',
      'Írás: 3 mondat, amit hallani akarsz magadtól',
      'Nyújtás: puha váll- és mellkasnyitás',
    ],
    format: 'Hang + írás + mozdulat',
    anchor: 'Esti zárás',
    prompt: 'Írd le, mire vagy most büszke – 2-3 mondat elég.',
  },
  {
    id: 'me-time-reset',
    category: 'me-time',
    title: '10 perces én-idő reset',
    duration: '10 perc',
    vibe: 'könnyed fókusz',
    description: 'Határhúzás kimondva, 5 perc mozdulat, 3 perc jegyzet.',
    steps: [
      'Szándék kimondása: „most magamra figyelek”',
      '5 perc nyújtás + lassú kar-lengés',
      'Jegyzet: mihez van kedved ma? 3 ötlet',
      'Mini hála: 1 mondat arról, mit köszönsz magadnak',
    ],
    format: 'Hang + mozdulat + jegyzet',
    anchor: 'Reggeli indulás',
    prompt: 'Írd le, mire mondasz ma igent és mire nemet.',
  },
  {
    id: 'roles-rewrite',
    category: 'roles',
    title: 'Női szerepek: újraírás',
    duration: '11 perc',
    vibe: 'magabiztos',
    description: 'Támogatóid listája + rövid vizualizáció + erő-mondat.',
    steps: [
      'Légzés: 4-6 arányban 5 ismétlés',
      'Lista: 3 támogató, akire támaszkodhatsz',
      'Vizualizáció: milyen szabályt írsz át ma?',
      'Erő-mondat kimondása hangosan',
    ],
    format: 'Hang + vizualizáció + írás',
    anchor: 'Délutáni reset',
    prompt: 'Melyik szerepedet lágyítanád? Írj 3 mondatot.',
  },
  {
    id: 'presence-ground',
    category: 'presence',
    title: 'Jelenlét & reziliencia',
    duration: '10 perc',
    vibe: 'földelt',
    description: 'Talpak a földön, légzés, majd rövid „most vagyok itt” jegyzet.',
    steps: [
      '2 perc talajérzet: lábfej, tenyér, hát',
      'Légzés: 4-4-6 tempó 6 körön át',
      'Jegyzet: mi támogat most? 3 szó',
      'Zárás: nyújtás és sóhaj',
    ],
    format: 'Grounding + írás',
    anchor: 'Késő délután',
    prompt: 'Nevezd meg, mi segít ma jelen maradni.',
  },
  {
    id: 'self-love-move',
    category: 'self-love',
    title: 'Affirmáció + mozdulat',
    duration: '11 perc',
    vibe: 'emelő',
    description: '3 kedvenc mondatod mozdulattal kísérve, rövid visszajelzés.',
    steps: [
      'Hanganyag: 3 erő-mondat',
      'Mozdulat: kar- és vállnyitás, 5 lassú kör',
      'Írás: milyen érzés volt kimondani?',
    ],
    format: 'Hang + mozdulat + írás',
    anchor: 'Este vagy csendes délután',
    prompt: 'Melyik mondat marad veled ma?',
  },
  {
    id: 'me-time-nature',
    category: 'me-time',
    title: 'Én-idő kinti levegővel',
    duration: '12 perc',
    vibe: 'kisimító',
    description: 'Séta a közelben + hanganyag + rövid hangjegyzet/írás.',
    steps: [
      'Séta 5 percig – telefon zsebbe',
      'Hanganyag: jelenlét figyelése',
      'Jegyzet: mit vettél észre 3 szóban?',
    ],
    format: 'Hang + séta + jegyzet',
    anchor: 'Délután vagy kora este',
    prompt: 'Mi volt a legkedvesebb pillanat a sétán?',
  },
];

export const weeklyPlan: PlanItem[] = [
  {
    id: 'mon',
    day: 'H',
    title: 'Reggeli én-idő',
    focus: 'me-time',
    anchor: '07:30',
    length: '10 perc',
    detail: 'Határ kimondása + mozdulat + jegyzet',
  },
  {
    id: 'wed',
    day: 'Sze',
    title: 'Önszeretet esti rutin',
    focus: 'self-love',
    anchor: '21:00',
    length: '12 perc',
    detail: 'Hanganyag + 3 kedves mondat magadhoz',
  },
  {
    id: 'fri',
    day: 'P',
    title: 'Szerepek átírása',
    focus: 'roles',
    anchor: '17:30',
    length: '11 perc',
    detail: 'Vizualizáció + erő-mondat',
  },
  {
    id: 'sun',
    day: 'V',
    title: 'Reziliencia check-in',
    focus: 'presence',
    anchor: '19:00',
    length: '10 perc',
    detail: 'Grounding + jegyzet + nyújtás',
  },
];

export const replays: Replay[] = [
  {
    id: 'r1',
    title: 'Önszeretet mini-rutin',
    savedAt: 'Tegnap • 21:05',
    mood: 'Nyugalom',
    length: '12 perc',
  },
  {
    id: 'r2',
    title: '10 perces én-idő reset',
    savedAt: 'Kedd • 07:50',
    mood: 'Kisimult',
    length: '10 perc',
  },
  {
    id: 'r3',
    title: 'Női szerepek: újraírás',
    savedAt: 'Múlt hét • 18:10',
    mood: 'Magabiztos',
    length: '11 perc',
  },
];

export const writingPrompts = [
  {
    id: 'p1',
    title: '3 mondat gyengéden magadhoz',
    minutes: 3,
    placeholder: 'Írd le, miben voltál ma figyelmes magaddal…',
  },
  {
    id: 'p2',
    title: 'Határ, ami ma jól esik',
    minutes: 2,
    placeholder: 'Mikor mondasz igent önmagadra? Röviden rögzítsd.',
  },
  {
    id: 'p3',
    title: 'Szerepek – saját szabályaim',
    minutes: 4,
    placeholder: 'Melyik szabályt írod át? Írd le új, saját verziódat.',
  },
];
