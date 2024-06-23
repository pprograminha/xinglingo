export const isRed = (score: number) => score >= 0 && score < 50
export const isYellow = (score: number) => score >= 50 && score < 95
export const isGreen = (score: number) => score >= 95

export const scoreColor = (score: number) => {
  if (isRed(score)) {
    return 'red'
  }
  if (isYellow(score)) {
    return 'yellow'
  }
  if (isGreen(score)) {
    return 'green'
  }

  return 'red'
}
export const scoreStyle =
  'data-[score-color=green]:text-green-400 dark:data-[score-color=green]:text-green-400 data-[score-color=red]:text-red-400 dark:data-[score-color=red]:text-red-400 data-[score-color=yellow]:text-yellow-400 dark:data-[score-color=yellow]:text-yellow-200'
