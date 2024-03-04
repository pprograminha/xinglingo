export const scoreColor = (score: number) => {
  if (score >= 1 && score < 50) {
    return 'red'
  }
  if (score >= 50 && score < 70) {
    return 'yellow'
  }
  if (score >= 70) {
    return 'green'
  }
  return 'red'
}
export const scoreStyle =
  'data-[score-color=green]:text-green-400 dark:data-[score-color=green]:text-green-400 data-[score-color=red]:text-red-400 dark:data-[score-color=red]:text-red-400 data-[score-color=yellow]:text-yellow-400 dark:data-[score-color=yellow]:text-yellow-200'
