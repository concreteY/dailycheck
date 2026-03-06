import { useState } from 'react';
import Clock from './components/Clock';
import GoalSelector from './components/GoalSelector';
import CheckList from './components/CheckList';
import WeeklyResult from './components/WeeklyResult';
import WeekendBanner from './components/WeekendBanner';
import Settings from './components/Settings';
import { useStudyData } from './hooks/useStudyData';
import { useGoalSettings } from './hooks/useGoalSettings';

export default function App() {
  const { todayEntry, today, deadlinePassed, getWeekStats, setGoals, toggleGoal, completeDay, resetToday, markDayFail } = useStudyData();
  const { goals, saveGoals } = useGoalSettings();
  const [showSettings, setShowSettings] = useState(false);

  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const currentWeekStats = getWeekStats(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-yellow-50 px-4 py-6">
      <div className="max-w-md mx-auto flex flex-col gap-5">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="w-10" /> {/* 좌측 여백 (버튼과 균형) */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow">
              공부 체커
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">매일 꾸준히!</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-white/70 text-xl hover:bg-white hover:shadow active:scale-95 transition-all flex items-center justify-center"
            title="설정"
          >
            ⚙️
          </button>
        </div>

        <Clock />

        {isWeekend ? (
          <>
            <WeekendBanner weekStats={currentWeekStats} />
            <WeeklyResult getWeekStats={getWeekStats} today={today} onMarkFail={markDayFail} />
          </>
        ) : (
          <>
            {!todayEntry ? (
              <GoalSelector goals={goals} onConfirm={setGoals} />
            ) : (
              <CheckList
                entry={todayEntry}
                deadlinePassed={deadlinePassed}
                onToggle={toggleGoal}
                onComplete={completeDay}
                onReset={resetToday}
              />
            )}
            <WeeklyResult getWeekStats={getWeekStats} today={today} onMarkFail={markDayFail} />
          </>
        )}
      </div>

      {/* 설정 모달 */}
      {showSettings && (
        <Settings
          goals={goals}
          onSave={(newGoals) => saveGoals(newGoals)}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
