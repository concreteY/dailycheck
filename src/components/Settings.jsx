import { useState, useEffect, useRef } from 'react';
import { DEFAULT_GOALS } from '../hooks/useGoalSettings';

export default function Settings({ goals, onSave, onClose }) {
  const [drafts, setDrafts] = useState(() => goals.map((g) => g.label));
  const [saved, setSaved] = useState(false);
  const overlayRef = useRef(null);

  // 바깥 영역 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // ESC 키 닫기
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleChange = (i, value) => {
    setDrafts((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    const newGoals = goals.map((g, i) => ({ ...g, label: drafts[i] }));
    onSave(newGoals);
    setSaved(true);
  };

  const handleReset = () => {
    setDrafts(DEFAULT_GOALS.map((g) => g.label));
    setSaved(false);
  };

  const hasChanges = drafts.some((d, i) => d !== goals[i].label);
  const hasBlank = drafts.some((d) => d.trim() === '');

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
    >
      {/* Bottom sheet panel */}
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 pb-8 animate-slide-up">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">학습 목표 설정</h2>
            <p className="text-xs text-gray-400 mt-0.5">부모님이 목표 항목을 수정할 수 있어요</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-3 mb-6">
          {goals.map((goal, i) => (
            <div key={goal.id} className="flex items-center gap-3">
              <span className="text-2xl w-8 text-center flex-shrink-0">{goal.emoji}</span>
              <input
                type="text"
                value={drafts[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                maxLength={30}
                placeholder={DEFAULT_GOALS[i].label}
                className={`flex-1 px-4 py-3 rounded-xl border-2 text-base font-medium transition-colors outline-none
                  ${drafts[i].trim() === ''
                    ? 'border-red-300 bg-red-50 focus:border-red-400'
                    : drafts[i] !== goals[i].label
                    ? 'border-blue-400 bg-blue-50 focus:border-blue-500'
                    : 'border-gray-200 bg-white focus:border-blue-400'
                  }`}
              />
            </div>
          ))}
        </div>

        {/* 경고 */}
        {hasBlank && (
          <p className="text-red-400 text-xs text-center mb-3 font-medium">
            빈 항목은 저장 시 기본값으로 채워집니다
          </p>
        )}

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 active:scale-95 transition-all text-sm"
          >
            기본값으로
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges && !saved}
            className={`flex-2 px-8 py-3 rounded-2xl font-bold text-base transition-all
              ${saved
                ? 'bg-green-500 text-white'
                : hasChanges
                ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {saved ? '저장 완료 ✓' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
