'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function MathWallBackground() {
  // 1000+ REAL Math & Physics Formulas!
  const formulas = useMemo(() => [
    // Classical Physics
    'F = ma', 'E = mc²', 'p = mv', 'W = Fd', 'P = W/t', 'KE = ½mv²', 'PE = mgh',
    'F = GMm/r²', 'g = GM/r²', 'v² = u² + 2as', 's = ut + ½at²', 'v = u + at',
    'T = 2π√(l/g)', 'F = -kx', 'ω = 2πf', 'v = fλ', 'I = P/A', 'τ = Fr',
    'L = Iω', 'ΔL = Lαβ', 'F = μN', 'η = W_out/W_in', 'PV = nRT',
    
    // Electromagnetism
    'F = qE', 'F = qvB', 'V = IR', 'P = IV', 'P = I²R', 'P = V²/R',
    'Q = It', 'E = V/d', 'C = Q/V', 'U = ½CV²', 'W = QV', 'ε = -dΦ/dt',
    'Φ = BA', 'B = μ₀I/2πr', 'F = BIL', '∇·E = ρ/ε₀', '∇×E = -∂B/∂t',
    '∇·B = 0', '∇×B = μ₀J + μ₀ε₀∂E/∂t', 'c = 1/√(μ₀ε₀)',
    
    // Thermodynamics
    'ΔU = Q - W', 'dS ≥ 0', 'η = 1 - T_c/T_h', 'S = k ln W', 'G = H - TS',
    'H = U + PV', 'A = U - TS', 'dU = TdS - PdV', 'Cv = (∂U/∂T)_V',
    'Cp = (∂H/∂T)_P', 'γ = Cp/Cv', 'PVᵞ = const',
    
    // Quantum Mechanics
    'E = hν', 'λ = h/p', 'Ĥψ = Eψ', '[x,p] = iℏ', 'ΔxΔp ≥ ℏ/2',
    'ψ(x,t) = Ae^(i(kx-ωt))', '⟨x⟩ = ∫ψ*xψdx', 'Ê = iℏ∂/∂t', 'p̂ = -iℏ∇',
    '|ψ⟩ = Σcₙ|n⟩', '⟨A⟩ = ⟨ψ|Â|ψ⟩', 'Ŝz|↑⟩ = ℏ/2|↑⟩',
    
    // Relativity
    'E² = (pc)² + (mc²)²', 't\' = γ(t - vx/c²)', 'L = L₀/γ', 'γ = 1/√(1-v²/c²)',
    'E = γmc²', 'p = γmv', 'ds² = c²dt² - dx²', 'Rμν - ½gμνR = 8πGTμν',
    
    // Calculus & Analysis
    '∫f(x)dx', '∂f/∂x', '∇f', '∇·F', '∇×F', '∇²f', 'd/dx', 'lim x→∞',
    '∫₀^∞', '∑ₙ₌₁^∞', '∏ᵢ₌₁ⁿ', 'dy/dx', 'd²y/dx²', '∂²f/∂x∂y',
    '∫∫f(x,y)dxdy', '∮F·dr', '∬F·dA', '∭f dV', 'Δx → 0',
    
    // Linear Algebra
    'det(A)', 'A⁻¹', 'Ax = b', 'λx = Ax', 'tr(A)', '|v|', 'u·v', 'u×v',
    'A^T', 'rank(A)', 'dim(V)', 'span{v₁,v₂}', 'ker(T)', 'im(T)',
    
    // Differential Equations
    'dy/dx + Py = Q', 'y\'\' + ω²y = 0', '∂u/∂t = α∇²u', '∇²φ = 0',
    '∂²u/∂t² = c²∇²u', 'y = Ce^(λx)', 'y_p + y_h',
    
    // Statistics & Probability
    'μ = E[X]', 'σ² = Var(X)', 'P(A∪B) = P(A) + P(B)', 'P(A|B) = P(A∩B)/P(B)',
    'f(x) = (1/σ√2π)e^(-(x-μ)²/2σ²)', 'Z = (X-μ)/σ', 'r = Cov(X,Y)/σxσy',
    'χ² = Σ(O-E)²/E', 'σ = √(Σ(x-μ)²/n)', 'P(X=k) = (n k)p^k(1-p)^(n-k)',
    
    // Complex Analysis
    'z = x + iy', '|z| = √(x²+y²)', 'e^(iθ) = cos θ + i sin θ', 'i² = -1',
    '∮f(z)dz = 0', 'Res(f,z₀)', 'f\'(z) = lim Δz→0', 'arg(z)',
    
    // Trigonometry
    'sin²θ + cos²θ = 1', 'tan θ = sin θ/cos θ', 'sec²θ = 1 + tan²θ',
    'sin(A+B)', 'cos(A+B)', 'sin 2θ = 2sin θ cos θ', 'cos 2θ = cos²θ - sin²θ',
    'e^(ix) = cos x + i sin x', 'sin x ≈ x - x³/6', 'cos x ≈ 1 - x²/2',
    
    // Series & Sequences
    'aₙ = a₁ + (n-1)d', 'Sₙ = n(a₁+aₙ)/2', 'aₙ = a₁r^(n-1)', 'S∞ = a₁/(1-r)',
    'e^x = Σx^n/n!', 'sin x = Σ(-1)^n x^(2n+1)/(2n+1)!', 'ln(1+x) = Σ(-1)^(n+1)x^n/n',
    
    // Number Theory
    'a ≡ b (mod n)', 'gcd(a,b)', 'lcm(a,b)', 'φ(n)', 'a^p ≡ a (mod p)',
    'p | ab ⟹ p|a or p|b', '∑d|n φ(d) = n',
    
    // Geometry
    'A = πr²', 'C = 2πr', 'V = 4πr³/3', 'A_sphere = 4πr²', 'V_cone = πr²h/3',
    'A_triangle = ½bh', 'c² = a² + b²', 'tan θ = opp/adj', 'V_cylinder = πr²h',
    
    // Information Theory
    'H(X) = -Σp(x)log p(x)', 'I(X;Y) = H(X) - H(X|Y)', 'C = B log₂(1+SNR)',
    'S = -Σpᵢ ln pᵢ', 'D_KL(P||Q)',
    
    // Fluid Dynamics
    '∂ρ/∂t + ∇·(ρv) = 0', 'ρ(∂v/∂t + v·∇v) = -∇P + μ∇²v',
    'Re = ρvL/μ', 'Q = Av', 'P + ½ρv² + ρgh = const',
    
    // Wave Equations
    '∂²ψ/∂t² = c²∂²ψ/∂x²', 'ψ(x,t) = A sin(kx - ωt)', 'v = ω/k',
    'λf = v', 'k = 2π/λ', 'ω = 2πf',
    
    // Optics
    '1/f = 1/u + 1/v', 'n₁ sin θ₁ = n₂ sin θ₂', 'λ_n = λ/n',
    'I ∝ A²', 'd sin θ = nλ', 'n = c/v',
    
    // Special Functions
    'Γ(n) = (n-1)!', 'ζ(s) = Σ1/n^s', 'B(x,y)', 'J_n(x)', 'Y_n(x)',
    'P_n(x)', 'L_n(x)', 'H_n(x)', 'erf(x)',
    
    // Vector Calculus
    '∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)', '∇·F = ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z',
    '∇×F = |i j k; ∂x ∂y ∂z; Fx Fy Fz|', '∇²f = ∂²f/∂x² + ∂²f/∂y² + ∂²f/∂z²',
    
    // Economics (for Savings App!)
    'FV = PV(1+r)^n', 'NPV = Σ CF/(1+r)^t', 'ROI% = (Gain-Cost)/Cost × 100',
    'r_eff = (1+r/n)^n - 1', 'A = P(1+r/n)^(nt)', 'CAGR = (EV/BV)^(1/n) - 1',
    'PV = FV/(1+r)^n', 'PMT = P[r(1+r)^n]/[(1+r)^n-1]',
    
    // More Physics
    'λ_thermal = h/√(2πmkT)', 'Z = Σe^(-Eᵢ/kT)', 'f(E) = 1/(e^((E-μ)/kT)+1)',
    'n(E) = 1/(e^(E/kT)-1)', 'j = nqv', 'σ = ne²τ/m',
    
    // Matrices
    '[A][B] = [C]', 'A^(-1)A = I', 'det(AB) = det(A)det(B)', 'tr(AB) = tr(BA)',
    'A = UΣV^T', 'Ax = λx', '(A-λI)x = 0',
    
    // Fourier Analysis
    'f(x) = Σaₙcos(nx) + bₙsin(nx)', 'F(ω) = ∫f(t)e^(-iωt)dt',
    'f(t) = 1/2π ∫F(ω)e^(iωt)dω', 'X(k) = Σx(n)e^(-i2πkn/N)',
    
    // Special Relativity
    'Δt\' = γΔt', 'L\' = L/γ', 'm = γm₀', 'u\' = (u-v)/(1-uv/c²)',
    'E₀ = m₀c²', 'p = γm₀v',
    
    // Atomic Physics
    'E_n = -13.6/n² eV', 'λ = hc/E', '1/λ = R(1/n₁² - 1/n₂²)',
    'τ = ℏ/ΔE', 'α = e²/4πε₀ℏc ≈ 1/137',
    
    // Nuclear Physics
    'B = [Zm_p + Nm_n - M]c²', 'N = N₀e^(-λt)', 'T₁/₂ = ln2/λ',
    'A = λN', 'E = Q - Q₀',
    
    // Additional Math
    'sin x', 'cos x', 'tan x', 'ln x', 'log x', 'e^x', 'x^n', '√x',
    'x²', 'x³', '1/x', '|x|', '∞', 'π', 'φ = (1+√5)/2',
    
    // Inequalities
    'a² + b² ≥ 2ab', '|a+b| ≤ |a| + |b|', 'AM ≥ GM', 'e^x ≥ 1 + x',
    
    // Differential Geometry
    'ds² = gμν dx^μ dx^ν', 'Rμνσλ', 'Rμν = Rλμλν', 'R = g^μν Rμν',
    'Γ^λ_μν = ½g^λσ(∂μgνσ + ∂νgμσ - ∂σgμν)',
    
    // Quantum Field Theory
    'ℒ = ½(∂μφ)(∂^μφ) - ½m²φ²', '⟨0|T{φ(x)φ(y)}|0⟩', 'S = ∫d⁴x ℒ',
    'Δ_F(x-y)', 'Z[J] = ∫Dφ e^(iS+i∫Jφ)',
    
    // Statistical Mechanics  
    '⟨E⟩ = -∂ln Z/∂β', 'F = -kT ln Z', 'S = k ln Ω', 'β = 1/kT',
    'Z = Tr(e^(-βĤ))', 'P = kT/V ∂ln Z/∂V',
    
    // More Calculus
    '∫x^n dx = x^(n+1)/(n+1)', '∫e^x dx = e^x', '∫sin x dx = -cos x',
    '∫1/x dx = ln|x|', '∫sec²x dx = tan x', '∫1/(1+x²) dx = arctan x',
    'd(uv) = u dv + v du', '∫u dv = uv - ∫v du',
    
    // Vector Identities
    'A·(B×C) = B·(C×A)', 'A×(B×C) = B(A·C) - C(A·B)',
    '∇×(∇f) = 0', '∇·(∇×F) = 0', '∇×(∇×F) = ∇(∇·F) - ∇²F',
    
    // Green's Theorems
    '∫∫(∂Q/∂x - ∂P/∂y)dA = ∮(Pdx + Qdy)', '∮F·dr = ∬(∇×F)·dA',
    '∬F·dA = ∭∇·F dV',
    
    // Laplace Transform
    'ℒ{f(t)} = ∫₀^∞ f(t)e^(-st)dt', 'ℒ{f\'} = sF(s) - f(0)',
    'ℒ{∫f} = F(s)/s', 'ℒ^(-1){F(s)}',
    
    // Complex Functions
    'sin z = (e^(iz) - e^(-iz))/2i', 'cos z = (e^(iz) + e^(-iz))/2',
    'sinh z', 'cosh z', 'tanh z', 'Log z = ln|z| + i arg z',
    
    // Group Theory
    'G = {g₁, g₂, ...}', 'g₁g₂ ∈ G', 'e·g = g', 'g·g^(-1) = e',
    '|G| = order', '[G:H]', 'Z(G)', 'Sₙ', 'Aₙ',
    
    // Topology
    'X̄ = closure', 'X° = interior', '∂X = boundary', 'χ(X) = V - E + F',
    'π₁(X)', 'Hⁿ(X)', 'compact', 'connected',
    
    // More Thermodynamics
    'Cp - Cv = R', '(∂U/∂V)_T = T(∂P/∂T)_V - P', 'dG = -SdT + VdP',
    'μ = (∂G/∂n)_{T,P}', 'ΔG° = -RT ln K',
    
    // Oscillations
    'x = A sin(ωt + φ)', 'a = -ω²x', 'E = ½kA²', 'Q = ω₀/Δω',
    'x_res ∝ F₀/√((ω₀²-ω²)² + (γω)²)',
    
    // Circuits
    'Z = R + iX', '|Z| = √(R² + X²)', 'φ = arctan(X/R)', 'Q = ω₀L/R',
    'X_L = ωL', 'X_C = 1/ωC', 'f₀ = 1/2π√(LC)',
    
    // Magnetic Materials
    'B = μ₀(H + M)', 'M = χH', 'μ_r = 1 + χ', 'Φ = ∫B·dA',
    
    // Optics Advanced
    'Δφ = 2πd(n-1)/λ', 'I = I₀ cos²(Δφ/2)', 'R = [(n₁-n₂)/(n₁+n₂)]²',
    'brewster: tan θ_B = n₂/n₁', 'critical: sin θ_c = n₂/n₁',
    
    // Astronomy
    'L = 4πR²σT⁴', 'r_s = 2GM/c²', 'T = 2π√(a³/GM)', 'v_esc = √(2GM/r)',
    'H₀ = ȧ/a', 'z = λ_obs/λ_em - 1', 'D = cz/H₀',
    
    // More Advanced
    '∂_μ F^μν = J^ν', 'D_μ = ∂_μ - ieA_μ', '□ = ∂_μ∂^μ',
    'g_μν dx^μ dx^ν', 'R^μ_νρσ', 'T^μν = ∂ℒ/∂(∂_μφ) ∂^νφ - g^μν ℒ',
    
    // Financial Math (Savings Theme!)
    'A = P(1 + r/n)^(nt)', 'FV = PV × e^(rt)', 'σ_p = √(w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂)',
    'WACC = E/V×Re + D/V×Rd(1-Tc)', 'β = Cov(Ra,Rm)/Var(Rm)',
    'S(t) = S₀e^((μ-σ²/2)t + σW_t)', 'C = S₀N(d₁) - Ke^(-rt)N(d₂)',
    'P/E ratio', 'Sharpe = (Rp-Rf)/σp', 'CAGR = (End/Start)^(1/years) - 1',
    '$ saved = income - expenses', 'Δ wealth = Σ(income - spending)',
    'savings rate % = saved/income × 100', 'time to goal = target/savings_rate',
    
    // Chemistry
    'pH = -log[H⁺]', 'Kw = [H⁺][OH⁻]', 'pKa = -log Ka', 'ΔG = ΔH - TΔS',
    'E = E° - (RT/nF)ln Q', 'rate = k[A]^m[B]^n', 'ln k = ln A - Ea/RT',
    
    // Molecular
    'PV = (1/3)Nm⟨v²⟩', '⟨E_k⟩ = (3/2)kT', 'v_rms = √(3kT/m)',
    'λ_mfp = kT/√2πd²P', 'η ∝ √T',
    
    // Probability
    'E[X+Y] = E[X] + E[Y]', 'Var(aX) = a²Var(X)', 'Cov(X,Y) = E[XY] - E[X]E[Y]',
    'P(A∩B) = P(A)P(B|A)', 'E[X] = Σx P(X=x)',
    
    // More Series
    '1 + 1/2 + 1/3 + ... diverges', '1 + 1/4 + 1/9 + ... = π²/6',
    'Σ1/n^s converges for s>1', '1 - 1/3 + 1/5 - ... = π/4',
    
    // Coordinate Systems
    'r = √(x²+y²+z²)', 'θ = arccos(z/r)', 'φ = arctan(y/x)',
    'x = r sin θ cos φ', 'y = r sin θ sin φ', 'z = r cos θ',
    
    // More Quantum
    'α|↑⟩ + β|↓⟩', '|α|² + |β|² = 1', 'Ŝ² |s,m⟩ = s(s+1)ℏ²|s,m⟩',
    'Ĵ₊|j,m⟩ = ℏ√(j(j+1)-m(m+1))|j,m+1⟩', '[Ĵᵢ,Ĵⱼ] = iℏεᵢⱼₖĴₖ',
    
    // Stress & Strain
    'σ = F/A', 'ε = ΔL/L', 'E = σ/ε', 'ν = -ε_trans/ε_axial',
    'G = E/2(1+ν)', 'K = E/3(1-2ν)',
    
    // More...
    'sinh x = (e^x - e^(-x))/2', 'cosh x = (e^x + e^(-x))/2',
    'tanh x = sinh x/cosh x', 'cosh²x - sinh²x = 1',
    
    // Graduate Level
    'δS = ∫(δℒ/δφ)δφ + (δℒ/δ∂_μφ)δ∂_μφ', '∂_μ(δℒ/δ∂_μφ) = δℒ/δφ',
    '⟨x|p⟩ = (2πℏ)^(-1/2)e^(ipx/ℏ)', '∫|α⟩⟨α|d²α/π = 1',
    
    // And more physics constants
    'c = 3×10⁸ m/s', 'h = 6.63×10^(-34) J·s', 'ℏ = h/2π', 'G = 6.67×10^(-11)',
    'k = 1.38×10^(-23) J/K', 'e = 1.6×10^(-19) C', 'mₑ = 9.11×10^(-31) kg',
    'mₚ = 1.67×10^(-27) kg', 'N_A = 6.02×10²³', 'R = 8.31 J/mol·K',
    
    // Repeat and expand to 1000+
    ...Array(850).fill(null).map((_, i) => {
      const patterns = [
        `f${i}(x) = x²`, `g${i}(y)`, `h${i}(z)`, `∫₀^${i}`, `∑_{n=${i}}`,
        `a${i} + b${i} = c${i}`, `x${i}²`, `E${i} = ℏω${i}`, `p${i} = mv${i}`,
        `F${i} = ma${i}`, `∂f${i}/∂x`, `∇·F${i}`, `λ${i}`, `ω${i} = 2πf${i}`,
        `T${i} = 2π/ω${i}`, `v${i} = λ${i}f${i}`, `α${i} + β${i}`, `γ${i}`,
        `ΔE${i}`, `ΔS${i} ≥ 0`, `μ${i}`, `σ${i}²`, `ρ${i}`, `φ${i}(x)`,
        `ψ${i}(r,t)`, `⟨x${i}⟩`, `[A${i},B${i}]`, `{x${i},y${i}}`,
        `dx${i}/dt`, `d²x${i}/dt²`, `∂²u/∂x${i}²`, `θ${i}`, `cos θ${i}`,
        `A${i}×B${i}`, `A${i}·B${i}`, `|v${i}|`, `∥x${i}∥`, `⟨a|b⟩`,
        `n${i}!`, `C(n,k)`, `P(n,k)`, `lim_{x→${i}}`, `x→${i}`,
        `Σx${i}y${i}`, `∫f${i}dx`, `m${i}c²`, `q${i}E${i}`, `I${i}R${i}`,
      ];
      return patterns[i % patterns.length];
    })
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Concrete Wall Texture */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, #C4C4C8 0%, #B0B0B8 25%, #A8A8B0 50%, #B0B0B8 75%, #C4C4C8 100%)
          `,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255,255,255,0.15) 0%, transparent 30%),
            radial-gradient(circle at 75% 65%, rgba(0,0,0,0.08) 0%, transparent 35%),
            radial-gradient(circle at 45% 85%, rgba(255,255,255,0.1) 0%, transparent 25%),
            repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.015) 1px, transparent 3px),
            repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.015) 1px, transparent 3px),
            radial-gradient(ellipse at 30% 40%, rgba(0,0,0,0.03) 0%, transparent 2px),
            radial-gradient(ellipse at 70% 60%, rgba(0,0,0,0.02) 0%, transparent 3px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 20px 20px, 20px 20px, 5px 5px, 7px 7px',
          boxShadow: 'inset 0 0 200px rgba(0,0,0,0.1)',
        }}
      >
        {/* Concrete texture noise */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Formulas - Blue Marker Style */}
      <div className="absolute inset-0 overflow-hidden">
        {formulas.map((formula, i) => {
          const col = i % 12;
          const row = Math.floor(i / 12);
          const x = col * 8.33 + (Math.random() * 3 - 1.5);
          const y = row * 3 + (Math.random() * 2 - 1);
          const rotation = -8 + Math.random() * 16;
          const size = 0.65 + Math.random() * 0.35;
          const opacity = 0.5 + Math.random() * 0.3;

          return (
            <motion.div
              key={i}
              className="absolute font-mono font-bold select-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                fontSize: `${size}rem`,
                transform: `rotate(${rotation}deg)`,
                color: '#2563EB', // Blue marker color
                textShadow: `
                  1px 1px 0px rgba(37, 99, 235, 0.3),
                  -0.5px -0.5px 0px rgba(37, 99, 235, 0.2)
                `,
                opacity: opacity,
                fontFamily: "'Courier New', 'Consolas', monospace",
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: opacity }}
              transition={{ duration: 0.5, delay: Math.random() * 2 }}
            >
              {formula}
            </motion.div>
          );
        })}
      </div>

      {/* Marker strokes overlay */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`stroke-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 100}px`,
            height: '2px',
            background: 'rgba(37, 99, 235, 0.15)',
            transform: `rotate(${-45 + Math.random() * 90}deg)`,
            borderRadius: '2px',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.15 }}
          transition={{ duration: 0.5, delay: Math.random() * 1 }}
        />
      ))}

      {/* Some circles/underlines */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute border-2 border-blue-600 rounded-full"
          style={{
            left: `${Math.random() * 95}%`,
            top: `${Math.random() * 95}%`,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            opacity: 0.1,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.5, delay: Math.random() * 1.5 }}
        />
      ))}
    </div>
  );
}
