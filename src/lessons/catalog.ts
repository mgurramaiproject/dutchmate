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

export const transferLesson: Lesson = {
  id: "a1-waar-moet-ik-overstappen", contentVersion: 1, pathway: "transport", order: 5,
  cefr: "A1", title: "A1 · Waar moet ik overstappen?", durationMinutes: 3,
  pattern: "Waar moet ik overstappen?", patternText: "moet ik overstappen", patternExplanation: "Use moet ik overstappen to ask where you need to change trains.",
  lines: [
    { dutch: "Op station Utrecht Centraal kijk ik naar het bord.", english: "At Utrecht Central station, I look at the board.", telugu: "ఉట్రెహ్ట్ సెంట్రల్ స్టేషన్‌లో నేను బోర్డును చూస్తున్నాను." },
    { dutch: "Excuseer, waar moet ik overstappen voor de trein naar Rotterdam?", english: "Excuse me, where do I need to change for the train to Rotterdam?", telugu: "క్షమించండి, రోటర్‌డామ్‌కు వెళ్లే రైలు కోసం నేను ఎక్కడ మారాలి?" },
    { dutch: "U moet op spoor acht overstappen.", english: "You need to change at platform eight.", telugu: "మీరు ఎనిమిదో ప్లాట్‌ఫారమ్‌లో మారాలి." },
    { dutch: "Moet ik overstappen als ik daar aankom?", english: "Do I need to change when I get there?", telugu: "నేను అక్కడికి చేరుకున్నప్పుడు మారాలా?" },
    { dutch: "Nee, de aansluiting vertrekt over vijf minuten.", english: "No, the connecting train leaves in five minutes.", telugu: "లేదు, కనెక్షన్ రైలు ఐదు నిమిషాల్లో బయలుదేరుతుంది." },
    { dutch: "Dank u, dan loop ik snel naar spoor acht.", english: "Thank you, then I will walk quickly to platform eight.", telugu: "ధన్యవాదాలు, నేను త్వరగా ఎనిమిదో ప్లాట్‌ఫారమ్‌కు వెళ్తాను." },
  ],
  candidates: [
    { id: "waar-moet-ik-overstappen", dutch: "waar moet ik overstappen", english: "where do I need to change", telugu: "నేను ఎక్కడ మారాలి", kind: "chunk" },
    { id: "overstappen", dutch: "overstappen", english: "to change trains", telugu: "రైలు మారడం", kind: "word" },
    { id: "spoor-acht", dutch: "spoor acht", english: "platform eight", telugu: "ఎనిమిదో ప్లాట్‌ఫారమ్", kind: "chunk" },
    { id: "de-aansluiting", dutch: "de aansluiting", english: "the connection", telugu: "కనెక్షన్", kind: "chunk" },
  ],
  practice: [
    { candidateId: "waar-moet-ik-overstappen", dimension: "recognition" }, { candidateId: "overstappen", dimension: "recall" },
    { candidateId: "spoor-acht", dimension: "recognition" }, { candidateId: "de-aansluiting", dimension: "recall" },
  ],
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
};

