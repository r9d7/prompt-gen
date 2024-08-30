export function testStartsWithVowel([firstLetter]: string) {
  return ["a", "e", "i", "o", "u"].indexOf(firstLetter.toLowerCase()) !== -1;
}

export function getIndefiniteArticle(value?: string) {
  if (!value?.length) {
    return null;
  }

  const startsWithVowel = testStartsWithVowel(value);

  return startsWithVowel ? "an" : "a";
}

export function getDisplaySentence(prompt: string, value?: string) {
  if (!value?.length) {
    return prompt;
  }

  const article = getIndefiniteArticle(value);

  return [prompt, article, value].join(" ");
}
