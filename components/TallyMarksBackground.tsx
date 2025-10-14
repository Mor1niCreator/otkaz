'use client';

export default function TallyMarksBackground() {
  // Generate tally marks (counting days) - groups of 5
  const generateTallyMarks = () => {
    const marks = [];
    const totalGroups = 200; // 200 groups = 1000 days counted!

    for (let i = 0; i < totalGroups; i++) {
      const col = i % 10;
      const row = Math.floor(i / 10);
      const x = col * 10 + ((i * 17) % 100) / 100 * 2;
      const y = row * 5 + ((i * 23) % 100) / 100 * 2;
      const rotation = -8 + ((i * 13) % 100) / 6.25;
      const groupRotation = -5 + ((i * 19) % 100) / 10;

      marks.push({
        id: i,
        x,
        y,
        rotation,
        groupRotation,
        // Random opacity for depth
        opacity: 0.5 + ((i * 11) % 100) / 200,
      });
    }

    return marks;
  };

  const tallyGroups = generateTallyMarks();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Concrete Wall Texture */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, #C4C4C8 0%, #B0B0B8 25%, #A8A8B0 50%, #B0B0B8 75%, #C4C4C8 100%)`,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255,255,255,0.12) 0%, transparent 30%),
            radial-gradient(circle at 75% 65%, rgba(0,0,0,0.06) 0%, transparent 35%),
            radial-gradient(circle at 45% 85%, rgba(255,255,255,0.08) 0%, transparent 25%),
            repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.012) 1px, transparent 3px),
            repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.012) 1px, transparent 3px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 20px 20px, 20px 20px',
          boxShadow: 'inset 0 0 200px rgba(0,0,0,0.08)',
        }}
      >
        {/* Concrete texture */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.35'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Tally Marks - Counting Days! */}
      <div className="absolute inset-0 overflow-hidden">
        {tallyGroups.map((group) => (
          <div
            key={group.id}
            className="absolute"
            style={{
              left: `${group.x}%`,
              top: `${group.y}%`,
              transform: `rotate(${group.groupRotation}deg)`,
            }}
          >
            {/* Group of 5 tally marks (||||/) */}
            <svg
              width="45"
              height="60"
              viewBox="0 0 45 60"
              style={{
                opacity: group.opacity,
                filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))',
              }}
            >
              {/* First mark */}
              <line
                x1="5"
                y1="5"
                x2="5"
                y2="55"
                stroke="#1E3A8A"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${-3 + ((group.id * 3) % 6)}deg)`,
                  transformOrigin: 'center',
                }}
              />
              
              {/* Second mark */}
              <line
                x1="13"
                y1="3"
                x2="13"
                y2="53"
                stroke="#1E40AF"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${-2 + ((group.id * 5) % 5)}deg)`,
                  transformOrigin: 'center',
                }}
              />
              
              {/* Third mark */}
              <line
                x1="21"
                y1="4"
                x2="21"
                y2="54"
                stroke="#1E3A8A"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${-1 + ((group.id * 7) % 4)}deg)`,
                  transformOrigin: 'center',
                }}
              />
              
              {/* Fourth mark */}
              <line
                x1="29"
                y1="5"
                x2="29"
                y2="55"
                stroke="#1E40AF"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${1 + ((group.id * 11) % 3)}deg)`,
                  transformOrigin: 'center',
                }}
              />
              
              {/* Fifth mark - DIAGONAL (crossing the others) */}
              <line
                x1="2"
                y1="15"
                x2="38"
                y2="45"
                stroke="#1E3A8A"
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${-2 + ((group.id * 9) % 5)}deg)`,
                  transformOrigin: 'center',
                }}
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Random single marks scattered around */}
      {[...Array(80)].map((_, i) => {
        const x = ((i * 41) % 98);
        const y = ((i * 53) % 98);
        const rotation = -30 + ((i * 29) % 60);
        const length = 30 + ((i * 17) % 30);
        
        return (
          <div
            key={`single-${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `rotate(${rotation}deg)`,
              opacity: 0.3 + ((i * 7) % 100) / 200,
            }}
          >
            <svg width="4" height={length} viewBox={`0 0 4 ${length}`}>
              <line
                x1="2"
                y1="0"
                x2="2"
                y2={length}
                stroke="#1E40AF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      })}

      {/* Some X marks (crossed out days) */}
      {[...Array(25)].map((_, i) => {
        const x = ((i * 37) % 96);
        const y = ((i * 59) % 96);
        const rotation = -15 + ((i * 31) % 30);
        
        return (
          <div
            key={`x-${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `rotate(${rotation}deg)`,
              opacity: 0.15 + ((i * 13) % 100) / 500,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30">
              <line x1="5" y1="5" x2="25" y2="25" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="25" y1="5" x2="5" y2="25" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );
      })}

      {/* Written numbers (day counts) */}
      {[...Array(30)].map((_, i) => {
        const day = (i + 1) * ((i * 7) % 30 + 1);
        const x = ((i * 43) % 95);
        const y = ((i * 61) % 95);
        const rotation = -12 + ((i * 19) % 24);
        
        return (
          <div
            key={`day-${i}`}
            className="absolute font-mono font-bold select-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: '1.2rem',
              transform: `rotate(${rotation}deg)`,
              color: '#1E40AF',
              textShadow: '1px 1px 1px rgba(30, 58, 138, 0.2)',
              opacity: 0.25,
              fontFamily: "'Courier New', monospace",
              fontWeight: 900,
            }}
          >
            {day}
          </div>
        );
      })}

      {/* Circle marks around some groups */}
      {[...Array(20)].map((_, i) => {
        const x = ((i * 47) % 94);
        const y = ((i * 67) % 94);
        const size = 50 + ((i * 23) % 40);
        
        return (
          <div
            key={`circ-${i}`}
            className="absolute rounded-full border-2"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderColor: '#1E40AF',
              opacity: 0.08,
              transform: `rotate(${((i * 17) % 45) - 22}deg)`,
            }}
          />
        );
      })}

      {/* Big "Day XXX" text in background */}
      <div
        className="absolute text-8xl font-black opacity-[0.04] select-none"
        style={{
          top: '15%',
          right: '8%',
          transform: 'rotate(-10deg)',
          color: '#1E3A8A',
          fontFamily: "'Bangers', 'Russo One', cursive",
          textShadow: '3px 3px 0px rgba(30, 58, 138, 0.1)',
        }}
      >
        DAY 365
      </div>

      <div
        className="absolute text-7xl font-black opacity-[0.05] select-none"
        style={{
          bottom: '18%',
          left: '10%',
          transform: 'rotate(7deg)',
          color: '#1E40AF',
          fontFamily: "'Bangers', 'Russo One', cursive",
          textShadow: '3px 3px 0px rgba(30, 64, 175, 0.1)',
        }}
      >
        ||||
      </div>
    </div>
  );
}
