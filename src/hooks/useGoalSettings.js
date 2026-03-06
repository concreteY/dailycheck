import { useState, useCallback } from 'react';

const SETTINGS_KEY = 'goalSettings';

export const DEFAULT_GOALS = [
  { id: 'goal_0', label: '쎈수학 2페이지 풀기', emoji: '📐' },
  { id: 'goal_1', label: '기탄수학 3장',         emoji: '✏️' },
  { id: 'goal_2', label: '국어',                  emoji: '📚' },
  { id: 'goal_3', label: '일기',                  emoji: '📓' },
  { id: 'goal_4', label: '독서록',                emoji: '📖' },
];

function loadGoals() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_GOALS;
    const parsed = JSON.parse(raw);
    // 저장된 항목 수가 맞지 않으면 기본값 사용
    if (!Array.isArray(parsed) || parsed.length !== DEFAULT_GOALS.length) return DEFAULT_GOALS;
    return parsed;
  } catch {
    return DEFAULT_GOALS;
  }
}

export function useGoalSettings() {
  const [goals, setGoals] = useState(loadGoals);

  const saveGoals = useCallback((newGoals) => {
    const sanitized = newGoals.map((g, i) => ({
      id: DEFAULT_GOALS[i].id,
      label: g.label.trim() || DEFAULT_GOALS[i].label,
      emoji: DEFAULT_GOALS[i].emoji,
    }));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitized));
    setGoals(sanitized);
  }, []);

  const resetGoals = useCallback(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_GOALS));
    setGoals(DEFAULT_GOALS);
  }, []);

  return { goals, saveGoals, resetGoals };
}
