import { useState, useEffect } from 'react';

function getDeadlineToday() {
  const d = new Date();
  d.setHours(21, 5, 0, 0);
  return d;
}

function formatCountdown(diffMs) {
  if (diffMs <= 0) return null;
  const totalMin = Math.floor(diffMs / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}시간 ${m}분`;
  if (m > 0) return `${m}분`;
  return '1분 미만';
}

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // 1초마다 갱신 (시계 표시 정확도)
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const deadline = getDeadlineToday();
  const diff = deadline - now;
  const isPast = diff <= 0;
  const countdown = formatCountdown(diff);

  const timeStr = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const dateStr = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="text-center mb-4">
      <div className="text-gray-500 text-sm font-medium">{dateStr}</div>
      <div className="text-4xl font-bold text-blue-700 tracking-wide">{timeStr}</div>
      {!isPast ? (
        <div className="mt-1 inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
          <span>마감까지</span>
          <span className="font-mono">{countdown}</span>
        </div>
      ) : (
        <div className="mt-1 inline-flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
          오후 9:05 마감 완료
        </div>
      )}
    </div>
  );
}
