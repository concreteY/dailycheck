export default function WeekendBanner({ weekStats }) {
  const { failCount } = weekStats;
  const dayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat

  const isSaturday = dayOfWeek === 6;
  const hasGame = isSaturday ? failCount < 1 : failCount < 2;

  return (
    <div
      className={`rounded-3xl shadow-lg p-8 text-center mx-auto max-w-md
        ${hasGame ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-red-50 border-2 border-red-300'}`}
    >
      <div className="text-5xl mb-3">{hasGame ? '🎮' : '❌'}</div>
      <h2 className="text-3xl font-bold mb-2 text-gray-700">
        {isSaturday ? '토요일' : '일요일'}
      </h2>
      <p className={`text-2xl font-bold ${hasGame ? 'text-yellow-700' : 'text-red-600'}`}>
        {hasGame ? '게임 2시간!' : '게임 불가!'}
      </p>
      <p className="text-gray-500 text-sm mt-2">
        {hasGame ? '주중 학습을 잘 해줬어요!' : `주중 ${failCount}일 실패했어요`}
      </p>
    </div>
  );
}
