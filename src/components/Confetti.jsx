import { useEffect, useState } from 'react';

const COLORS = ['#60A5FA', '#FBBF24', '#34D399', '#F87171', '#A78BFA', '#FB923C'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${randomBetween(0, 100)}vw`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(8, 16),
      delay: `${randomBetween(0, 1.5)}s`,
      duration: `${randomBetween(2, 4)}s`,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 4500);
    return () => clearTimeout(timer);
  }, [active]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
