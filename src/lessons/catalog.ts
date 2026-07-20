export const LESSON_CATALOG_VERSION = 1;

export type LessonLine = { dutch: string; english: string; telugu: string };
export type LessonCandidate = { id: string; dutch: string; english: string; telugu: string; kind: "word" | "chunk" };
export type LessonPracticePrompt = { candidateId: string; dimension: "recognition" | "recall" };
export type Lesson = {
  id: string; pathway: string; order: number; cefr: "A0" | "A1" | "A2"; title: string; durationMinutes: number;
  pattern: string; patternText: string; patternExplanation: string; lines: LessonLine[];
  candidates: LessonCandidate[]; practice: LessonPracticePrompt[];
  review: { dutch: true; english: true; telugu: true; cefr: true; cultural: true; practicalUse: true };
};
export type LessonCatalog = { version: typeof LESSON_CATALOG_VERSION; lessons: Lesson[] };

export const appointmentLesson: Lesson = {
  id: "a1-een-afspraak-maken", pathway: "appointments-and-healthcare", order: 7,
  cefr: "A1", title: "A1 · Een afspraak maken", durationMinutes: 4,
  pattern: "Ik wil graag…", patternText: "Ik wil graag", patternExplanation: "Use Ik wil graag… to make a polite request. The verb stays in its normal position after ik.",
  lines: [
    { dutch: "Receptionist: Goedemorgen. Waarmee kan ik u helpen?", english: "Receptionist: Good morning. How can I help you?", telugu: "రిసెప్షనిస్ట్: శుభోదయం. నేను మీకు ఎలా సహాయం చేయగలను?" },
    { dutch: "Ik wil graag een afspraak maken met de huisarts.", english: "I would like to make an appointment with the GP.", telugu: "నేను కుటుంబ వైద్యుడితో అపాయింట్‌మెంట్ తీసుకోవాలనుకుంటున్నాను." },
    { dutch: "Natuurlijk. Wanneer kunt u langskomen?", english: "Of course. When can you come by?", telugu: "తప్పకుండా. మీరు ఎప్పుడు రావచ్చు?" },
    { dutch: "Dinsdagmiddag, als het kan.", english: "Tuesday afternoon, if possible.", telugu: "వీలైతే, మంగళవారం మధ్యాహ్నం." },
    { dutch: "Dinsdag om drie uur is nog vrij.", english: "Tuesday at three o'clock is still free.", telugu: "మంగళవారం మూడు గంటలకు ఇంకా ఖాళీగా ఉంది." },
    { dutch: "Dat is goed. Bedankt en tot dinsdag.", english: "That is good. Thank you and see you Tuesday.", telugu: "అది బాగుంది. ధన్యవాదాలు, మంగళవారం కలుద్దాం." },
  ],
  candidates: [
    { id: "ik-wil-graag", dutch: "ik wil graag", english: "I would like", telugu: "నేను కోరుకుంటున్నాను", kind: "chunk" },
    { id: "afspraak", dutch: "de afspraak", english: "the appointment", telugu: "అపాయింట్‌మెంట్", kind: "word" },
    { id: "afspraak-maken", dutch: "een afspraak maken", english: "to make an appointment", telugu: "అపాయింట్‌మెంట్ తీసుకోవడం", kind: "chunk" },
    { id: "als-het-kan", dutch: "als het kan", english: "if possible", telugu: "వీలైతే", kind: "chunk" },
  ],
  practice: [
    { candidateId: "ik-wil-graag", dimension: "recognition" }, { candidateId: "afspraak-maken", dimension: "recall" },
    { candidateId: "als-het-kan", dimension: "recognition" },
  ],
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
};

export const lessonCatalog: LessonCatalog = { version: LESSON_CATALOG_VERSION, lessons: [appointmentLesson] };

export function validateLessonCatalog(catalog: LessonCatalog): string[] {
  const errors: string[] = [];
  if (catalog.version !== LESSON_CATALOG_VERSION) errors.push("catalog.version: unsupported version");
  const ids = new Set<string>(); const pathwayOrders = new Set<string>();
  for (const lesson of catalog.lessons) {
    const field = (name: string, valid: boolean, message: string) => { if (!valid) errors.push(`${lesson.id}.${name}: ${message}`); };
    field("id", /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lesson.id) && !ids.has(lesson.id), "expected unique stable kebab-case identifier"); ids.add(lesson.id);
    const pathwayOrder = `${lesson.pathway}\u001f${lesson.order}`;
    field("pathway", lesson.pathway.length > 0 && !pathwayOrders.has(pathwayOrder), "expected pathway with unique order"); pathwayOrders.add(pathwayOrder); field("order", Number.isInteger(lesson.order) && lesson.order > 0, "expected positive order");
    field("cefr", lesson.cefr === "A0" || lesson.cefr === "A1" || lesson.cefr === "A2", "expected A0, A1, or A2 CEFR level"); field("title", lesson.title.startsWith(`${lesson.cefr} · `), "expected CEFR-prefixed title"); field("durationMinutes", lesson.durationMinutes >= 3 && lesson.durationMinutes <= 5, "expected 3 to 5 minutes");
    field("lines", lesson.lines.length >= 4 && lesson.lines.length <= 6, "expected 4 to 6 lines");
    const words = lesson.lines.flatMap((line) => line.dutch.trim().split(/\s+/)).length;
    field("lines", words >= 35 && words <= 60, "expected 35 to 60 Dutch words");
    field("lineHelp", lesson.lines.every((line) => line.dutch && line.english && line.telugu), "expected Dutch, English, and Telugu for every line");
    field("pattern", lesson.pattern.length > 0 && lesson.patternText.length > 0 && lesson.patternExplanation.length > 0 && lesson.lines.some((line) => line.dutch.includes(lesson.patternText)), "expected one story-grounded explained practical pattern");
    field("candidates", lesson.candidates.length >= 3 && lesson.candidates.length <= 5, "expected 3 to 5 candidates");
    field("candidates", new Set(lesson.candidates.map((candidate) => candidate.id)).size === lesson.candidates.length && lesson.candidates.every((candidate) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.id) && candidate.dutch && candidate.english && candidate.telugu && (candidate.kind === "word" || candidate.kind === "chunk")), "expected unique trilingual candidates");
    field("practice", lesson.practice.length > 0 && lesson.practice.every((prompt) => lesson.candidates.some((candidate) => candidate.id === prompt.candidateId) && (prompt.dimension === "recognition" || prompt.dimension === "recall")), "expected prompts for lesson candidates");
    field("review", Object.values(lesson.review).every(Boolean), "expected recorded Dutch, English, Telugu, CEFR, cultural, and practical-use review");
  }
  return errors;
}
