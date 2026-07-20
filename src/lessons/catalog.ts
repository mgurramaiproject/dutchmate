export const LESSON_CATALOG_VERSION = 1;

export type LessonLine = { dutch: string; english: string; telugu: string };
export type LessonCandidate = { id: string; dutch: string; english: string; telugu: string; kind: "word" | "chunk" };
export type LessonPracticePrompt = { candidateId: string; dimension: "recognition" | "recall" };
export type Lesson = {
  id: string; contentVersion: number; pathway: string; order: number; cefr: "A0" | "A1" | "A2"; title: string; durationMinutes: number;
  pattern: string; patternText: string; patternExplanation: string; lines: LessonLine[];
  candidates: LessonCandidate[]; practice: LessonPracticePrompt[];
  review: { dutch: true; english: true; telugu: true; cefr: true; cultural: true; practicalUse: true };
};
export type LessonCatalog = { version: typeof LESSON_CATALOG_VERSION; lessons: Lesson[] };

export const introductionLesson: Lesson = {
  id: "a0-hallo-ik-ben", contentVersion: 1, pathway: "first-conversations", order: 1,
  cefr: "A0", title: "A0 · Hallo, ik ben…", durationMinutes: 3,
  pattern: "Ik ben…", patternText: "ik ben", patternExplanation: "Use ik ben… to say who you are. Add your name after the phrase.",
  lines: [
    { dutch: "Hallo, ik ben Ravi. Ik woon sinds kort in Utrecht.", english: "Hello, I am Ravi. I have lived in Utrecht for a short time.", telugu: "హలో, నేను రవి. నేను ఇటీవలే ఉట్రెహ్ట్‌లో నివసిస్తున్నాను." },
    { dutch: "Hallo Ravi, ik ben Noor. Leuk je te ontmoeten.", english: "Hello Ravi, I am Noor. Nice to meet you.", telugu: "హలో రవి, నేను నూర్. మిమ్మల్ని కలవడం ఆనందంగా ఉంది." },
    { dutch: "Leuk je te ontmoeten, Noor. Woon je hier ook?", english: "Nice to meet you, Noor. Do you live here too?", telugu: "మిమ్మల్ని కలవడం ఆనందంగా ఉంది, నూర్. మీరు కూడా ఇక్కడే నివసిస్తున్నారా?" },
    { dutch: "Ja, ik woon vlakbij. Welkom in de buurt!", english: "Yes, I live nearby. Welcome to the neighbourhood!", telugu: "అవును, నేను దగ్గరలోనే నివసిస్తున్నాను. ఈ పరిసరాలకు స్వాగతం!" },
  ],
  candidates: [
    { id: "ik-ben", dutch: "ik ben", english: "I am", telugu: "నేను", kind: "chunk" },
    { id: "leuk-je-te-ontmoeten", dutch: "leuk je te ontmoeten", english: "nice to meet you", telugu: "మిమ్మల్ని కలవడం ఆనందంగా ఉంది", kind: "chunk" },
    { id: "ik-woon", dutch: "ik woon", english: "I live", telugu: "నేను నివసిస్తున్నాను", kind: "chunk" },
    { id: "vlakbij", dutch: "vlakbij", english: "nearby", telugu: "దగ్గరలో", kind: "word" },
  ],
  practice: [
    { candidateId: "ik-ben", dimension: "recognition" }, { candidateId: "leuk-je-te-ontmoeten", dimension: "recall" },
    { candidateId: "ik-woon", dimension: "recognition" }, { candidateId: "vlakbij", dimension: "recall" },
  ],
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
};

