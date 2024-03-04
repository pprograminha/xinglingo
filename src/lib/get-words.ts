export const getWords = (text: string) =>
  Array.from(
    new Set(text.split(' ').map((t) => t.replace(/[^a-zA-Z0-9']/g, ''))),
  ).filter((w) => w)
