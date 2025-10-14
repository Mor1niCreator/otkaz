'use client';

import { motion } from 'framer-motion';

export default function MathBackground() {
  const formulas = [
    // Physics
    'E = mc²',
    'F = ma',
    'ΔS ≥ 0',
    'PV = nRT',
    'v = v₀ + at',
    'E = hν',
    'ψ(x,t)',
    '∇·E = ρ/ε₀',
    'λ = h/p',
    'S = k ln W',
    // Math
    '∫f(x)dx',
    '∑ₙ₌₁',
    '∂f/∂x',
    'lim x→∞',
    'π ≈ 3.14',
    'e^(iπ) + 1 = 0',
    '√(a² + b²)',
    'sin²θ + cos²θ = 1',
    'dy/dx',
    '∇²φ = 0',
    'α + β = γ',
    '∫₀^∞',
    'Σ∞',
    'δx → 0',
    // Economics/Finance
    '$↑ = time↓',
    'ROI = (Gain-Cost)/Cost',
    '% savings',
    'Δ money',
    '∑ savings',
    'dM/dt',
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
      {/* Grid of formulas */}
      {formulas.map((formula, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const x = col * 16 + Math.random() * 8;
        const y = row * 12 + Math.random() * 8;
        const rotation = -15 + Math.random() * 30;
        const size = 0.8 + Math.random() * 0.7;

        return (
          <motion.div
            key={i}
            className="absolute font-mono font-bold"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${size}rem`,
              transform: `rotate(${rotation}deg)`,
              color: '#000',
              textShadow: '1px 1px 0px rgba(255,255,255,0.3)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0.25],
              scale: 1,
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.02,
              repeat: Infinity,
              repeatDelay: 10,
            }}
          >
            {formula}
          </motion.div>
        );
      })}

      {/* Random scattered marks */}
      {[...Array(30)].map((_, i) => {
        const marks = ['/', '\\', '|', '—', '~', '≈', '≠', '≤', '≥', '×', '÷'];
        const mark = marks[Math.floor(Math.random() * marks.length)];
        
        return (
          <motion.div
            key={`mark-${i}`}
            className="absolute font-mono font-bold text-2xl"
            style={{
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 95}%`,
              transform: `rotate(${-45 + Math.random() * 90}deg)`,
              color: '#000',
              opacity: 0.1,
            }}
            animate={{
              opacity: [0.05, 0.15, 0.08],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {mark}
          </motion.div>
        );
      })}

      {/* Big formulas in background */}
      <motion.div
        className="absolute text-6xl font-mono font-black opacity-5"
        style={{
          top: '10%',
          right: '5%',
          transform: 'rotate(-15deg)',
        }}
        animate={{
          opacity: [0.03, 0.08, 0.04],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        ∫₀^∞ e^(-x²) dx
      </motion.div>

      <motion.div
        className="absolute text-5xl font-mono font-black opacity-5"
        style={{
          bottom: '15%',
          left: '8%',
          transform: 'rotate(12deg)',
        }}
        animate={{
          opacity: [0.04, 0.09, 0.05],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      >
        Ĥψ = Eψ
      </motion.div>
    </div>
  );
}
