import { useState } from 'react';

const DAY_NAME = { 0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토' };

function formatDate(dateStr) {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

function getWeekRangeLabel(allDays) {
  if (!allDays.length) return '';
  return `${formatDate(allDays[0].dateStr)} ~ ${formatDate(allDays[allDays.length - 1].dateStr)}`;
}

function statusIcon(status) {
  switch (status) {
    case 'success':     return '✅';
    case 'fail':        return '❌';
    case 'in_progress': return '⏳';
    default:            return '⬜';
  }
}

function statusColor(status) {
  switch (status) {
    case 'success':     return 'border-green-300 bg-green-50';
    case 'fail':        return 'border-red-200 bg-red-50';
    case 'in_progress': return 'border-blue-300 bg-blue-50';
    default:            return 'border-gray-200 bg-white';
  }
}

function statusTextColor(status) {
  switch (status) {
    case 'success':     return 'text-green-600';
    case 'fail':        return 'text-red-500';
    case 'in_progress': return 'text-blue-600';
    default:            return 'text-gray-400';
  }
}

function WeekdayCard({ day, isToday, isPast, onMarkFail }) {
  const { dateStr, dayOfWeek, status, checkedCount, totalCount } = day;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all
        ${statusColor(status)}
        ${isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
    >
      {/* 요일 + 날짜 */}
      <div className="w-14 flex-shrink-0">
        <span
          className={`text-base font-bold ${isToday ? 'text-blue-700' : 'text-gray-600'}`}
        >
          {DAY_NAME[dayOfWeek]}
        </span>
        <span className={`ml-1.5 text-sm ${isToday ? 'text-blue-500' : 'text-gray-400'}`}>
          {formatDate(dateStr)}
        </span>
        {isToday && (
          <span className="ml-1 text-xs text-blue-400 font-medium">오늘</span>
        )}
      </div>

      {/* 상태 아이콘 */}
      <span className="text-xl flex-shrink-0">{statusIcon(status)}</span>

      {/* 목표 달성 수 */}
      <div className="flex-1 text-right">
        {totalCount > 0 ? (
          <span className={`text-sm font-bold ${statusTextColor(status)}`}>
            {checkedCount}/{totalCount} 달성
          </span>
        ) : (
          <span className="text-xs text-gray-400">목표 미설정</span>
        )}
      </div>

      {/* 과거 날짜 실패 처리 버튼 */}
      {isPast && (
        <button
          onClick={() => onMarkFail(dateStr)}
          className={`w-3 h-3 rounded-full flex-shrink-0 transition-all
            ${status === 'fail'
              ? 'bg-red-400 hover:bg-red-300'
              : 'bg-gray-200 hover:bg-red-200'
            }`}
          title={status === 'fail' ? '실패 취소' : '실패 처리'}
        />
      )}
    </div>
  );
}

function WeekendCard({ day, gameStatus, isToday }) {
  const { dateStr, dayOfWeek } = day;
  const hasGame = gameStatus === 'game';

  return (
    <div
      className={`flex-1 rounded-2xl p-4 text-center border-2 transition-all
        ${hasGame ? 'border-yellow-300 bg-yellow-50' : 'border-red-200 bg-red-50'}
        ${isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
    >
      <div className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
        {DAY_NAME[dayOfWeek]}&nbsp;{formatDate(dateStr)}
        {isToday && <span className="ml-1 text-xs text-blue-400">오늘</span>}
      </div>
      <div className="text-2xl my-1">{hasGame ? '🎮' : '❌'}</div>
      <div className={`text-xs font-bold ${hasGame ? 'text-yellow-700' : 'text-red-500'}`}>
        {hasGame ? '게임 2시간' : '게임 불가'}
      </div>
    </div>
  );
}

export default function WeeklyResult({ getWeekStats, today, onMarkFail }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const stats = getWeekStats(weekOffset);
  const { allDays, weekdays, saturday, sunday, successCount, total, failCount, saturdayGame, sundayGame } = stats;

  const isCurrentWeek = weekOffset === 0;

  const weekLabel =
    isCurrentWeek ? '이번 주'
    : weekOffset === -1 ? '지난 주'
    : `${Math.abs(weekOffset)}주 전`;

  const successEmoji =
    successCount === total ? '🎉'
    : successCount >= Math.ceil(total / 2) ? '💪'
    : '🌱';

  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 mx-auto max-w-md">
      {/* 주 탐색 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-lg hover:bg-blue-200 active:scale-95 transition-all flex items-center justify-center"
        >
          ‹
        </button>

        <div className="text-center leading-tight">
          <div className="text-xs text-gray-400">{getWeekRangeLabel(allDays)}</div>
          <div className="text-sm font-bold text-blue-700">{weekLabel}</div>
        </div>

        <button
          onClick={() => setWeekOffset((o) => o + 1)}
          disabled={isCurrentWeek}
          className={`w-9 h-9 rounded-full font-bold text-lg transition-all flex items-center justify-center
            ${isCurrentWeek
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95'}`}
        >
          ›
        </button>
      </div>

      {/* 주간 요약 */}
      <div className="text-center mb-4 py-2.5 bg-blue-50 rounded-2xl">
        <span className="text-base font-bold text-blue-700">
          {weekLabel} {successCount}/{total} 성공 {successEmoji}
        </span>
        {failCount > 0 && (
          <div className="text-xs text-red-400 mt-0.5">
            {failCount}일 실패 ·{' '}
            {failCount >= 2 ? '주말 게임 모두 불가' : '일요일 게임은 가능해요'}
          </div>
        )}
      </div>

      {/* 평일 카드 목록 */}
      <div className="flex flex-col gap-2 mb-3">
        {weekdays.map((day) => (
          <WeekdayCard
            key={day.dateStr}
            day={day}
            isToday={day.dateStr === today}
            isPast={day.dateStr < today}
            onMarkFail={onMarkFail}
          />
        ))}
      </div>

      {/* 주말 카드 */}
      {(saturday || sunday) && (
        <div className="flex gap-2">
          {saturday && (
            <WeekendCard
              day={saturday}
              gameStatus={saturdayGame}
              isToday={saturday.dateStr === today}
            />
          )}
          {sunday && (
            <WeekendCard
              day={sunday}
              gameStatus={sundayGame}
              isToday={sunday.dateStr === today}
            />
          )}
        </div>
      )}
    </div>
  );
}
