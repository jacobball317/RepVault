export const epley1RM = (w, reps) => Math.round(w * (1 + reps/30));
export const brzycki1RM = (w, reps) => Math.round(w * (36 / (37 - reps)));

// Simple RPE load adjustment (very rough): target @RPE 8 -> leave 2 reps in tank
export function suggestLoadFromRPE(lastWeight, lastReps, targetRPE = 8) {
  // naive rule: if lastRPE < target -> +2.5%; if > target -> -2.5%
  const delta = (targetRPE - 8) * 0.0125; // 1.25% per RPE diff around 8
  const base = lastWeight * (1 + delta);
  return Math.round(base / 2.5) * 2.5; // round to nearest 2.5
}