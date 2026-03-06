import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'studyData';

function getDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function checkDeadlinePassed(date = new Date()) {
  const deadline = new Date(date);
  deadline.setHours(21, 5, 0, 0);
  return date >= deadline;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 주어진 날짜 기준으로 해당 주 월~일 7일 반환 (월요일 시작)
function getWeekDates(referenceDate = new Date()) {
  const day = referenceDate.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push({ dateStr: getDateStr(d), dayOfWeek: d.getDay() });
  }
  return dates;
}

export function useStudyData() {
  const [data, setData] = useState(loadFromStorage);
  const [today, setToday] = useState(() => getDateStr());
  const [deadlinePassed, setDeadlinePassed] = useState(() => checkDeadlinePassed());

  const dataRef = useRef(data);
  dataRef.current = data;

  const applyAutoFail = useCallback((currentData, todayStr, isPastDeadline) => {
    if (!isPastDeadline) return currentData;
    const entry = currentData[todayStr];
    if (entry && entry.status === 'in_progress') {
      const updated = {
        ...currentData,
        [todayStr]: { ...entry, status: 'fail' },
      };
      saveToStorage(updated);
      return updated;
    }
    return currentData;
  }, []);

  // 앱 로드 시 즉시 체크 + 1분마다 반복 체크
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const newToday = getDateStr(now);
      const isPast = checkDeadlinePassed(now);

      setToday((prev) => (prev !== newToday ? newToday : prev));
      setDeadlinePassed(isPast);

      const latestData = dataRef.current;
      const updated = applyAutoFail(latestData, newToday, isPast);
      if (updated !== latestData) setData(updated);
    };

    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [applyAutoFail]);

  const save = useCallback((newData) => {
    setData(newData);
    saveToStorage(newData);
  }, []);

  const setGoals = useCallback(
    (goals) => {
      const entry = dataRef.current[today];
      if (entry) return;
      const updated = {
        ...dataRef.current,
        [today]: {
          selectedGoals: goals,
          checkedGoals: [],
          status: 'in_progress',
          completedAt: null,
        },
      };
      save(updated);
    },
    [today, save]
  );

  const toggleGoal = useCallback(
    (goal) => {
      const entry = dataRef.current[today];
      if (!entry || deadlinePassed || entry.status !== 'in_progress') return;
      const checked = entry.checkedGoals.includes(goal)
        ? entry.checkedGoals.filter((g) => g !== goal)
        : [...entry.checkedGoals, goal];
      const updated = {
        ...dataRef.current,
        [today]: { ...entry, checkedGoals: checked },
      };
      save(updated);
    },
    [today, deadlinePassed, save]
  );

  const completeDay = useCallback(() => {
    const entry = dataRef.current[today];
    if (!entry || deadlinePassed || entry.status !== 'in_progress') return;
    if (entry.checkedGoals.length !== entry.selectedGoals.length) return;
    const updated = {
      ...dataRef.current,
      [today]: {
        ...entry,
        status: 'success',
        completedAt: new Date().toISOString(),
      },
    };
    save(updated);
  }, [today, deadlinePassed, save]);

  // 오늘 데이터 초기화 → 목표 선택 화면부터 다시 시작
  const resetToday = useCallback(() => {
    const updated = { ...dataRef.current };
    delete updated[today];
    save(updated);
  }, [today, save]);

  // 과거 평일 날짜를 실패 처리 (이미 실패면 취소)
  const markDayFail = useCallback((dateStr) => {
    if (dateStr >= today) return;
    const current = dataRef.current;
    const entry = current[dateStr];
    if (entry && entry.status === 'fail') {
      const updated = { ...current };
      delete updated[dateStr];
      save(updated);
    } else {
      const updated = {
        ...current,
        [dateStr]: entry
          ? { ...entry, status: 'fail' }
          : { selectedGoals: [], checkedGoals: [], status: 'fail', completedAt: null },
      };
      save(updated);
    }
  }, [today, save]);

  // weekOffset: 0 = 이번 주, -1 = 지난 주, -2 = 2주 전 ...
  const getWeekStats = useCallback(
    (weekOffset = 0) => {
      const ref = new Date();
      ref.setDate(ref.getDate() + weekOffset * 7);

      const weekDates = getWeekDates(ref);
      const currentData = dataRef.current;

      const allDays = weekDates.map(({ dateStr, dayOfWeek }) => {
        const entry = currentData[dateStr];
        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
        return {
          dateStr,
          dayOfWeek,
          isWeekday,
          isSaturday: dayOfWeek === 6,
          isSunday: dayOfWeek === 0,
          status: entry ? entry.status : 'not_started',
          checkedCount: entry ? entry.checkedGoals.length : 0,
          totalCount: entry ? entry.selectedGoals.length : 0,
        };
      });

      const weekdays = allDays.filter((d) => d.isWeekday);
      const saturday = allDays.find((d) => d.isSaturday) || null;
      const sunday = allDays.find((d) => d.isSunday) || null;

      const failCount = weekdays.filter((d) => d.status === 'fail').length;
      const successCount = weekdays.filter((d) => d.status === 'success').length;

      return {
        allDays,
        weekdays,
        saturday,
        sunday,
        failCount,
        successCount,
        total: weekdays.length,
        saturdayGame: failCount >= 1 ? 'no_game' : 'game',
        sundayGame: failCount >= 2 ? 'no_game' : 'game',
      };
    },
    // data가 바뀔 때마다 getWeekStats도 최신 상태 반영
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  return {
    todayEntry: data[today] || null,
    today,
    deadlinePassed,
    getWeekStats,
    setGoals,
    toggleGoal,
    completeDay,
    resetToday,
    markDayFail,
  };
}