export const repetitionLesson: Lesson = {
  id: "a1-kunt-u-dat-herhalen", contentVersion: 1, pathway: "first-conversations", order: 2,
  cefr: "A1", title: "A1 · Kunt u dat herhalen?", durationMinutes: 3,
  pattern: "Kunt u dat herhalen?", patternText: "Kunt u dat herhalen", patternExplanation: "Use Kunt u dat herhalen? as a polite way to ask someone to say something again.",
  lines: [
    { dutch: "Sorry, ik begrijp het niet helemaal.", english: "Sorry, I do not understand it completely.", telugu: "క్షమించండి, నాకు అది పూర్తిగా అర్థం కాలేదు." },
    { dutch: "Geen probleem. Kunt u dat herhalen, alstublieft?", english: "No problem. Could you repeat that, please?", telugu: "సమస్య లేదు. దయచేసి మీరు దాన్ని మళ్లీ చెప్పగలరా?" },
    { dutch: "Natuurlijk. De trein vertrekt van spoor vier.", english: "Of course. The train leaves from platform four.", telugu: "తప్పకుండా. రైలు నాలుగో ప్లాట్‌ఫారం నుంచి బయలుదేరుతుంది." },
    { dutch: "Dank u. Kunt u dat herhalen als ik het vergeet?", english: "Thank you. Could you repeat that if I forget it?", telugu: "ధన్యవాదాలు. నేను మర్చిపోతే మీరు దాన్ని మళ్లీ చెప్పగలరా?" },
    { dutch: "Ja hoor: spoor vier, aan de rechterkant.", english: "Certainly: platform four, on the right-hand side.", telugu: "అవును: నాలుగో ప్లాట్‌ఫారం, కుడి వైపున." },
  ],
  candidates: [
    { id: "kunt-u-dat-herhalen", dutch: "kunt u dat herhalen", english: "could you repeat that", telugu: "మీరు దాన్ని మళ్లీ చెప్పగలరా", kind: "chunk" },
    { id: "alstublieft", dutch: "alstublieft", english: "please", telugu: "దయచేసి", kind: "word" },
    { id: "ik-begrijp-het-niet", dutch: "ik begrijp het niet", english: "I do not understand it", telugu: "నాకు అది అర్థం కాదు", kind: "chunk" },
    { id: "geen-probleem", dutch: "geen probleem", english: "no problem", telugu: "సమస్య లేదు", kind: "chunk" },
  ],
  practice: [
    { candidateId: "kunt-u-dat-herhalen", dimension: "recognition" }, { candidateId: "alstublieft", dimension: "recall" },
    { candidateId: "ik-begrijp-het-niet", dimension: "recognition" }, { candidateId: "geen-probleem", dimension: "recall" },
  ],
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
};

export const cafeOrderLesson: Lesson = {
  id: "a1-ik-wil-graag-bestellen", contentVersion: 1, pathway: "shopping-and-cafes", order: 3,
  cefr: "A1", title: "A1 · Ik wil graag bestellen", durationMinutes: 4,
  pattern: "Ik wil graag…", patternText: "Ik wil graag", patternExplanation: "Use Ik wil graag… to order politely. Say what you want after the phrase.",
  lines: [
    { dutch: "In het café bekijk ik de kaart.", english: "In the cafe, I look at the menu.", telugu: "కేఫేలో నేను మెనూను చూస్తున్నాను." },
    { dutch: "Goedemiddag, wat wilt u drinken?", english: "Good afternoon, what would you like to drink?", telugu: "శుభ మధ్యాహ్నం, మీరు ఏమి తాగాలనుకుంటున్నారు?" },
    { dutch: "Ik wil graag een koffie met melk, alstublieft.", english: "I would like a coffee with milk, please.", telugu: "నాకు పాలతో ఒక కాఫీ కావాలి, దయచేసి." },
    { dutch: "Natuurlijk. Wilt u er ook iets bij?", english: "Of course. Would you like something with it too?", telugu: "తప్పకుండా. దానితో పాటు ఇంకేమైనా కావాలా?" },
    { dutch: "Ja, ik wil graag een broodje kaas.", english: "Yes, I would like a cheese roll.", telugu: "అవును, నాకు ఒక చీజ్ రోల్ కావాలి." },
    { dutch: "Dat komt zo. U kunt straks betalen.", english: "That will come shortly. You can pay in a moment.", telugu: "అది కాసేపట్లో వస్తుంది. మీరు కొద్దిసేపటికి చెల్లించవచ్చు." },
  ],
  candidates: [
    { id: "ik-wil-graag", dutch: "ik wil graag", english: "I would like", telugu: "నాకు కావాలి", kind: "chunk" },
    { id: "een-koffie-met-melk", dutch: "een koffie met melk", english: "a coffee with milk", telugu: "పాలతో ఒక కాఫీ", kind: "chunk" },
    { id: "iets-bij", dutch: "iets bij", english: "something with it", telugu: "దానితో పాటు ఇంకేదైనా", kind: "chunk" },
    { id: "graag", dutch: "graag", english: "please / gladly", telugu: "దయచేసి / ఇష్టంగా", kind: "word" },
  ],
  practice: [
    { candidateId: "ik-wil-graag", dimension: "recognition" }, { candidateId: "een-koffie-met-melk", dimension: "recall" },
    { candidateId: "iets-bij", dimension: "recognition" }, { candidateId: "graag", dimension: "recall" },
  ],
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
};

