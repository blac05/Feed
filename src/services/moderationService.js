const bannedWords = [
  "spam",
  "scam",
  "fake"
];

export const moderateText =
text => {

  return bannedWords.some(
    word =>
      text
        .toLowerCase()
        .includes(word)
  );
};
