export function getPlatePlan(target, bar = 45, plates = [45, 35, 25, 10, 5, 2.5]) {
  let perSide = (target - bar) / 2;
  if (perSide < 0) return [];
  const plan = [];
  for (const p of plates) {
    const count = Math.floor(perSide / p);
    if (count > 0) { plan.push([p, count]); perSide -= p * count; }
  }
  return plan; // e.g., [[45,1],[10,1],[2.5,1]]
}
export function planToString(plan) {
  return plan.map(([p,c]) => `${c}×${p}`).join(" + ") || "—";
}