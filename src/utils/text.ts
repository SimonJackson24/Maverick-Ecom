const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'were', 'will', 'with'
]);

export function removeStopWords(text: string): string {
  return text
    .split(/\s+/)
    .filter(word => !stopWords.has(word.toLowerCase()))
    .join(' ');
}

export function calculateFleschReadability(text: string): number {
  // Remove extra whitespace and split into sentences
  const sentences = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[.!?]+/)
    .filter(Boolean);

  // Split into words and count syllables
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);

  // Calculate Flesch Reading Ease score
  const averageWordsPerSentence = words.length / sentences.length;
  const averageSyllablesPerWord = syllables / words.length;
  
  const score = 206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord);
  
  // Normalize score to 0-100 range
  return Math.min(Math.max(score, 0), 100);
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  const syllableMatches = word.match(/[aeiouy]{1,2}/g);
  return syllableMatches ? syllableMatches.length : 1;
}

export function calculateTextStatistics(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const characters = text.replace(/\s/g, '').length;
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    characterCount: characters,
    syllableCount: syllables,
    averageWordLength: characters / words.length,
    averageWordsPerSentence: words.length / sentences.length,
    averageSyllablesPerWord: syllables / words.length,
  };
}

export function suggestKeywords(text: string): string[] {
  const words = removeStopWords(text.toLowerCase())
    .split(/\s+/)
    .filter(Boolean);

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency and get top 10
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

export function findKeywordDensity(text: string, keyword: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const keywordCount = words.filter(word => word === keyword.toLowerCase()).length;
  return (keywordCount / words.length) * 100;
}

export function analyzeHeadingStructure(headings: { h1: string[], h2: string[], h3: string[] }) {
  const issues: string[] = [];

  // Check H1
  if (headings.h1.length === 0) {
    issues.push('Missing H1 heading');
  } else if (headings.h1.length > 1) {
    issues.push('Multiple H1 headings found (recommended: only one H1)');
  }

  // Check H2
  if (headings.h2.length === 0) {
    issues.push('No H2 headings found');
  }

  // Check heading length
  [...headings.h1, ...headings.h2, ...headings.h3].forEach((heading, index) => {
    if (heading.length > 60) {
      issues.push(`Heading ${index + 1} is too long (${heading.length} characters)`);
    }
  });

  return issues;
}
