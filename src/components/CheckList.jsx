import { useState, useEffect } from 'react';
import Confetti from './Confetti';

export default function CheckList({ entry, deadlinePassed, onToggle, onComplete, onReset }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevStatus, setPrevStatus] = useState(entry.status);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (entry.status === 'success' && prevStatus !== 'success') {
      setShowConfetti(true);
    }
    setPrevStatus(entry.status);
  }, [entry.status]);

  const { selectedGoals, checkedGoals, status } = entry;
  const allChecked = checkedGoals.length === selectedGoals.length;
  const canComplete = allChecked && !deadlinePassed && status === 'in_progress';
  const isLocked = deadlinePassed || status === 'success' || status === 'fail';

  const statusBanner = () => {
    if (status === 'success') {
      return (
        <div className="bounce-in flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-2xl py-4 mb-4 text-2xl font-bold">
          <span>오늘 완료!</span>
          <span>🎉</span>
        </div>
      );
    }
    if (status === 'fail') {
      return (
        <div className="flex items-center justify-center gap-2 bg-red-100 text-red-600 rounded-2xl py-4 mb-4 text-xl font-bold">
          <span>오늘 실패</span>
          <span>😢</span>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Confetti active={showConfetti} />
      <div className="bg-white rounded-3xl shadow-lg p-6 mx-auto max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-1">오늘의 체크리스트</h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          {checkedGoals.length}/{selectedGoals.length} 완료
        </p>

        {statusBanner()}

        <div className="flex flex-col gap-3 mb-6">
          {selectedGoals.map((goal) => {
            const checked = checkedGoals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => !isLocked && onToggle(goal)}
                disabled={isLocked}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${checked
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-white'
                  }
                  ${!isLocked ? 'hover:border-blue-300 active:scale-95 cursor-pointer' : 'cursor-default'}
                `}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${checked
                      ? 'bg-green-400 border-green-400 text-white'
                      : 'border-gray-300 bg-white'
                    }`}
                >
                  {checked && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-lg font-semibold ${
                    checked ? 'text-green-700 line-through' : 'text-gray-700'
                  }`}
                >
                  {goal}
                </span>
              </button>
            );
          })}
        </div>

        {status === 'in_progress' && (
          <button
            onClick={() => canComplete && onComplete()}
            disabled={!canComplete}
            className={`w-full py-4 rounded-2xl text-xl font-bold transition-all duration-200
              ${canComplete
                ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95 shadow-md pulse-glow'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {allChecked ? '완료 처리하기!' : `${selectedGoals.length - checkedGoals.length}개 남았어요`}
          </button>
        )}

        {deadlinePassed && status === 'in_progress' && (
          <p className="text-center text-red-400 text-sm mt-3 font-medium">
            오후 9:05 마감 — 체크 불가
          </p>
        )}

        {/* Reset 버튼 */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          {confirmReset ? (
            <div className="flex gap-2 items-center">
              <p className="flex-1 text-sm text-red-500 font-medium">정말 초기화할까요?</p>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all"
              >
                취소
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all"
              >
                초기화
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-400 text-sm font-semibold hover:border-red-300 hover:text-red-400 hover:bg-red-50 active:scale-95 transition-all"
            >
              오늘 처음부터 다시 시작
            </button>
          )}
        </div>
      </div>
    </>
  );
}