export const delayedTrainLesson: Lesson = {
  id: "a1-mijn-trein-is-vertraagd", contentVersion: 1, pathway: "transport", order: 6,
  cefr: "A1", title: "A1 · Mijn trein is vertraagd", durationMinutes: 3,
  pattern: "Mijn trein is vertraagd.", patternText: "trein is vertraagd", patternExplanation: "Use mijn trein is vertraagd to explain that your train is late.",
  lines: [
    { dutch: "Op het perron wacht ik op de trein naar Amsterdam.", english: "On the platform, I am waiting for the train to Amsterdam.", telugu: "ప్లాట్‌ఫారమ్‌పై నేను ఆమ్స్టర్డామ్‌కు వెళ్లే రైలు కోసం ఎదురు చూస్తున్నాను." },
    { dutch: "Op het scherm staat dat mijn trein is vertraagd.", english: "The screen says that my train is delayed.", telugu: "నా రైలు ఆలస్యం అయిందని తెరపై ఉంది." },
    { dutch: "De trein is vertraagd door een storing op het spoor.", english: "The train is delayed because of a disruption on the track.", telugu: "పట్టాలపై అంతరాయం వల్ల రైలు ఆలస్యం అయింది." },
    { dutch: "Hoe laat vertrekt hij nu?", english: "What time does it leave now?", telugu: "ఇప్పుడు అది ఎప్పుడు బయలుదేరుతుంది?" },
    { dutch: "Hij vertrekt twintig minuten later van spoor drie.", english: "It leaves twenty minutes later from platform three.", telugu: "అది ఇరవై నిమిషాల తర్వాత మూడో ప్లాట్‌ఫారమ్ నుంచి బయలుదేరుతుంది." },
    { dutch: "Bedankt, dan stuur ik mijn collega een bericht.", english: "Thank you, then I will send my colleague a message.", telugu: "ధన్యవాదాలు, నేను నా సహోద్యోగికి సందేశం పంపుతాను." },
  ],
  candidates: [
    { id: "mijn-trein-is-vertraagd", dutch: "mijn trein is vertraagd", english: "my train is delayed", telugu: "నా రైలు ఆలస్యం అయింది", kind: "chunk" },
    { id: "een-storing", dutch: "een storing", english: "a disruption", telugu: "అంతరాయం", kind: "chunk" },
    { id: "twintig-minuten-later", dutch: "twintig minuten later", english: "twenty minutes later", telugu: "ఇరవై నిమిషాల తర్వాత", kind: "chunk" },
    { id: "een-bericht", dutch: "een bericht", english: "a message", telugu: "సందేశం", kind: "chunk" },
  ],
  practice: [
    { candidateId: "mijn-trein-is-vertraagd", dimension: "recognition" }, { candidateId: "een-storing", dimension: "recall" },
    { candidateId: "twintig-minuten-later", dimension: "recognition" }, { candidateId: "een-bericht", dimension: "recall" },
  ],
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
};