export const cardPaymentLesson: Lesson = {
  id: "a1-kan-ik-met-pin-betalen", contentVersion: 1, pathway: "shopping-and-cafes", order: 4,
  cefr: "A1", title: "A1 · Kan ik met pin betalen?", durationMinutes: 3,
  pattern: "Kan ik met pin betalen?", patternText: "met pin betalen", patternExplanation: "Use Kan ik met pin betalen? to ask whether you can pay by debit card.",
  lines: [
    { dutch: "Na het eten vraag ik om de rekening.", english: "After eating, I ask for the bill.", telugu: "తిన్న తర్వాత నేను బిల్లు అడుగుతాను." },
    { dutch: "Natuurlijk. Wilt u contant of met pin betalen?", english: "Of course. Would you like to pay with cash or by card?", telugu: "తప్పకుండా. మీరు నగదుతో లేదా కార్డుతో చెల్లించాలనుకుంటున్నారా?" },
    { dutch: "Kan ik met pin betalen? Ik heb geen contant geld.", english: "Can I pay by debit card? I do not have cash.", telugu: "నేను డెబిట్ కార్డుతో చెల్లించవచ్చా? నా దగ్గర నగదు లేదు." },
    { dutch: "Ja, u kunt met pin betalen. Houd uw pas hier even tegenaan.", english: "Yes, you can pay by debit card. Hold your card against the reader for a moment.", telugu: "అవును, మీరు డెబిట్ కార్డుతో చెల్లించవచ్చు. మీ కార్డును క్షణం ఇక్కడ తాకించండి." },
    { dutch: "Dank u. De betaling is gelukt.", english: "Thank you. The payment worked.", telugu: "ధన్యవాదాలు. చెల్లింపు విజయవంతమైంది." },
  ],
  candidates: [
    { id: "met-pin-betalen", dutch: "met pin betalen", english: "to pay by debit card", telugu: "డెబిట్ కార్డుతో చెల్లించడం", kind: "chunk" },
    { id: "contant-geld", dutch: "contant geld", english: "cash", telugu: "నగదు", kind: "chunk" },
    { id: "de-rekening", dutch: "de rekening", english: "the bill", telugu: "బిల్లు", kind: "word" },
    { id: "is-gelukt", dutch: "is gelukt", english: "worked", telugu: "విజయవంతమైంది", kind: "chunk" },
  ],
  practice: [
    { candidateId: "met-pin-betalen", dimension: "recognition" }, { candidateId: "contant-geld", dimension: "recall" },
    { candidateId: "de-rekening", dimension: "recognition" }, { candidateId: "is-gelukt", dimension: "recall" },
  ],
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
};

export const appointmentLesson: Lesson = {
  id: "a1-een-afspraak-maken", contentVersion: 1, pathway: "appointments-and-healthcare", order: 7,
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

export const lessonCatalog: LessonCatalog = {
  version: LESSON_CATALOG_VERSION,
  lessons: [introductionLesson, repetitionLesson, cafeOrderLesson, cardPaymentLesson, appointmentLesson],
};

export function validateLessonCatalog(catalog: LessonCatalog): string[] {
  const errors: string[] = [];
  if (catalog.version !== LESSON_CATALOG_VERSION) errors.push("catalog.version: unsupported version");
  const ids = new Set<string>(); const pathwayOrders = new Set<string>();
  for (const lesson of catalog.lessons) {
    const field = (name: string, valid: boolean, message: string) => { if (!valid) errors.push(`${lesson.id}.${name}: ${message}`); };
    field("id", /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lesson.id) && !ids.has(lesson.id), "expected unique stable kebab-case identifier"); ids.add(lesson.id);
    field("contentVersion", Number.isInteger(lesson.contentVersion) && lesson.contentVersion > 0, "expected positive content version");
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
