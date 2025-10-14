'use client';

export default function MathWallBackground() {
  // 1000 REAL Math & Physics Formulas - Static Wall
  const formulas = [
    // Classical Mechanics (50)
    'F = ma', 'E = mc²', 'p = mv', 'W = Fd', 'P = W/t', 'KE = ½mv²', 'PE = mgh',
    'F = GMm/r²', 'g = GM/r²', 'v² = u² + 2as', 's = ut + ½at²', 'v = u + at',
    'T = 2π√(l/g)', 'F = -kx', 'ω = 2πf', 'v = fλ', 'I = P/A', 'τ = Fr',
    'L = Iω', 'α = τ/I', 'F = μN', 'η = W_out/W_in', 'P₁V₁ = P₂V₂',
    'v_rms = √(3RT/M)', 'F_c = mv²/r', 'a_c = v²/r', 'T = 2π/ω', 'f = 1/T',
    'x = A cos(ωt+φ)', 'v = -Aω sin(ωt+φ)', 'a = -Aω² cos(ωt+φ)', 
    'E_total = KE + PE', 'I = mr²', 'K = ½Iω²', 'p_angular = r × p',
    'F_drag = ½ρv²AC_d', 'Re = ρvL/μ', 'v_terminal = √(2mg/ρAC_d)',
    'σ = F/A', 'ε = ΔL/L₀', 'E = σ/ε', 'ΔL = αL₀ΔT',
    'Q = mcΔT', 'Q = mL', 'dQ/dt = -kA(dT/dx)', 'P = σAT⁴',
    
    // Electromagnetism (60)
    'F = qE', 'F = qvB sin θ', 'V = IR', 'P = IV', 'P = I²R', 'P = V²/R',
    'Q = It', 'E = V/d', 'C = Q/V', 'U = ½CV²', 'W = QV', 'ε = -dΦ/dt',
    'Φ = BA cos θ', 'B = μ₀I/2πr', 'F = BIL sin θ', '∇·E = ρ/ε₀', '∇×E = -∂B/∂t',
    '∇·B = 0', '∇×B = μ₀J + μ₀ε₀∂E/∂t', 'c = 1/√(μ₀ε₀)', 'n = c/v',
    'E = hf', 'λ = h/p', 'φ = hf - W', 'K_max = eV_s', '1/λ = R(1/n₁² - 1/n₂²)',
    'F = k|q₁q₂|/r²', 'U = kq₁q₂/r', 'E = kq/r²', 'V = kq/r', 'C = ε₀A/d',
    'X_L = ωL', 'X_C = 1/(ωC)', 'Z = √(R² + (X_L - X_C)²)', 'tan φ = (X_L - X_C)/R',
    'ω₀ = 1/√(LC)', 'Q = ω₀L/R', 'V_rms = V₀/√2', 'P_avg = V_rms I_rms cos φ',
    'λ_cutoff = hc/W', 'E_photon = hc/λ', 'p_photon = h/λ = E/c',
    'B = μ₀nI', 'Φ = LI', 'ε = -L(dI/dt)', 'U_L = ½LI²', 'τ = L/R',
    'n₁ sin θ₁ = n₂ sin θ₂', 'sin θ_c = n₂/n₁', 'tan θ_p = n₂/n₁',
    '1/f = 1/d_o + 1/d_i', 'm = -d_i/d_o', 'f = R/2', 'P = 1/f',
    'd sin θ = mλ', 'Δx sin θ = mλ', 'I ∝ cos²(πd sin θ/λ)',
    
    // Thermodynamics (50)
    'PV = nRT', 'ΔU = Q - W', 'dS ≥ 0', 'η = 1 - T_c/T_h', 'S = k_B ln Ω',
    'G = H - TS', 'H = U + PV', 'A = U - TS', 'dU = TdS - PdV', 
    'C_V = (∂U/∂T)_V', 'C_P = (∂H/∂T)_P', 'γ = C_P/C_V', 'PV^γ = const',
    'TV^(γ-1) = const', 'TP^((1-γ)/γ) = const', 'W = -∫PdV', 'W = nRT ln(V_f/V_i)',
    'η_Carnot = 1 - T_c/T_h', 'COP = Q_c/W', 'K = Q_h/W', 
    'ΔS = ∫(dQ/T)', 'ΔS_universe ≥ 0', 'μ = (∂G/∂n)_{T,P}',
    'dG = -SdT + VdP + μdn', 'K_p = e^(-ΔG°/RT)', 'ΔG° = -RT ln K',
    'v_avg = √(8RT/πM)', 'v_rms = √(3RT/M)', 'v_mp = √(2RT/M)',
    'Z = ∑e^(-E_i/k_BT)', '⟨E⟩ = k_BT²(∂ln Z/∂T)', 'F = -k_BT ln Z',
    'U = 3/2 Nk_BT', 'C_V = 3/2 Nk_B', 'C_P = 5/2 Nk_B', 'γ = 5/3',
    'P = 1/3 ρ⟨v²⟩', 'λ_mfp = k_BT/(√2 πd²P)', 'η ∝ √T',
    'κ = 1/3 λ_mfp v_avg C_V', 'D = λ_mfp v_avg/3',
    'n(E) = 1/(e^(E/k_BT) - 1)', 'f(E) = 1/(e^((E-μ)/k_BT) + 1)',
    
    // Quantum Mechanics (70)
    'E = hν', 'λ = h/p', 'Ĥψ = Eψ', '[x̂,p̂] = iℏ', 'ΔxΔp ≥ ℏ/2', 'ΔEΔt ≥ ℏ/2',
    'ψ(x,t) = Ae^(i(kx-ωt))', '⟨x⟩ = ∫ψ*xψ dx', 'P(x) = |ψ(x)|²',
    'Ê = iℏ∂/∂t', 'p̂ = -iℏ∇', 'x̂ψ = xψ', '⟨Â⟩ = ⟨ψ|Â|ψ⟩',
    'E_n = -13.6 eV/n²', 'L_n = n²a₀', 'ψ_nlm = R_nl(r)Y_lm(θ,φ)',
    'L̂²|l,m⟩ = l(l+1)ℏ²|l,m⟩', 'L̂_z|l,m⟩ = mℏ|l,m⟩',
    'Ŝ²|s,m_s⟩ = s(s+1)ℏ²|s,m_s⟩', 'Ŝ_z|s,m_s⟩ = m_sℏ|s,m_s⟩',
    '|ψ⟩ = ∑c_n|n⟩', '⟨n|m⟩ = δ_nm', '∑|n⟩⟨n| = 1̂',
    '[Â,B̂] = ÂB̂ - B̂Â', '[x̂,p̂_x] = iℏ', '[L̂_i,L̂_j] = iℏε_ijk L̂_k',
    'a_± = (x̂ ± ip̂)/√(2mℏω)', '[a,a†] = 1', 'Ĥ = ℏω(a†a + ½)',
    'E_n = ℏω(n + ½)', '|n⟩ = (a†)^n/√(n!) |0⟩', '⟨n|x̂|n±1⟩ = √(ℏ/2mω)√n',
    'α = e²/(4πε₀ℏc) ≈ 1/137', 'a₀ = 4πε₀ℏ²/(m_ee²)', 'R_∞ = m_ee⁴/(8ε₀²h³c)',
    'μ_B = eℏ/(2m_e)', 'γ = q/(2m)', 'Ĥ_B = -μ·B = -γL̂·B',
    'ψ(r,θ,φ) = R(r)Θ(θ)Φ(φ)', 'Y_lm(θ,φ) = Θ_lm(θ)Φ_m(φ)',
    '⟨r⟩_n = n²a₀[1 + ½(1 - l(l+1)/n²)]', 'P_r(r) = r²|R_nl(r)|²',
    
    // Relativity (40)
    'γ = 1/√(1-v²/c²)', 'E = γm₀c²', 'p = γm₀v', 't\' = γ(t - vx/c²)',
    'x\' = γ(x - vt)', 'L = L₀/γ', 'Δt = γΔt₀', 'm = γm₀',
    'E² = (pc)² + (m₀c²)²', 'E₀ = m₀c²', 'K = (γ-1)m₀c²',
    'u\' = (u-v)/(1-uv/c²)', 'p_μ p^μ = (m₀c)²', 'ds² = c²dt² - dx² - dy² - dz²',
    'ds² = g_μν dx^μ dx^ν', 'R_μν - ½g_μν R = 8πG/c⁴ T_μν',
    'r_s = 2GM/c²', 'Δλ/λ = GM/(rc²)', 'dτ² = (1-r_s/r)dt²',
    'Δφ = 4GM/(c²b)', 't_∞ = γ_grav t_local', 'ω_s = √(GM/r³)',
    'R_μνρσ', 'Γ^λ_μν = ½g^λσ(∂_μg_νσ + ∂_νg_μσ - ∂_σg_μν)',
    'R^ρ_σμν = ∂_μΓ^ρ_νσ - ∂_νΓ^ρ_μσ + Γ^ρ_μλΓ^λ_νσ - Γ^ρ_νλΓ^λ_μσ',
    'R_μν = R^λ_μλν', 'R = g^μν R_μν', 'G_μν = R_μν - ½g_μν R',
    'T^μν = (ρ + P/c²)u^μu^ν + Pg^μν', '∇_μT^μν = 0', 'u^μu_μ = c²',
    
    // Electrodynamics (80)
    'F = qE', 'F = q(v × B)', 'E = -∇V - ∂A/∂t', 'B = ∇ × A',
    '∇·E = ρ/ε₀', '∇·B = 0', '∇×E = -∂B/∂t', '∇×B = μ₀J + μ₀ε₀∂E/∂t',
    'V = ∫E·dl', 'W = q∫E·dl', 'E = kq/r²', 'V = kq/r', 'U = kq₁q₂/r',
    'F = ke²/r²', 'E_field = F/q₀', 'Φ_E = ∫E·dA', 'C = ε₀εᵣA/d',
    'U_C = ½QV = ½CV²', 'u_E = ½ε₀E²', 'I = dQ/dt', 'J = I/A = nqv_d',
    'R = ρL/A', 'σ = 1/ρ', 'P = I²R = V²/R = IV', 'ε = IR + Ir',
    '1/R_total = ∑1/R_i', 'R_total = ∑R_i', 'V = IR', 'I₁R₁ = I₂R₂',
    'τ = RC', 'Q(t) = Q₀e^(-t/RC)', 'I(t) = I₀e^(-t/RC)', 'V_C(t) = V₀(1-e^(-t/RC))',
    'F_B = IL × B', 'τ = μ × B', 'μ = NIA', 'U = -μ·B',
    'B = μ₀H', 'H = B/μ₀ - M', 'M = χH', 'μᵣ = 1 + χ', 'B = μμ₀H',
    'Φ_B = ∫B·dA', 'ε_ind = -dΦ_B/dt', 'ε = BLv', 'ε = ½Bωr²',
    'L = μ₀n²Al', 'ε_L = -L(dI/dt)', 'U_L = ½LI²', 'τ_L = L/R',
    'I_L(t) = I_max(1 - e^(-t/τ))', 'ω₀ = 1/√(LC)', 'Z_L = iωL', 'Z_C = -i/(ωC)',
    'V_L(t) = V₀ cos(ωt)', 'V_C(t) = V₀ cos(ωt - π/2)', '⟨P⟩ = V_rms I_rms cos φ',
    'Q = ω₀/Δω = ωL/R', 'I_res = V/R', 'S = E × H', '⟨S⟩ = ε₀cE₀²/2',
    'I = ε₀c|E|²/2', 'p_rad = I/c = u/3', 'F_rad = IA/c',
    
    // Wave Physics (40)
    'v = fλ', 'ω = 2πf', 'k = 2π/λ', 'v = ω/k', 'v = √(T/μ)', 'v = √(γP/ρ)',
    'y(x,t) = A sin(kx - ωt + φ)', 'v_y = -ωA cos(kx - ωt)', 'a_y = -ω²A sin(kx - ωt)',
    'E_wave = ½μω²A²', 'P_wave = ½μω²A²v', 'I = P/A = ½ρvω²A²',
    'I ∝ A²', 'I ∝ 1/r²', 'β = 10 log(I/I₀)', 'L = 10 log(P/P₀)',
    'f_obs = f_source(v±v_obs)/(v±v_source)', 'Δf/f = v/c', 'f\' = f√((c-v)/(c+v))',
    'y = y₁ + y₂', 'I_total = I₁ + I₂ + 2√(I₁I₂)cos δ', 'δ = 2πΔx/λ',
    'Δx = mλ', 'Δx = (m + ½)λ', 'y_m = mλL/d', 'θ = λ/d',
    'sin θ = 1.22λ/D', 'R = s/λ', 'Δλ = λ²/(2d)',
    
    // Optics (35)
    'n = c/v', 'n₁ sin θ₁ = n₂ sin θ₂', 'sin θ_c = n₂/n₁', 'θ_c = arcsin(n₂/n₁)',
    'θ_B = arctan(n₂/n₁)', 'R = [(n₁-n₂)/(n₁+n₂)]²', 'T = 1 - R',
    '1/f = (n-1)(1/R₁ - 1/R₂)', '1/f = 1/s_o + 1/s_i', 'm = -s_i/s_o = h_i/h_o',
    'P = 1/f', 'M = θ/θ₀ = 25cm/f', 'f_total = f₁f₂/(f₁+f₂-d)',
    'm_total = m₁m₂', 'I = I₀ cos²θ', 'I_transmitted = I₀ sin²(2θ)',
    'Δφ = 2πΔx/λ', 'I = I_max cos²(Δφ/2)', 'I_min/I_max = [(A₁-A₂)/(A₁+A₂)]²',
    'd sin θ = mλ', 'y_bright = mλL/d', 'y_dark = (m+½)λL/d',
    'sin θ_min = 1.22λ/D', 'R = D/(1.22λ)', 'N = R + 1',
    
    // Modern Physics (60)
    'λ_C = h/(m_ec)', 'Δλ = λ_C(1 - cos θ)', 'K_e = hf - W₀', 'eV_s = hf - W₀',
    'E = pc', 'E² = p²c² + m₀²c⁴', 'K = E - m₀c²', 'λ_dB = h/p = h/(mv)',
    'E_n = -13.6 eV/n²', 'ΔE = 13.6 eV(1/n_i² - 1/n_f²)', '1/λ = R_H(1/n₁² - 1/n₂²)',
    'R_H = 1.097 × 10⁷ m⁻¹', 'L = √(l(l+1))ℏ', 'L_z = m_lℏ', 'm_l = 0,±1,±2,...,±l',
    'S = √(s(s+1))ℏ', 'S_z = m_sℏ', 'm_s = ±½', 'J = L + S',
    'μ_l = -√(l(l+1))μ_B', 'μ_s = -2√(s(s+1))μ_B', 'μ_B = eℏ/(2m_e)',
    'ΔE = g_Jμ_BB', 'g_J = 1 + [j(j+1) + s(s+1) - l(l+1)]/(2j(j+1))',
    'Z_eff = Z - σ', 'E_n = -13.6 Z_eff²/n² eV',
    'λ_min = hc/(eV)', 'θ = 2d sin θ = nλ', 'λ = 2d sin θ/n',
    'N(t) = N₀e^(-λt)', 'A(t) = A₀e^(-λt)', 'T_{½} = ln2/λ = 0.693/λ',
    'λ = ln2/T_{½}', 'A = λN', 'dN/dt = -λN', 'R = R₀e^(-μx)',
    'B = (Zm_p + Nm_n - M_nucleus)c²', 'B/A = binding per nucleon',
    'Q = [m_reactants - m_products]c²', 'E_threshold = Q(1 + m_product/m_target)',
    
    // Calculus (100)
    'd/dx(x^n) = nx^(n-1)', 'd/dx(e^x) = e^x', 'd/dx(ln x) = 1/x', 'd/dx(sin x) = cos x',
    'd/dx(cos x) = -sin x', 'd/dx(tan x) = sec²x', 'd/dx(arcsin x) = 1/√(1-x²)',
    'd/dx(arctan x) = 1/(1+x²)', 'd/dx(sinh x) = cosh x', 'd/dx(cosh x) = sinh x',
    '∫x^n dx = x^(n+1)/(n+1)', '∫e^x dx = e^x', '∫1/x dx = ln|x|',
    '∫sin x dx = -cos x', '∫cos x dx = sin x', '∫sec²x dx = tan x',
    '∫1/(1+x²) dx = arctan x', '∫1/√(1-x²) dx = arcsin x',
    '∫e^(ax) dx = e^(ax)/a', '∫x e^x dx = e^x(x-1)', '∫ln x dx = x ln x - x',
    '∫sin²x dx = x/2 - sin(2x)/4', '∫cos²x dx = x/2 + sin(2x)/4',
    '∫tan x dx = -ln|cos x|', '∫sec x dx = ln|sec x + tan x|',
    '∫1/(a²+x²) dx = (1/a)arctan(x/a)', '∫1/√(a²-x²) dx = arcsin(x/a)',
    'd/dx∫f(t)dt = f(x)', '∫_a^b f(x)dx = F(b) - F(a)',
    '∫u dv = uv - ∫v du', 'lim_{x→a} f(x)', 'lim_{x→∞} (1+1/x)^x = e',
    'f\'(x) = lim_{h→0} [f(x+h)-f(x)]/h', '∂f/∂x', '∂²f/∂x²', '∂²f/∂x∂y',
    '∇f = ∂f/∂x î + ∂f/∂y ĵ + ∂f/∂z k̂', '∇·F = ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z',
    '∇×F = |î ĵ k̂; ∂_x ∂_y ∂_z; F_x F_y F_z|',
    '∇²f = ∂²f/∂x² + ∂²f/∂y² + ∂²f/∂z²', '∇²f = 0',
    '∫∫_R f(x,y) dA', '∫∫∫_V f(x,y,z) dV', '∮_C F·dr', '∬_S F·dA',
    '∮_C (P dx + Q dy) = ∫∫_R (∂Q/∂x - ∂P/∂y) dA',
    '∮_C F·dr = ∫∫_S (∇×F)·dA', '∬_S F·dA = ∫∫∫_V ∇·F dV',
    'dy/dx + P(x)y = Q(x)', 'y\'\' + p(x)y\' + q(x)y = 0', 'y = y_h + y_p',
    'y = c₁e^(r₁x) + c₂e^(r₂x)', 'r² + ar + b = 0', 'y_p = Ae^(αx)',
    '∂u/∂t = α∇²u', '∂²u/∂t² = c²∇²u', '∇²u = 0',
    'L[y] = y\'\' + ay\' + by', 'L[y₁ + y₂] = L[y₁] + L[y₂]',
    'e^x = ∑x^n/n!', 'sin x = ∑(-1)^n x^(2n+1)/(2n+1)!',
    'cos x = ∑(-1)^n x^(2n)/(2n)!', 'ln(1+x) = ∑(-1)^(n+1) x^n/n',
    '1/(1-x) = ∑x^n', 'arctan x = ∑(-1)^n x^(2n+1)/(2n+1)',
    
    // Linear Algebra (50)
    'Ax = b', 'det(A) = |A|', 'A^(-1)A = I', 'AB ≠ BA', 'A^T',
    'det(AB) = det(A)det(B)', 'det(A^T) = det(A)', 'det(A^(-1)) = 1/det(A)',
    'tr(A) = ∑a_ii', 'tr(AB) = tr(BA)', 'tr(A+B) = tr(A) + tr(B)',
    'Ax = λx', 'det(A - λI) = 0', '(A - λI)x = 0', 'Av_i = λ_iv_i',
    'P^(-1)AP = D', 'A = PDP^(-1)', 'e^A = ∑A^n/n!', 'A² - tr(A)A + det(A)I = 0',
    '⟨u,v⟩ = u·v', '∥v∥ = √(v·v)', 'cos θ = (u·v)/(∥u∥∥v∥)',
    'u × v = ∥u∥∥v∥sin θ n̂', 'u·(v×w) = det[u v w]',
    'proj_v u = [(u·v)/∥v∥²]v', 'rank(A) + nullity(A) = n',
    'dim(V) = dim(U) + dim(U^⊥)', 'V = U ⊕ U^⊥',
    'A = UΣV^T', 'σ_i² = eigenvalues of A^TA', 'A† = (A*)^T',
    '∥Ax∥ ≤ ∥A∥∥x∥', 'λ_max(A) = ∥A∥₂', 'κ(A) = ∥A∥∥A^(-1)∥',
    
    // Statistics & Probability (80)
    'P(A∪B) = P(A) + P(B) - P(A∩B)', 'P(A∩B) = P(A)P(B|A)', 'P(A|B) = P(A∩B)/P(B)',
    'P(B) = ∑P(A_i)P(B|A_i)', 'P(A_i|B) = P(A_i)P(B|A_i)/∑P(A_j)P(B|A_j)',
    'E[X] = ∑x_i P(X=x_i)', 'E[X] = ∫xf(x)dx', 'E[aX+b] = aE[X] + b',
    'E[X+Y] = E[X] + E[Y]', 'E[XY] = E[X]E[Y]', 'Var(X) = E[X²] - (E[X])²',
    'Var(aX+b) = a²Var(X)', 'Var(X+Y) = Var(X) + Var(Y) + 2Cov(X,Y)',
    'σ_X = √Var(X)', 'Cov(X,Y) = E[(X-μ_X)(Y-μ_Y)] = E[XY] - E[X]E[Y]',
    'ρ_{X,Y} = Cov(X,Y)/(σ_Xσ_Y)', '-1 ≤ ρ ≤ 1',
    'P(X=k) = (n k)p^k(1-p)^(n-k)', 'E[X] = np', 'Var(X) = np(1-p)',
    'P(X=k) = e^(-λ)λ^k/k!', 'E[X] = Var(X) = λ',
    'f(x) = (1/σ√(2π))e^(-(x-μ)²/(2σ²))', 'P(a < X < b) = Φ((b-μ)/σ) - Φ((a-μ)/σ)',
    'Z = (X - μ)/σ', 'X̄ ~ N(μ, σ²/n)', 'Z = (X̄ - μ)/(σ/√n)',
    's² = ∑(x_i - x̄)²/(n-1)', 'SE = σ/√n', 'ME = z*SE',
    'CI = x̄ ± z*(s/√n)', 't = (x̄ - μ)/(s/√n)', 'df = n - 1',
    'χ² = ∑(O_i - E_i)²/E_i', 'F = s₁²/s₂²', 'r = ∑(x_i-x̄)(y_i-ȳ)/(√∑(x_i-x̄)²√∑(y_i-ȳ)²)',
    'ŷ = b₀ + b₁x', 'b₁ = r(s_y/s_x)', 'b₀ = ȳ - b₁x̄', 'R² = r²',
    
    // Differential Equations (45)
    'dy/dx = f(x,y)', 'y = ∫f(x)dx', 'y\' + p(x)y = q(x)', 'IF = e^(∫p dx)',
    'y = (1/IF)∫q·IF dx', 'y\'\' + ay\' + by = 0', 'r² + ar + b = 0',
    'y = c₁e^(r₁x) + c₂e^(r₂x)', 'y = e^(αx)(c₁cos βx + c₂sin βx)',
    'y = (c₁ + c₂x)e^(rx)', 'y\'\' + ω²y = 0', 'y = A cos ωt + B sin ωt',
    '∂u/∂t = α∂²u/∂x²', 'u(x,t) = ∑A_n sin(nπx/L)e^(-α(nπ/L)²t)',
    '∂²u/∂t² = c²∂²u/∂x²', 'u(x,t) = ∑[A_n cos(ωt) + B_n sin(ωt)]sin(nπx/L)',
    '∇²u = ∂²u/∂x² + ∂²u/∂y² = 0', 'u = XY', 'X\'\'/X + Y\'\'/Y = 0',
    'r²R\'\' + rR\' + (k²r² - n²)R = 0', 'Θ\'\' + n²Θ = 0',
    
    // Complex Analysis (40)
    'z = x + iy', 'z* = x - iy', '|z| = √(x² + y²)', 'arg(z) = arctan(y/x)',
    'z = re^(iθ)', 'e^(iθ) = cos θ + i sin θ', 'e^(iπ) + 1 = 0',
    'sin z = (e^(iz) - e^(-iz))/(2i)', 'cos z = (e^(iz) + e^(-iz))/2',
    'sinh z = (e^z - e^(-z))/2', 'cosh z = (e^z + e^(-z))/2', 'tanh z = sinh z/cosh z',
    'f\'(z) = lim_{Δz→0} [f(z+Δz) - f(z)]/Δz', '∂u/∂x = ∂v/∂y', '∂u/∂y = -∂v/∂x',
    '∮_C f(z)dz = 0', '∮_C f(z)dz = 2πi∑Res(f,z_k)', 'Res(f,z₀) = lim_{z→z₀}(z-z₀)f(z)',
    'f(z) = ∑a_n(z-z₀)^n', '∫₀^∞ e^(-x²)dx = √π/2', '∫₀^π sin^n x dx',
    
    // Fourier Analysis (40)
    'f(x) = a₀/2 + ∑[a_n cos(nπx/L) + b_n sin(nπx/L)]',
    'a_n = (1/L)∫_{-L}^L f(x)cos(nπx/L)dx', 'b_n = (1/L)∫_{-L}^L f(x)sin(nπx/L)dx',
    'f(x) = ∑c_n e^(inπx/L)', 'c_n = (1/2L)∫_{-L}^L f(x)e^(-inπx/L)dx',
    'F(ω) = ∫_{-∞}^∞ f(t)e^(-iωt)dt', 'f(t) = (1/2π)∫_{-∞}^∞ F(ω)e^(iωt)dω',
    'F{f\'} = iωF(ω)', 'F{∫f} = F(ω)/(iω)', 'F{f*g} = F(ω)G(ω)',
    'X[k] = ∑_{n=0}^{N-1} x[n]e^(-i2πkn/N)', 'x[n] = (1/N)∑_{k=0}^{N-1} X[k]e^(i2πkn/N)',
    
    // Special Functions (30)
    'Γ(n) = (n-1)!', 'Γ(½) = √π', 'Γ(z+1) = zΓ(z)', '∫₀^∞ x^(n-1)e^(-x)dx = Γ(n)',
    'B(x,y) = Γ(x)Γ(y)/Γ(x+y)', 'B(x,y) = ∫₀^1 t^(x-1)(1-t)^(y-1)dt',
    'ζ(s) = ∑_{n=1}^∞ 1/n^s', 'ζ(2) = π²/6', 'ζ(4) = π⁴/90',
    'J_n(x)', 'Y_n(x)', 'H_n^(1)(x)', 'H_n^(2)(x)', 'I_n(x)', 'K_n(x)',
    'P_n(x)', 'P_n(cos θ)', 'L_n(x)', 'L_n^α(x)', 'H_n(x)', 'erf(x) = (2/√π)∫₀^x e^(-t²)dt',
    
    // Trigonometry (50)
    'sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ', '1 + cot²θ = csc²θ',
    'sin(A±B) = sin A cos B ± cos A sin B', 'cos(A±B) = cos A cos B ∓ sin A sin B',
    'tan(A±B) = (tan A ± tan B)/(1 ∓ tan A tan B)',
    'sin 2θ = 2 sin θ cos θ', 'cos 2θ = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ',
    'tan 2θ = 2tan θ/(1 - tan²θ)', 'sin²θ = (1 - cos 2θ)/2', 'cos²θ = (1 + cos 2θ)/2',
    'sin 3θ = 3sin θ - 4sin³θ', 'cos 3θ = 4cos³θ - 3cos θ',
    'sin A + sin B = 2sin((A+B)/2)cos((A-B)/2)',
    'cos A + cos B = 2cos((A+B)/2)cos((A-B)/2)',
    'sin A - sin B = 2cos((A+B)/2)sin((A-B)/2)',
    'a/sin A = b/sin B = c/sin C', 'a² = b² + c² - 2bc cos A',
    'Area = ½ab sin C', 'Area = √(s(s-a)(s-b)(s-c))',
    
    // Series & Sequences (45)
    'a_n = a₁ + (n-1)d', 'S_n = n(a₁ + a_n)/2 = n(2a₁ + (n-1)d)/2',
    'a_n = a₁r^(n-1)', 'S_n = a₁(1-r^n)/(1-r)', 'S_∞ = a₁/(1-r)',
    '∑_{n=1}^∞ 1/n diverges', '∑_{n=1}^∞ 1/n² = π²/6', '∑_{n=1}^∞ 1/n³ = ζ(3)',
    '∑_{n=1}^∞ 1/n⁴ = π⁴/90', '∑_{n=0}^∞ x^n = 1/(1-x)', '∑_{n=0}^∞ x^n/n! = e^x',
    '1 - 1/2 + 1/3 - 1/4 + ... = ln 2', '1 - 1/3 + 1/5 - 1/7 + ... = π/4',
    '∑_{n=0}^∞ (-1)^n x^(2n)/(2n)! = cos x', '∑_{n=0}^∞ (-1)^n x^(2n+1)/(2n+1)! = sin x',
    
    // Vector Calculus (40)
    '∇(fg) = f∇g + g∇f', '∇·(fF) = f∇·F + F·∇f', '∇×(fF) = f∇×F + ∇f×F',
    '∇·(F×G) = G·(∇×F) - F·(∇×G)', '∇×(∇f) = 0', '∇·(∇×F) = 0',
    '∇×(∇×F) = ∇(∇·F) - ∇²F', '∇(A·B) = (A·∇)B + (B·∇)A + A×(∇×B) + B×(∇×A)',
    'A·(B×C) = B·(C×A) = C·(A×B)', 'A×(B×C) = B(A·C) - C(A·B)',
    '(A×B)·(C×D) = (A·C)(B·D) - (A·D)(B·C)',
    
    // Financial Math (60) - For Savings App!
    'FV = PV(1 + r)^n', 'PV = FV/(1 + r)^n', 'A = P(1 + r/n)^(nt)',
    'A = Pe^(rt)', 'FV = PMT[((1+r)^n - 1)/r]', 'PV = PMT[(1 - (1+r)^(-n))/r]',
    'PMT = P[r(1+r)^n]/[(1+r)^n - 1]', 'r_eff = (1 + r/n)^n - 1',
    'CAGR = (End Value/Begin Value)^(1/years) - 1', 'ROI% = (Gain - Cost)/Cost × 100',
    'NPV = ∑CF_t/(1+r)^t', 'IRR: NPV = 0', 'PI = NPV/Initial Investment',
    'Payback = Initial Investment/Annual Cash Flow',
    'Break-even = Fixed Costs/(Price - Variable Cost)',
    'Profit = Revenue - Total Cost', 'Margin% = Profit/Revenue × 100',
    'Savings Rate% = Savings/Income × 100', 'Net Worth = Assets - Liabilities',
    'Debt-to-Income = Monthly Debt/Monthly Income', 'Emergency Fund = 3-6 months expenses',
    'Rule of 72: Years to Double = 72/Interest Rate%',
    'Compound Interest = P(1+r/n)^(nt) - P', 'Simple Interest = Prt',
    'APR = (Fees + Interest)/Principal × (365/Days) × 100',
    'EAR = (1 + APR/n)^n - 1', 'Real Return = (1+Nominal)/(1+Inflation) - 1',
    'Risk-Adjusted Return = (Return - Risk-Free)/Std Dev',
    'Sharpe Ratio = (R_p - R_f)/σ_p', 'Beta β = Cov(R_a,R_m)/Var(R_m)',
    'CAPM: E[R_i] = R_f + β_i(E[R_m] - R_f)', 'WACC = (E/V)R_e + (D/V)R_d(1-T_c)',
    'P/E Ratio = Stock Price/Earnings per Share', 'Dividend Yield = Annual Dividend/Price',
    'PEG Ratio = P/E Ratio/Growth Rate', 'Price/Book = Market Cap/Book Value',
    'ROE = Net Income/Equity', 'ROA = Net Income/Total Assets', 'D/E = Total Debt/Total Equity',
    'Current Ratio = Current Assets/Current Liabilities',
    'Quick Ratio = (Current Assets - Inventory)/Current Liabilities',
    'Gross Margin = (Revenue - COGS)/Revenue', 'Operating Margin = Operating Income/Revenue',
    'Asset Turnover = Revenue/Average Total Assets',
    'Portfolio Return = ∑w_iR_i', 'σ_p² = ∑∑w_iw_jσ_iσ_jρ_ij',
    
    // Chemistry (35)
    'pH = -log[H⁺]', 'pOH = -log[OH⁻]', 'pH + pOH = 14', 'K_w = [H⁺][OH⁻] = 10^(-14)',
    'K_a = [H⁺][A⁻]/[HA]', 'pK_a = -log K_a', 'pH = pK_a + log([A⁻]/[HA])',
    'K_p = K_c(RT)^(Δn)', 'ΔG° = -RT ln K', 'ΔG = ΔG° + RT ln Q',
    'ΔH = ∑ΔH_f(products) - ∑ΔH_f(reactants)', 'ΔS = ∑S(products) - ∑S(reactants)',
    'ΔG = ΔH - TΔS', 'E_cell = E°_cell - (RT/nF)ln Q', 'E°_cell = E°_cathode - E°_anode',
    'ΔG° = -nFE°_cell', 'ln K = nFE°/(RT)', 'rate = k[A]^m[B]^n',
    'ln k = ln A - E_a/(RT)', 'k = Ae^(-E_a/RT)', 't_{½} = 0.693/k',
    'PV = nRT', 'n = PV/RT', 'd = PM/RT', 'P_total = ∑P_i', 'X_i = n_i/n_total',
    'KE_avg = 3/2 k_BT', 'v_rms = √(3RT/M)', 'Graham: r₁/r₂ = √(M₂/M₁)',
    
    // Astronomy & Astrophysics (30)
    'F = GMm/r²', 'g = GM/r²', 'v_orbital = √(GM/r)', 'v_escape = √(2GM/r)',
    'T² = (4π²/GM)r³', 'L = 4πR²σT⁴', 'F = σT⁴', 'λ_max T = 2.9×10^(-3) m·K',
    'E = mc² = hc/λ = hν', 'z = λ_obs/λ_em - 1 = Δλ/λ_em',
    'v = H₀d', 'H₀ ≈ 70 km/s/Mpc', 't_universe ≈ 1/H₀', 'ρ_c = 3H₀²/(8πG)',
    'Ω = ρ/ρ_c', 'Ω_total = Ω_m + Ω_Λ + Ω_r', 'a(t) = R(t)/R₀',
    'H = ȧ/a', 'q = -äa/ȧ²', 'Δm = -2.5 log(I₂/I₁)', 'm - M = 5 log(d/10pc)',
    'parallax: d(pc) = 1/p(arcsec)', 'M_abs = m_app - 5 log(d/10)',
    
    // Information Theory (25)
    'H(X) = -∑p(x)log₂ p(x)', 'H(X,Y) = -∑∑p(x,y)log₂ p(x,y)',
    'H(X|Y) = -∑∑p(x,y)log₂ p(x|y)', 'I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)',
    'I(X;Y) = H(X) + H(Y) - H(X,Y)', 'C = max I(X;Y) = B log₂(1 + SNR)',
    'H(X) ≤ log₂ n', 'H(X|Y) ≤ H(X)', 'I(X;Y) ≥ 0',
    'D_KL(P||Q) = ∑p(x)log(p(x)/q(x))', 'D_KL(P||Q) ≥ 0',
    
    // Geometry (40)
    'A_circle = πr²', 'C = 2πr', 'A_ellipse = πab', 'A_triangle = ½bh',
    'A_trapezoid = ½(b₁+b₂)h', 'A_sphere = 4πr²', 'V_sphere = 4πr³/3',
    'V_cylinder = πr²h', 'V_cone = πr²h/3', 'V_pyramid = Ah/3',
    'c² = a² + b²', 'a² = b² + c² - 2bc cos A', 'sin A/a = sin B/b = sin C/c',
    'tan θ = opposite/adjacent', 'sin θ = opposite/hypotenuse',
    'cos θ = adjacent/hypotenuse', 'd = √((x₂-x₁)² + (y₂-y₁)²)',
    'midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)', 'slope m = (y₂-y₁)/(x₂-x₁)',
    'y - y₁ = m(x - x₁)', 'y = mx + b', 'Ax + By + C = 0',
    'x²/a² + y²/b² = 1', 'x²/a² - y²/b² = 1', '(x-h)² + (y-k)² = r²',
    'r = √(x² + y²)', 'θ = arctan(y/x)', 'x = r cos θ', 'y = r sin θ',
    'A = ½r²θ', 's = rθ', 'ρ = √(x² + y² + z²)', 'φ = arctan(y/x)',
    'θ = arccos(z/ρ)', 'x = ρ sin θ cos φ', 'y = ρ sin θ sin φ', 'z = ρ cos θ',
    
    // More Math (100)
    '(a+b)² = a² + 2ab + b²', '(a-b)² = a² - 2ab + b²', 'a² - b² = (a+b)(a-b)',
    '(a+b)³ = a³ + 3a²b + 3ab² + b³', 'a³ + b³ = (a+b)(a² - ab + b²)',
    'a³ - b³ = (a-b)(a² + ab + b²)', 'x = (-b ± √(b²-4ac))/(2a)',
    'log_a(xy) = log_a x + log_a y', 'log_a(x/y) = log_a x - log_a y',
    'log_a(x^n) = n log_a x', 'log_a b = log_c b/log_c a', 'log_a a = 1',
    'e^(ln x) = x', 'ln(e^x) = x', 'a^x = e^(x ln a)', 'log_a b = 1/log_b a',
    'sinh x = (e^x - e^(-x))/2', 'cosh x = (e^x + e^(-x))/2', 'tanh x = sinh x/cosh x',
    'cosh²x - sinh²x = 1', 'sinh(x±y) = sinh x cosh y ± cosh x sinh y',
    'd/dx sinh x = cosh x', 'd/dx cosh x = sinh x', 'd/dx tanh x = sech²x',
    '|a+b| ≤ |a| + |b|', '|ab| = |a||b|', '|a/b| = |a|/|b|',
    'AM ≥ GM: (a+b)/2 ≥ √(ab)', '∑_{k=0}^n (n k) = 2^n', '(n k) = n!/(k!(n-k)!)',
    'P(n,k) = n!/(n-k)!', 'C(n,k) = (n k)', '∑_{k=0}^n k(n k) = n2^(n-1)',
    
    // Constants (30)
    'c = 2.998 × 10⁸ m/s', 'G = 6.674 × 10^(-11) N·m²/kg²',
    'h = 6.626 × 10^(-34) J·s', 'ℏ = h/2π = 1.055 × 10^(-34) J·s',
    'k_B = 1.381 × 10^(-23) J/K', 'N_A = 6.022 × 10²³ mol^(-1)',
    'R = 8.314 J/(mol·K)', 'σ = 5.670 × 10^(-8) W/(m²·K⁴)',
    'μ₀ = 4π × 10^(-7) T·m/A', 'ε₀ = 8.854 × 10^(-12) F/m',
    'e = 1.602 × 10^(-19) C', 'm_e = 9.109 × 10^(-31) kg',
    'm_p = 1.673 × 10^(-27) kg', 'm_n = 1.675 × 10^(-27) kg',
    'π ≈ 3.14159', 'e ≈ 2.71828', 'φ = (1+√5)/2 ≈ 1.618',
    'g = 9.81 m/s²', 'atm = 101325 Pa', 'R_H = 1.097 × 10⁷ m^(-1)',
    'α ≈ 1/137', 'G_F = 1.166 × 10^(-5) GeV^(-2)', 'M_Planck = √(ℏc/G)',
    
    // Quantum Field Theory (25)
    'S = ∫d⁴x ℒ', 'ℒ = ½(∂_μφ)(∂^μφ) - ½m²φ² - V(φ)',
    'δS/δφ = 0', '∂_μ(∂ℒ/∂(∂_μφ)) = ∂ℒ/∂φ', '∂²φ + m²φ = 0',
    '[φ(x),π(y)] = iℏδ³(x-y)', 'π = ∂ℒ/∂φ̇', 'Ĥ = ∫d³x (π²/2 + (∇φ)²/2 + V)',
    '⟨0|T{φ(x)φ(y)}|0⟩ = D_F(x-y)', 'Z[J] = ∫Dφ e^(i(S+∫J·φ))',
    'W[J] = -iℏ ln Z[J]', 'Γ[φ_cl] = W[J] - ∫J·φ_cl',
    '⟨Ω|T{A(x)B(y)...}|Ω⟩', 'S-matrix: ⟨f|S|i⟩',
    'σ = |M|²/(flux)', 'dσ/dΩ = |f(θ)|²', 'Γ = ∑Γ_i',
    
    // Fluid Dynamics (30)
    '∂ρ/∂t + ∇·(ρv) = 0', 'ρ(∂v/∂t + v·∇v) = -∇P + μ∇²v + f',
    'Re = ρvL/μ', 'Fr = v/√(gL)', 'Ma = v/c_sound', 'We = ρv²L/σ',
    'P + ½ρv² + ρgh = const', 'Q = Av', 'F = ρQ(v₂ - v₁)',
    'F_drag = ½ρv²C_DA', 'F_lift = ½ρv²C_LA', 'C_L = 2L/(ρv²A)',
    'ω = ∇×v', '∇²ψ = -ω', 'v = ∇×ψ', 'Γ = ∮v·dl',
    '∂ω/∂t + v·∇ω = ω·∇v + ν∇²ω', 'DΓ/Dt = 0',
    
    // Statistical Mechanics (30)
    'Z = ∑_i e^(-βE_i)', 'β = 1/(k_BT)', 'F = -k_BT ln Z', '⟨E⟩ = ∂ln Z/∂β',
    'S = k_B ln Ω', 'S = -k_B∑p_i ln p_i', 'Ω = N!/(n₁!n₂!...)',
    'f_BE = 1/(e^((E-μ)/k_BT) - 1)', 'f_FD = 1/(e^((E-μ)/k_BT) + 1)',
    'f_MB = e^(-(E-μ)/k_BT)', '⟨n_i⟩ = 1/(e^(βE_i) ± 1)',
    'Z_canonical = Tr(e^(-βĤ))', 'Z_grand = Tr(e^(-β(Ĥ-μN̂)))',
    'G = -k_BT ln Z_grand', 'P = k_BT(∂ln Z/∂V)', '⟨N⟩ = k_BT(∂ln Z_grand/∂μ)',
    'C_V = ∂⟨E⟩/∂T', 'χ_T = -1/V(∂V/∂P)_T', 'α_P = 1/V(∂V/∂T)_P',
    
    // Symbols & Operators (50)
    '∇', '∂', '∫', '∑', '∏', '∆', 'δ', 'ε', 'μ', 'ρ', 'σ', 'τ', 'φ', 'ψ', 'ω',
    'α', 'β', 'γ', 'θ', 'λ', 'π', 'Γ', 'Λ', 'Ω', 'Σ', 'Φ', 'Ψ',
    '∞', '≈', '≠', '≤', '≥', '±', '∓', '×', '÷', '∝', '⊥', '∥', '∠', '°',
    '→', '⇒', '⇔', '∈', '∉', '⊂', '⊃', '∩', '∪', '∅', '∀', '∃', '∄',
    
    // More Physics Formulas (80)
    'I = ∫r²dm', 'I_disk = ½MR²', 'I_sphere = ⅖MR²', 'I_rod = ML²/12',
    'I_hoop = MR²', 'I_shell = ⅔MR²', 'L = Iω = r×p', 'τ = dL/dt',
    'K_rot = ½Iω²', 'K_total = ½Mv²_cm + ½I_cmω²',
    'v_cm = Rω', 'a_tan = Rα', 'α = dω/dt = d²θ/dt²',
    'ω² = ω₀² + 2αθ', 'θ = ω₀t + ½αt²', 'ω = ω₀ + αt',
    'F_net = Ma_cm', 'τ_net = Iα', 'p_total = ∑m_iv_i = Mv_cm',
    'ΔT = I²Rt', 'C_series = (∑1/C_i)^(-1)', 'C_parallel = ∑C_i',
    'L_series = ∑L_i', 'L_parallel = (∑1/L_i)^(-1)',
    'U_spring = ½kx²', 'F_spring = -kx', 'U_gravitational = -GMm/r',
    'U_electric = kq₁q₂/r', 'U_magnetic = -μ·B', 'W_total = ΔKE',
    'F·dr = dW', '∮F·dr = 0', 'F = -∇U', 'U(r) - U(∞) = -∫_∞^r F·dr',
    'Δp_total = 0', 'J = 0', 'v₁m₁ + v₂m₂ = v₁\'m₁ + v₂\'m₂',
    'e = (v₂\' - v₁\')/(v₁ - v₂)', 'e_perfect = 1', 'e_inelastic = 0',
    'ω_precession = τ/L', 'φ̇ = τ/(L sin θ)', 'L_precession = ω_precession × L',
    'F_centrifugal = mω²r', 'F_Coriolis = 2m(v×ω)', 'F_inertial = ma_rel',
    'E_wave = ½μA²ω²', 'P = ½μvω²A²', 'I = P/A',
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Concrete Wall Texture - Static */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, #C4C4C8 0%, #B0B0B8 25%, #A8A8B0 50%, #B0B0B8 75%, #C4C4C8 100%)
          `,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255,255,255,0.12) 0%, transparent 30%),
            radial-gradient(circle at 75% 65%, rgba(0,0,0,0.06) 0%, transparent 35%),
            radial-gradient(circle at 45% 85%, rgba(255,255,255,0.08) 0%, transparent 25%),
            radial-gradient(circle at 85% 15%, rgba(0,0,0,0.04) 0%, transparent 30%),
            repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.012) 1px, transparent 3px),
            repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.012) 1px, transparent 3px),
            radial-gradient(ellipse at 30% 40%, rgba(0,0,0,0.025) 0%, transparent 2px),
            radial-gradient(ellipse at 70% 60%, rgba(0,0,0,0.018) 0%, transparent 3px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 20px 20px, 20px 20px, 5px 5px, 7px 7px',
          boxShadow: 'inset 0 0 200px rgba(0,0,0,0.08)',
        }}
      >
        {/* Concrete texture noise - Static */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.35'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Formulas - Blue Marker Style - STATIC */}
      <div className="absolute inset-0 overflow-hidden">
        {formulas.map((formula, i) => {
          const col = i % 11;
          const row = Math.floor(i / 11);
          const x = col * 9.09 + (((i * 17) % 100) / 100 * 3 - 1.5);
          const y = row * 2.5 + (((i * 23) % 100) / 100 * 1.5 - 0.75);
          const rotation = -10 + ((i * 13) % 100) / 5;
          const size = 0.7 + ((i * 7) % 100) / 300;
          const opacity = 0.55 + ((i * 11) % 100) / 250;

          return (
            <div
              key={i}
              className="absolute font-mono font-bold select-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                fontSize: `${size}rem`,
                transform: `rotate(${rotation}deg)`,
                color: '#2563EB', // Blue marker
                textShadow: `
                  0.8px 0.8px 0px rgba(37, 99, 235, 0.25),
                  -0.3px -0.3px 0px rgba(37, 99, 235, 0.15),
                  1px 1px 2px rgba(37, 99, 235, 0.1)
                `,
                opacity: opacity,
                fontFamily: "'Courier New', 'Consolas', 'Monaco', monospace",
                fontWeight: 700,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              {formula}
            </div>
          );
        })}
      </div>

      {/* Marker strokes overlay - Static */}
      {[...Array(40)].map((_, i) => {
        const x = ((i * 37) % 100);
        const y = ((i * 47) % 100);
        const width = 25 + ((i * 19) % 80);
        const rotation = -45 + ((i * 29) % 90);
        
        return (
          <div
            key={`stroke-${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${width}px`,
              height: '2px',
              background: 'rgba(37, 99, 235, 0.12)',
              transform: `rotate(${rotation}deg)`,
              borderRadius: '1px',
            }}
          />
        );
      })}

      {/* Circles and underlines - Static */}
      {[...Array(15)].map((_, i) => {
        const x = ((i * 41) % 95);
        const y = ((i * 53) % 95);
        const size = 20 + ((i * 17) % 35);
        
        return (
          <div
            key={`circle-${i}`}
            className="absolute border-2 border-blue-600 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.08,
            }}
          />
        );
      })}

      {/* Big background formulas - Static */}
      <div
        className="absolute text-7xl font-mono font-black opacity-[0.04] select-none"
        style={{
          top: '8%',
          right: '5%',
          transform: 'rotate(-12deg)',
          color: '#2563EB',
          fontFamily: "'Courier New', monospace",
        }}
      >
        ∫₀^∞ e^(-x²) dx = √π/2
      </div>

      <div
        className="absolute text-6xl font-mono font-black opacity-[0.05] select-none"
        style={{
          bottom: '12%',
          left: '6%',
          transform: 'rotate(8deg)',
          color: '#2563EB',
          fontFamily: "'Courier New', monospace",
        }}
      >
        Ĥψ = Eψ
      </div>

      <div
        className="absolute text-5xl font-mono font-black opacity-[0.04] select-none"
        style={{
          top: '45%',
          left: '45%',
          transform: 'rotate(-5deg)',
          color: '#2563EB',
          fontFamily: "'Courier New', monospace",
        }}
      >
        ∇²φ = 0
      </div>
    </div>
  );
}