export const appointmentLesson: Lesson = {
  id: "a1-een-afspraak-maken", contentVersion: 2, pathway: "appointments-and-healthcare", order: 7,
  cefr: "A1", title: "A1 · Een afspraak maken", durationMinutes: 4,
  pattern: "Ik wil graag…", patternText: "Ik wil graag", patternExplanation: "Use Ik wil graag… to make a polite request. The verb stays in its normal position after ik.",
  lines: [
    { dutch: "Receptionist: Goedemorgen. Waarmee kan ik u helpen?", english: "Receptionist: Good morning. How can I help you?", telugu: "రిసెప్షనిస్ట్: శుభోదయం. నేను మీకు ఎలా సహాయం చేయగలను?" },
    { dutch: "Ik wil graag een afspraak maken met de huisarts.", english: "I would like to make an appointment with the GP.", telugu: "నేను కుటుంబ వైద్యుడితో అపాయింట్‌మెంట్ తీసుకోవాలనుకుంటున్నాను." },
    { dutch: "Natuurlijk. Wanneer kunt u langskomen?", english: "Of course. When can you come by?", telugu: "తప్పకుండా. మీరు ఎప్పుడు రావచ్చు?" },
    { dutch: "Ik wil graag dinsdagmiddag, als het kan.", english: "I would like Tuesday afternoon, if possible.", telugu: "వీలైతే, నాకు మంగళవారం మధ్యాహ్నం కావాలి." },
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

export const symptomsLesson: Lesson = {
  id: "a1-ik-heb-last-van", contentVersion: 1, pathway: "appointments-and-healthcare", order: 8,
  cefr: "A1", title: "A1 · Ik heb last van…", durationMinutes: 3,
  pattern: "Ik heb last van…", patternText: "Ik heb last van", patternExplanation: "Use ik heb last van… to describe a symptom when arranging care, without needing to explain its cause.",
  lines: [
    { dutch: "Goedemiddag, ik wil graag een afspraak maken bij de huisarts.", english: "Good afternoon, I would like to make an appointment with the GP.", telugu: "శుభ మధ్యాహ్నం, నేను కుటుంబ వైద్యుడితో అపాయింట్‌మెంట్ తీసుకోవాలనుకుంటున్నాను." },
    { dutch: "Wat is er aan de hand?", english: "What is the matter?", telugu: "ఏమైంది?" },
    { dutch: "Ik heb last van mijn keel en ik voel mij niet goed.", english: "I have trouble with my throat and I do not feel well.", telugu: "నాకు గొంతు నొప్పిగా ఉంది మరియు నాకు బాగా అనిపించడం లేదు." },
    { dutch: "Ik heb last van hoofdpijn sinds gisteren.", english: "I have had a headache since yesterday.", telugu: "నిన్నటి నుంచి నాకు తలనొప్పి ఉంది." },
    { dutch: "De huisarts kan u morgen bellen.", english: "The GP can call you tomorrow.", telugu: "కుటుంబ వైద్యుడు రేపు మీకు ఫోన్ చేయవచ్చు." },
    { dutch: "Dank u, dat is fijn.", english: "Thank you, that is good.", telugu: "ధన్యవాదాలు, అది బాగుంది." },
  ],
  candidates: [
    { id: "ik-heb-last-van", dutch: "ik heb last van", english: "I have trouble with", telugu: "నాకు ఇబ్బంది ఉంది", kind: "chunk" },
    { id: "mijn-keel", dutch: "mijn keel", english: "my throat", telugu: "నా గొంతు", kind: "chunk" },
    { id: "hoofdpijn", dutch: "hoofdpijn", english: "headache", telugu: "తలనొప్పి", kind: "word" },
    { id: "de-huisarts", dutch: "de huisarts", english: "the GP", telugu: "కుటుంబ వైద్యుడు", kind: "chunk" },
  ],
  practice: [
    { candidateId: "ik-heb-last-van", dimension: "recognition" }, { candidateId: "mijn-keel", dimension: "recall" },
    { candidateId: "hoofdpijn", dimension: "recognition" }, { candidateId: "de-huisarts", dimension: "recall" },
  ],
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
};

const reviewed = { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true } as const;
export const brokenThingLesson: Lesson = { id: "a1-er-is-iets-kapot", contentVersion: 1, pathway: "home", order: 9, cefr: "A1", title: "A1 · Er is iets kapot", durationMinutes: 3, pattern: "Er is iets kapot.", patternText: "Er is iets kapot", patternExplanation: "Use er is iets kapot to report that something is broken.", lines: [
  { dutch: "In mijn keuken doet de kraan het niet meer.", english: "In my kitchen, the tap no longer works.", telugu: "నా వంటగదిలో కుళాయి ఇక పనిచేయడం లేదు." }, { dutch: "Er is iets kapot in de keuken.", english: "Something is broken in the kitchen.", telugu: "వంటగదిలో ఏదో పాడైంది." }, { dutch: "De verhuurder vraagt wat er precies kapot is.", english: "The landlord asks what exactly is broken.", telugu: "ఏమి పాడైందో యజమాని అడుగుతారు." }, { dutch: "Er is iets kapot aan de kraan, hij lekt.", english: "Something is broken with the tap; it leaks.", telugu: "కుళాయికి ఏదో పాడైంది; అది కారుతోంది." }, { dutch: "Morgen komt iemand kijken en het repareren.", english: "Someone will come tomorrow to look at it and repair it.", telugu: "రేపు ఎవరో వచ్చి చూసి మరమ్మతు చేస్తారు." },
], candidates: [{ id: "er-is-iets-kapot", dutch: "er is iets kapot", english: "something is broken", telugu: "ఏదో పాడైంది", kind: "chunk" }, { id: "de-kraan", dutch: "de kraan", english: "the tap", telugu: "కుళాయి", kind: "word" }, { id: "het-lekt", dutch: "het lekt", english: "it leaks", telugu: "అది కారుతోంది", kind: "chunk" }, { id: "repareren", dutch: "repareren", english: "to repair", telugu: "మరమ్మతు చేయడం", kind: "word" }], practice: [{ candidateId: "er-is-iets-kapot", dimension: "recognition" }, { candidateId: "de-kraan", dimension: "recall" }, { candidateId: "het-lekt", dimension: "recognition" }, { candidateId: "repareren", dimension: "recall" }], review: reviewed };
export const availabilityLesson: Lesson = { id: "a1-ik-ben-beschikbaar-op", contentVersion: 1, pathway: "work-and-study", order: 10, cefr: "A1", title: "A1 · Ik ben beschikbaar op…", durationMinutes: 3, pattern: "Ik ben beschikbaar op…", patternText: "Ik ben beschikbaar", patternExplanation: "Use ik ben beschikbaar to say when you are free.", lines: [
  { dutch: "Mijn collega vraagt wanneer ik kan werken.", english: "My colleague asks when I can work.", telugu: "నేను ఎప్పుడు పని చేయగలనో నా సహోద్యోగి అడుగుతారు." }, { dutch: "Ik ben beschikbaar op maandag en woensdag.", english: "I am available on Monday and Wednesday.", telugu: "నేను సోమవారం మరియు బుధవారం అందుబాటులో ఉన్నాను." }, { dutch: "Ben je ook in de middag beschikbaar?", english: "Are you also available in the afternoon?", telugu: "మీరు మధ్యాహ్నం కూడా అందుబాటులో ఉన్నారా?" }, { dutch: "Ja, ik ben beschikbaar vanaf twee uur.", english: "Yes, I am available from two o'clock.", telugu: "అవును, నేను రెండు గంటల నుంచి అందుబాటులో ఉన్నాను." }, { dutch: "Prima, dan zetten we je op het rooster.", english: "Great, then we will put you on the schedule.", telugu: "బాగుంది, అప్పుడు మిమ్మల్ని షెడ్యూల్‌లో పెడతాము." },
], candidates: [{ id: "ik-ben-beschikbaar", dutch: "ik ben beschikbaar", english: "I am available", telugu: "నేను అందుబాటులో ఉన్నాను", kind: "chunk" }, { id: "vanaf-twee-uur", dutch: "vanaf twee uur", english: "from two o'clock", telugu: "రెండు గంటల నుంచి", kind: "chunk" }, { id: "de-middag", dutch: "de middag", english: "the afternoon", telugu: "మధ్యాహ్నం", kind: "word" }, { id: "het-rooster", dutch: "het rooster", english: "the schedule", telugu: "షెడ్యూల్", kind: "word" }], practice: [{ candidateId: "ik-ben-beschikbaar", dimension: "recognition" }, { candidateId: "vanaf-twee-uur", dimension: "recall" }, { candidateId: "de-middag", dimension: "recognition" }, { candidateId: "het-rooster", dimension: "recall" }], review: reviewed };
export const bringLesson: Lesson = { id: "a1-wat-moet-ik-meenemen", contentVersion: 1, pathway: "work-and-study", order: 11, cefr: "A1", title: "A1 · Wat moet ik meenemen?", durationMinutes: 3, pattern: "Wat moet ik meenemen?", patternText: "meenemen", patternExplanation: "Use meenemen in wat moet ik meenemen to ask what you need to bring.", lines: [
  { dutch: "Morgen begin ik met een cursus Nederlands.", english: "Tomorrow I start a Dutch course.", telugu: "రేపు నేను డచ్ కోర్సు ప్రారంభిస్తాను." }, { dutch: "Wat moet ik meenemen naar de les?", english: "What do I need to bring to class?", telugu: "తరగతికి నేను ఏమి తీసుకురావాలి?" }, { dutch: "Je moet een pen en je identiteitsbewijs meenemen.", english: "You need to bring a pen and your identity document.", telugu: "మీరు ఒక పెన్ మరియు గుర్తింపు పత్రం తీసుకురావాలి." }, { dutch: "Moet ik ook mijn laptop meenemen?", english: "Do I also need to bring my laptop?", telugu: "నేను నా ల్యాప్‌టాప్ కూడా తీసుకురావాలా?" }, { dutch: "Nee, een schrift is genoeg voor de eerste les.", english: "No, a notebook is enough for the first lesson.", telugu: "లేదు, మొదటి తరగతికి ఒక నోట్‌బుక్ చాలు." },
], candidates: [{ id: "wat-moet-ik-meenemen", dutch: "wat moet ik meenemen", english: "what do I need to bring", telugu: "నేను ఏమి తీసుకురావాలి", kind: "chunk" }, { id: "een-pen", dutch: "een pen", english: "a pen", telugu: "ఒక పెన్", kind: "chunk" }, { id: "mijn-identiteitsbewijs", dutch: "mijn identiteitsbewijs", english: "my identity document", telugu: "నా గుర్తింపు పత్రం", kind: "chunk" }, { id: "een-schrift", dutch: "een schrift", english: "a notebook", telugu: "ఒక నోట్‌బుక్", kind: "chunk" }], practice: [{ candidateId: "wat-moet-ik-meenemen", dimension: "recognition" }, { candidateId: "een-pen", dimension: "recall" }, { candidateId: "mijn-identiteitsbewijs", dimension: "recognition" }, { candidateId: "een-schrift", dimension: "recall" }], review: reviewed };
export const letterLesson: Lesson = { id: "a2-wat-staat-er-in-deze-brief", contentVersion: 1, pathway: "official-life", order: 12, cefr: "A2", title: "A2 · Wat staat er in deze brief?", durationMinutes: 4, pattern: "Wat staat er in deze brief?", patternText: "in deze brief", patternExplanation: "Use wat staat er in deze brief to ask for help understanding a letter.", lines: [
  { dutch: "Ik krijg een brief van de gemeente en begrijp hem niet goed.", english: "I receive a letter from the municipality and do not understand it well.", telugu: "నాకు మున్సిపాలిటీ నుంచి ఒక లేఖ వచ్చింది, అది నాకు బాగా అర్థం కావడం లేదు." }, { dutch: "Weet je wat er in deze brief staat?", english: "Do you know what this letter says?", telugu: "ఈ లేఖలో ఏమి ఉందో మీకు తెలుసా?" }, { dutch: "Er staat dat je een afspraak kunt maken.", english: "It says that you can make an appointment.", telugu: "మీరు అపాయింట్‌మెంట్ తీసుకోవచ్చని అందులో ఉంది." }, { dutch: "Staat er in deze brief ook een datum?", english: "Does this letter also state a date?", telugu: "ఈ లేఖలో తేదీ కూడా ఉందా?" }, { dutch: "Ja, maar vraag hulp als iets niet duidelijk is.", english: "Yes, but ask for help if something is unclear.", telugu: "అవును, కానీ ఏదైనా స్పష్టంగా లేకపోతే సహాయం అడగండి." },
], candidates: [{ id: "wat-staat-er-in-deze-brief", dutch: "wat staat er in deze brief", english: "what does this letter say", telugu: "ఈ లేఖలో ఏమి ఉంది", kind: "chunk" }, { id: "de-gemeente", dutch: "de gemeente", english: "the municipality", telugu: "మున్సిపాలిటీ", kind: "word" }, { id: "niet-duidelijk", dutch: "niet duidelijk", english: "not clear", telugu: "స్పష్టంగా లేదు", kind: "chunk" }, { id: "hulp-vragen", dutch: "hulp vragen", english: "to ask for help", telugu: "సహాయం అడగడం", kind: "chunk" }], practice: [{ candidateId: "wat-staat-er-in-deze-brief", dimension: "recognition" }, { candidateId: "de-gemeente", dimension: "recall" }, { candidateId: "niet-duidelijk", dimension: "recognition" }, { candidateId: "hulp-vragen", dimension: "recall" }], review: reviewed };

export const lessonCatalog: LessonCatalog = {
  version: LESSON_CATALOG_VERSION,
  lessons: [introductionLesson, repetitionLesson, cafeOrderLesson, cardPaymentLesson, transferLesson, delayedTrainLesson, appointmentLesson, symptomsLesson, brokenThingLesson, availabilityLesson, bringLesson, letterLesson],
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
