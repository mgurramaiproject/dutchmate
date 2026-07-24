const independentVowels: Record<string, string> = {
  "అ": "a", "ఆ": "aa", "ఇ": "i", "ఈ": "ee", "ఉ": "u", "ఊ": "oo", "ఋ": "ru",
  "ఎ": "e", "ఏ": "ay", "ఐ": "ai", "ఒ": "o", "ఓ": "oh", "ఔ": "au",
};

const consonants: Record<string, string> = {
  "క": "k", "ఖ": "kh", "గ": "g", "ఘ": "gh", "ఙ": "ng", "చ": "ch", "ఛ": "chh", "జ": "j", "ఝ": "jh", "ఞ": "ny",
  "ట": "t", "ఠ": "th", "డ": "d", "ఢ": "dh", "ణ": "n", "త": "t", "థ": "th", "ద": "d", "ధ": "dh", "న": "n",
  "ప": "p", "ఫ": "f", "బ": "b", "భ": "bh", "మ": "m", "య": "y", "ర": "r", "ల": "l", "వ": "v",
  "శ": "sh", "ష": "sh", "స": "s", "హ": "h", "ళ": "l", "ఱ": "r",
};

const vowelSigns: Record<string, string> = {
  "ా": "aa", "ి": "i", "ీ": "ee", "ు": "u", "ూ": "oo", "ృ": "ru", "ె": "e", "ే": "ay", "ై": "ai", "ొ": "o", "ో": "o", "ౌ": "au",
};

const marks: Record<string, string> = { "ం": "m", "ః": "h", "ఁ": "m" };

/** Simple learner-facing transliteration; this is intentionally not IAST or IPA. */
export function getSimpleTeluguPhonetics(value: string | null | undefined): string | null {
  const text = value?.trim();
  if (!text || !/[\u0c00-\u0c7f]/u.test(text)) return null;
  return text.split(/\s+/u).map(transliterateWord).join(" ") || null;
}

function transliterateWord(word: string): string {
  const syllables: string[] = [];
  const characters = [...word];
  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index];
    if (consonants[character]) {
      const next = characters[index + 1];
      if (next === "్") {
        if (syllables.length > 0) syllables[syllables.length - 1] += consonants[character];
        else syllables.push(consonants[character]);
        index += 1;
      } else if (next && vowelSigns[next]) {
        syllables.push(consonants[character] + vowelSigns[next]);
        index += 1;
      } else {
        syllables.push(consonants[character] + "a");
      }
      continue;
    }
    if (independentVowels[character]) {
      syllables.push(independentVowels[character]);
      continue;
    }
    if (marks[character] && syllables.length > 0) {
      syllables[syllables.length - 1] += marks[character];
      continue;
    }
    if (character === "్" || vowelSigns[character]) continue;
    if (syllables.length > 0 && /[^\u0c00-\u0c7f]/u.test(character)) syllables[syllables.length - 1] += character;
  }
  return syllables.join("-");
}
