import { useState } from 'react';

const REQUIRED_COUNT = 4;

export default function GoalSelector({ goals, onConfirm }) {
  const [selected, setSelected] = useState([]);

  const toggle = (label) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : prev.length < REQUIRED_COUNT
        ? [...prev, label]
        : prev
    );
  };

  const canConfirm = selected.length === REQUIRED_COUNT;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mx-auto max-w-md">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-1">오늘의 학습 목표</h2>
      <p className="text-center text-gray-500 text-sm mb-5">
        4개를 선택해 주세요 ({selected.length}/{REQUIRED_COUNT})
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {goals.map((goal) => {
          const isSelected = selected.includes(goal.label);
          const isDisabled = !isSelected && selected.length >= REQUIRED_COUNT;
          return (
            <button
              key={goal.id}
              onClick={() => toggle(goal.label)}
              disabled={isDisabled}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 text-lg font-semibold
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700 scale-[1.02]'
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 active:scale-95'
                }`}
            >
              <span className="text-2xl">{goal.emoji}</span>
              <span>{goal.label}</span>
              {isSelected && (
                <span className="ml-auto text-blue-500 text-xl">✓</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => canConfirm && onConfirm(selected)}
        disabled={!canConfirm}
        className={`w-full py-4 rounded-2xl text-xl font-bold transition-all duration-200
          ${canConfirm
            ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-md'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        {canConfirm ? '목표 확정하기!' : `${REQUIRED_COUNT - selected.length}개 더 선택하세요`}
      </button>
    </div>
  );
}
