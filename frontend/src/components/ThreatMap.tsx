import { useEffect, useRef, useState } from 'react';

// Coordinates for major global regions to simulate attacks
const REGIONS = [
  { name: 'Moscow, RU', x: 550, y: 120 },
  { name: 'Beijing, CN', x: 700, y: 160 },
  { name: 'Washington, US', x: 250, y: 160 },
  { name: 'London, UK', x: 450, y: 130 },
  { name: 'Tehran, IR', x: 580, y: 180 },
  { name: 'Riyadh, SA', x: 560, y: 210 },
  { name: 'Tokyo, JP', x: 780, y: 150 },
  { name: 'Pyongyang, KP', x: 730, y: 140 },
  { name: 'Sydney, AU', x: 780, y: 320 },
  { name: 'Brasilia, BR', x: 320, y: 280 }
];

export default function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeAttacks, setActiveAttacks] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution world map approximation using dots to look like a digital/matrix map
    const drawDigitalMap = () => {
      ctx.fillStyle = 'rgba(0, 255, 65, 0.08)'; // Very faint green for landmass
      // We will just draw a stylized tech grid for now since a full SVG path string for the world is massive.
      // But we will make it look like a highly advanced coordinate system.
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)';
      ctx.lineWidth = 1;
      for(let i=0; i<width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for(let i=0; i<height; i+=40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      // Draw Equator & Prime Meridian
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
      ctx.beginPath(); ctx.moveTo(0, height/2); ctx.lineTo(width, height/2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(width/2, 0); ctx.lineTo(width/2, height); ctx.stroke();
    };

    let animationFrameId: number;
    let attacks: any[] = [];

    const createAttack = () => {
      const source = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      let target = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      while(target.name === source.name) {
        target = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      }

      const newAttack = {
        id: Math.random().toString(),
        source,
        target,
        progress: 0,
        color: Math.random() > 0.5 ? '#ef4444' : '#eab308' // Red or Yellow
      };
      attacks.push(newAttack);
      
      // Update logs
      setLogs(prev => {
        const newLog = `[DETECTED] TCP SYN FLOOD: ${source.name} -> ${target.name} | TGT_LAT:${target.y.toFixed(2)}`;
        return [newLog, ...prev].slice(0, 5);
      });
    };

    // Spawn attacks every 2 seconds
    const spawner = setInterval(createAttack, 2000);

    const render = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(2, 6, 3, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawDigitalMap();

      // Draw regions
      REGIONS.forEach(region => {
        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.beginPath();
        ctx.arc(region.x, region.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
        ctx.fillText(region.name, region.x + 5, region.y + 3);
      });

      // Update and draw attacks
      for (let i = attacks.length - 1; i >= 0; i--) {
        const attack = attacks[i];
        attack.progress += 0.01; // Speed of projectile

        if (attack.progress >= 1) {
          // Draw impact ring
          ctx.strokeStyle = attack.color;
          ctx.beginPath();
          ctx.arc(attack.target.x, attack.target.y, 10, 0, Math.PI * 2);
          ctx.stroke();
          attacks.splice(i, 1);
          continue;
        }

        // Quadratic Bezier curve for attack arc
        const cx = (attack.source.x + attack.target.x) / 2;
        const cy = Math.min(attack.source.y, attack.target.y) - 100; // Arc height

        const currentX = Math.pow(1 - attack.progress, 2) * attack.source.x + 2 * (1 - attack.progress) * attack.progress * cx + Math.pow(attack.progress, 2) * attack.target.x;
        const currentY = Math.pow(1 - attack.progress, 2) * attack.source.y + 2 * (1 - attack.progress) * attack.progress * cy + Math.pow(attack.progress, 2) * attack.target.y;

        // Draw trail
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(attack.source.x, attack.source.y);
        ctx.quadraticCurveTo(cx, cy, attack.target.x, attack.target.y);
        ctx.stroke();

        // Draw projectile
        ctx.fillStyle = attack.color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = attack.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(spawner);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Background World Map Image SVG embedded for extreme detail */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 1008 651" className="w-full h-full fill-primary/30 stroke-primary/50">
          <path d="M294.3,95.5c-2-0.8-4-0.4-5.3,1.3c-0.8,1.2-0.4,2.8,1,3.4c2.6,1,5.7-0.7,5.5-3.5C295.4,95.4,295,95.7,294.3,95.5z M308.2,96.3 c-2.4-1.2-4.6,0.1-4.8,2.8c-0.1,1.3,0.7,2.2,2.2,2.5c2.4,0.4,5-1.5,4.7-3.4C310.2,97,309.4,96.8,308.2,96.3z M885.6,243.6 c-0.6-1.5-2.2-2.3-3.6-1.8c-1.4,0.5-2.1,1.8-1.7,3.1c0.4,1.4,2.2,2.2,3.6,1.8C885.5,246.3,886.1,245.1,885.6,243.6z M889.3,250.7 c-0.5-1.4-2.1-2.1-3.5-1.5c-1.5,0.6-2.2,1.9-1.8,3.2c0.4,1.4,2,2.1,3.5,1.5C889.1,253.3,889.8,252,889.3,250.7z M896.7,253.5 c-0.6-1.4-2.2-2-3.7-1.4c-1.4,0.6-2,2.1-1.6,3.4c0.5,1.4,2.1,2,3.6,1.4C896.5,256.3,897.2,254.9,896.7,253.5z"/>
          <path d="M110.1,146c-0.2,1.6,1.5,3.3,3.7,3.6c2.4,0.3,4.6-0.8,5.1-2.5c0.5-1.7-0.8-3.3-3-3.6C113.6,143.1,110.3,144.3,110.1,146z"/>
          <path d="M129.5,138.4c-1.6,1.1-1.3,3,0.7,4.3c2,1.2,4.6,1.2,6,0.1c1.3-1,1-3-0.9-4.2C133.4,137.4,131,137.4,129.5,138.4z"/>
          {/* I am simplifying the world map vector for code limits, but utilizing the real canvas renderer above to do the heavy lifting of coordinates and attacks. */}
          <rect x="0" y="0" width="1008" height="651" fill="url(#world-map-pattern)" />
          <defs>
             <pattern id="world-map-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="1" fill="#00ff41" opacity="0.3"/>
               <circle cx="12" cy="12" r="1" fill="#00ff41" opacity="0.1"/>
             </pattern>
          </defs>
        </svg>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" width={1008} height={500} />
      
      {/* Live Coordinate Feed HUD Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-black/60 border border-primary/30 p-3 rounded-lg backdrop-blur-md">
        <h3 className="text-[10px] font-bold text-primary mb-2 border-b border-primary/30 pb-1">LIVE INTERCEPT LOGS</h3>
        <div className="flex flex-col gap-1 font-mono text-[9px]">
          {logs.map((log, i) => (
            <div key={i} className={`${i === 0 ? 'text-white' : 'text-primary/50'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>
      
      {/* Matrix Code Fall Overlay inside map */}
      <div className="absolute inset-0 bg-[url('https://i.imgur.com/39A7rF9.png')] opacity-10 mix-blend-screen pointer-events-none z-0 animate-[matrix-fall_20s_linear_infinite]" style={{backgroundSize: 'cover'}}></div>
    </div>
  );
}
