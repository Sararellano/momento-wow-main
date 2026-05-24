"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, RotateCcw, Zap } from "lucide-react";

// ── Canvas constants ────────────────────────────────────────────────────────
const CW = 480, CH = 280;
const GY = 236;           // ground Y (player feet rest here)
const PX = 82;            // player center X (fixed)
const PHW = 16;           // hitbox half-width (slightly smaller than visual)
const PHH = 72;           // hitbox height
const JV  = -15.5;        // jump velocity
const G   = 0.78;         // gravity

const SHIRTS: Record<string, string> = {
  blue: "#3b82f6", red: "#ef4444", green: "#22c55e",
  yellow: "#eab308", purple: "#a855f7",
};
const PANTS: Record<string, string> = {
  brown: "#92400e", black: "#1f2937", blue: "#1e40af", red: "#dc2626",
};

// ── Types ───────────────────────────────────────────────────────────────────
type GameStatus = "idle" | "playing" | "dead";
interface Obs  { x: number; w: number; h: number; kind: string; gy: number }
interface Part { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string }
interface GS {
  status:       GameStatus;
  py:           number;   // player bottom Y
  pvy:          number;   // vertical velocity
  jumpsLeft:    number;
  shieldHits:   number;   // superhero extra hits
  phaseActive:  number;   // ghost: frames of invincibility remaining
  phaseCd:      number;   // ghost: cooldown frames remaining
  obs:          Obs[];
  score:        number;
  speed:        number;
  tick:         number;
  spawnIn:      number;
  particles:    Part[];
  shakeFrames:  number;
  groundOff:    number;   // scrolling ground offset
}

const OBSTACLE_KINDS = ["pirate","anchor","skull","shark","bomb"];
const EMOJIS: Record<string, string> = {
  pirate: "🏴‍☠️", anchor: "⚓", skull: "💀", shark: "🦈", bomb: "💣",
};

// ── Avatar canvas renderer ──────────────────────────────────────────────────
function drawAvatar(
  ctx: CanvasRenderingContext2D,
  cx: number, by: number,
  character: string, hat: string,
  shirt: string, pants: string,
  tick: number, inAir: boolean,
  isPhasing: boolean, hasShield: boolean,
) {
  const SKIN = character === "ghost" ? "#dbeafe" : character === "dinosaur" ? "#86efac" : "#FDDBB4";
  const EYE  = "#1a1a2e";
  const bob  = inAir ? 0 : Math.abs(Math.sin(tick * 0.25)) * 2;
  const legA = inAir ? 0 : Math.sin(tick * 0.30) * 12;

  ctx.save();
  if (isPhasing) ctx.globalAlpha = 0.3;

  // shield glow
  if (hasShield) {
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.arc(cx, by - 46 + bob, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const hy = by - 86 + bob; // head center Y

  // cape (behind body)
  if (character === "superhero" || character === "superheroina") {
    ctx.fillStyle = character === "superhero" ? "#dc2626" : "#ec4899";
    ctx.beginPath();
    ctx.moveTo(cx - 8, hy + 18);
    ctx.quadraticCurveTo(cx - 26, hy + 50, cx - 10, by - 6 + bob);
    ctx.lineTo(cx + 4, by - 6 + bob);
    ctx.quadraticCurveTo(cx + 14, hy + 50, cx + 2, hy + 18);
    ctx.closePath();
    ctx.fill();
  }

  // dino tail
  if (character === "dinosaur") {
    ctx.fillStyle = "#86efac";
    ctx.beginPath();
    ctx.moveTo(cx + 20, by - 38 + bob);
    ctx.quadraticCurveTo(cx + 48, by - 26 + bob, cx + 54, by + bob);
    ctx.quadraticCurveTo(cx + 44, by - 8 + bob, cx + 18, by - 22 + bob);
    ctx.closePath();
    ctx.fill();
  }

  // legs (animated running)
  if (character !== "ghost") {
    ctx.fillStyle = pants;
    // left leg
    ctx.save();
    ctx.translate(cx - 10, by - 26 + bob);
    ctx.rotate((legA * Math.PI) / 180);
    ctx.beginPath();
    ctx.roundRect(-6, 0, 12, 26, 4);
    ctx.fill();
    ctx.restore();
    // right leg
    ctx.save();
    ctx.translate(cx + 10, by - 26 + bob);
    ctx.rotate((-legA * Math.PI) / 180);
    ctx.beginPath();
    ctx.roundRect(-6, 0, 12, 26, 4);
    ctx.fill();
    ctx.restore();
    // shoes
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.ellipse(cx - 10, by + bob, 10, 6, (legA * Math.PI) / 360, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 10, by + bob, 10, 6, (-legA * Math.PI) / 360, 0, Math.PI * 2);
    ctx.fill();
  }

  // body
  if (character === "ghost") {
    ctx.fillStyle = SKIN;
    ctx.beginPath();
    ctx.moveTo(cx - 22, hy + 18);
    ctx.lineTo(cx - 22, by - 12 + bob);
    for (let i = 0; i < 4; i++) {
      const wx = cx - 22 + (44 / 4) * i;
      const down = i % 2 === 0;
      ctx.quadraticCurveTo(wx + 5.5, by + (down ? 9 : -3) + bob, wx + 11, by - 12 + bob);
    }
    ctx.lineTo(cx + 22, hy + 18);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = shirt;
    ctx.beginPath();
    ctx.roundRect(cx - 22, hy + 18, 44, 36, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.moveTo(cx - 5, hy + 18);
    ctx.lineTo(cx, hy + 27);
    ctx.lineTo(cx + 5, hy + 18);
    ctx.closePath();
    ctx.fill();
  }

  // head
  ctx.fillStyle = SKIN;
  ctx.beginPath();
  ctx.arc(cx, hy, 22, 0, Math.PI * 2);
  ctx.fill();
  // cheeks
  ctx.fillStyle = "rgba(255,179,179,0.45)";
  ctx.beginPath(); ctx.arc(cx - 14, hy + 5, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 14, hy + 5, 6, 0, Math.PI * 2); ctx.fill();
  // eyes
  ctx.fillStyle = "white";
  ctx.beginPath(); ctx.arc(cx - 7, hy - 5, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 7, hy - 5, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = EYE;
  ctx.beginPath(); ctx.arc(cx - 6, hy - 5, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 8,  hy - 5, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath(); ctx.arc(cx - 5, hy - 7, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 9,  hy - 7, 1.5, 0, Math.PI * 2); ctx.fill();
  // nose
  ctx.fillStyle = character === "ghost" ? "#94a3b8" : "#d4886a";
  ctx.beginPath(); ctx.ellipse(cx, hy + 2, 2.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  // smile
  ctx.strokeStyle = EYE; ctx.lineWidth = 2; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, hy + 3, 9, 0.25, Math.PI - 0.25);
  ctx.stroke();

  // unicorn: mane + horn
  if (character === "unicorn") {
    ctx.strokeStyle = "#f472b6"; ctx.lineWidth = 8; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx - 22, hy - 8); ctx.quadraticCurveTo(cx - 32, hy + 8, cx - 22, hy + 18); ctx.stroke();
    ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx - 22, hy - 8); ctx.quadraticCurveTo(cx - 34, hy + 10, cx - 22, hy + 20); ctx.stroke();
    ctx.fillStyle = "#FFD700";
    ctx.beginPath(); ctx.moveTo(cx, hy - 32); ctx.lineTo(cx - 5, hy - 22); ctx.lineTo(cx + 5, hy - 22); ctx.closePath(); ctx.fill();
  }
  // dino: head spikes
  if (character === "dinosaur") {
    ctx.fillStyle = "#4ade80";
    [-8, 0, 8].forEach(dx => {
      ctx.beginPath(); ctx.moveTo(cx + dx, hy - 28); ctx.lineTo(cx + dx - 4, hy - 18); ctx.lineTo(cx + dx + 4, hy - 18); ctx.closePath(); ctx.fill();
    });
  }
  // superhero mask
  if (character === "superhero") {
    ctx.fillStyle = "#1e40af";
    ctx.beginPath(); ctx.moveTo(cx - 22, hy - 6); ctx.quadraticCurveTo(cx - 12, hy - 12, cx - 2, hy - 6); ctx.lineTo(cx - 2, hy + 2); ctx.quadraticCurveTo(cx - 12, hy - 4, cx - 22, hy + 2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 2, hy - 6); ctx.quadraticCurveTo(cx + 12, hy - 12, cx + 22, hy - 6); ctx.lineTo(cx + 22, hy + 2); ctx.quadraticCurveTo(cx + 12, hy - 4, cx + 2, hy + 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(cx, hy + 26, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("S", cx, hy + 26);
  }
  if (character === "superheroina") {
    ctx.fillStyle = "#7c3aed";
    ctx.beginPath(); ctx.moveTo(cx - 22, hy - 3); ctx.quadraticCurveTo(cx - 12, hy - 10, cx - 2, hy - 3); ctx.lineTo(cx - 2, hy + 4); ctx.quadraticCurveTo(cx - 12, hy - 2, cx - 22, hy + 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 2, hy - 3); ctx.quadraticCurveTo(cx + 12, hy - 10, cx + 22, hy - 3); ctx.lineTo(cx + 22, hy + 4); ctx.quadraticCurveTo(cx + 12, hy - 2, cx + 2, hy + 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 7; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx - 22, hy - 14); ctx.quadraticCurveTo(cx - 28, hy + 2, cx - 22, hy + 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 22, hy - 14); ctx.quadraticCurveTo(cx + 28, hy + 2, cx + 22, hy + 16); ctx.stroke();
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(cx, hy - 22, 25, Math.PI + 0.4, -0.4); ctx.stroke();
  }

  // hat
  const htop = hy - 22;
  if (hat === "pirate") {
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.moveTo(cx - 26, htop + 8); ctx.lineTo(cx - 16, htop - 4); ctx.lineTo(cx, htop - 14); ctx.lineTo(cx + 16, htop - 4); ctx.lineTo(cx + 26, htop + 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#e5e7eb"; ctx.fillRect(cx - 18, htop + 3, 36, 6);
    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(cx, htop - 2, 5, 0, Math.PI * 2); ctx.fill();
  } else if (hat === "crown") {
    ctx.fillStyle = "#FFD700";
    ctx.beginPath(); ctx.moveTo(cx - 18, htop + 6); ctx.lineTo(cx - 18, htop - 6); ctx.lineTo(cx - 9, htop + 2); ctx.lineTo(cx, htop - 14); ctx.lineTo(cx + 9, htop + 2); ctx.lineTo(cx + 18, htop - 6); ctx.lineTo(cx + 18, htop + 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(cx,      htop - 12, 3,   0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(cx - 16, htop -  4, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.arc(cx + 16, htop -  4, 2.5, 0, Math.PI * 2); ctx.fill();
  } else if (hat === "party") {
    ctx.fillStyle = "#a855f7";
    ctx.beginPath(); ctx.moveTo(cx, htop - 20); ctx.lineTo(cx - 14, htop + 4); ctx.lineTo(cx + 14, htop + 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(cx, htop - 20, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#60a5fa"; ctx.beginPath(); ctx.arc(cx - 5, htop - 8, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f87171"; ctx.beginPath(); ctx.arc(cx + 5, htop - 4, 2.5, 0, Math.PI * 2); ctx.fill();
  } else if (hat === "cowboy") {
    ctx.fillStyle = "#92400e"; ctx.beginPath(); ctx.ellipse(cx, htop + 6, 26, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#78350f"; ctx.beginPath(); ctx.roundRect(cx - 14, htop - 10, 28, 18, [5, 5, 0, 0]); ctx.fill();
    ctx.fillStyle = "#fbbf24"; ctx.fillRect(cx - 12, htop + 4, 24, 4);
  }

  ctx.restore();
}

// ── Obstacle drawer ─────────────────────────────────────────────────────────
function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obs) {
  ctx.font = `${Math.round(obs.h * 0.88)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(EMOJIS[obs.kind] ?? "⚓", obs.x + obs.w / 2, obs.gy + 4);
}

// ── Background drawer ───────────────────────────────────────────────────────
function drawBg(ctx: CanvasRenderingContext2D, groundOff: number) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, GY);
  sky.addColorStop(0, "#e0f2fe");
  sky.addColorStop(1, "#bae6fd");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CW, GY);

  // Distant clouds (static, decorative)
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  [[60, 40, 36, 18], [200, 32, 50, 22], [360, 50, 42, 20], [430, 28, 30, 14]].forEach(([x, y, rx, ry]) => {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  });

  // Scrolling ocean ground
  const gGrad = ctx.createLinearGradient(0, GY, 0, CH);
  gGrad.addColorStop(0, "#0ea5e9");
  gGrad.addColorStop(1, "#0369a1");
  ctx.fillStyle = gGrad;
  ctx.fillRect(0, GY, CW, CH - GY);

  // Wave pattern on ground
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const wx = ((groundOff * 0.5 + i * 80) % (CW + 80)) - 80;
    ctx.beginPath();
    ctx.moveTo(wx, GY + 8);
    ctx.quadraticCurveTo(wx + 20, GY + 2, wx + 40, GY + 8);
    ctx.quadraticCurveTo(wx + 60, GY + 14, wx + 80, GY + 8);
    ctx.stroke();
  }

  // Ground border line
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, GY); ctx.lineTo(CW, GY); ctx.stroke();
}

// ── Particle helpers ─────────────────────────────────────────────────────────
function spawnParticles(parts: Part[], x: number, y: number) {
  const colors = ["#fbbf24","#f87171","#60a5fa","#a78bfa","#4ade80","#f472b6"];
  for (let i = 0; i < 14; i++) {
    parts.push({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 6 + 2),
      life: 40, max: 40,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

// ── Ability info ─────────────────────────────────────────────────────────────
const ABILITY_INFO: Record<string, { name: string; desc: string; color: string; icon: string }> = {
  unicorn:      { name: "Doble salto",     desc: "Salta 2 veces en el aire",             color: "#f472b6", icon: "✨" },
  superhero:    { name: "Escudo",          desc: "Aguanta un golpe extra",               color: "#3b82f6", icon: "🛡️" },
  superheroina: { name: "Doble salto",     desc: "Salta 2 veces en el aire",             color: "#a78bfa", icon: "⭐" },
  dinosaur:     { name: "Súper salto",     desc: "Salta más alto que nadie",             color: "#4ade80", icon: "🦕" },
  ghost:        { name: "Atravesar",       desc: "Pulsa 2 veces para ser invisible 2s",  color: "#94a3b8", icon: "👻" },
};

// ── Main game component (reads searchParams) ────────────────────────────────
function RunnerGame() {
  const params      = useSearchParams();
  const character   = params.get("c")     ?? "unicorn";
  const hat         = params.get("h")     ?? "none";
  const shirtId     = params.get("shirt") ?? "blue";
  const pantsId     = params.get("pants") ?? "brown";
  const shirt       = SHIRTS[shirtId] ?? "#3b82f6";
  const pants       = PANTS[pantsId]  ?? "#92400e";

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const gsRef       = useRef<GS | null>(null);
  const rafRef      = useRef<number>(0);

  const [status,    setStatus]    = useState<GameStatus>("idle");
  const [score,     setScore]     = useState(0);
  const [highScore, setHighScore] = useState(0);

  const ability = ABILITY_INFO[character] ?? ABILITY_INFO.unicorn;

  // Jump / ability action
  const handleAction = useCallback(() => {
    const gs = gsRef.current;
    if (!gs) return;
    if (gs.status === "idle") return;
    if (gs.status === "dead")  return;

    if (character === "ghost") {
      // ghost: double-tap triggers phase
      if (gs.phaseCd <= 0) {
        gs.phaseActive = 120; // 2 seconds at 60fps
        gs.phaseCd = 320;
      }
      // still can jump normally
      if (gs.jumpsLeft > 0) { gs.pvy = JV; gs.jumpsLeft--; }
    } else {
      if (gs.jumpsLeft > 0) { gs.pvy = JV; gs.jumpsLeft--; }
    }
  }, [character]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAction]);

  // Start game
  const startGame = useCallback(() => {
    const maxJumps = (character === "unicorn" || character === "superheroina") ? 2
                   : character === "ghost" ? 1
                   : 1;
    const jumpV    = character === "dinosaur" ? JV * 1.25 : JV;
    gsRef.current = {
      status:      "playing",
      py:          GY,
      pvy:         0,
      jumpsLeft:   maxJumps,
      shieldHits:  character === "superhero" ? 1 : 0,
      phaseActive: 0,
      phaseCd:     0,
      obs:         [],
      score:       0,
      speed:       4.5,
      tick:        0,
      spawnIn:     90,
      particles:   [],
      shakeFrames: 0,
      groundOff:   0,
    };
    // store jumpV in closure workaround via ref
    (gsRef.current as GS & { jumpV?: number }).jumpV = jumpV;
    setStatus("playing");
    setScore(0);
  }, [character]);

  // Game loop
  useEffect(() => {
    if (status !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const gs = gsRef.current;
      if (!gs || gs.status !== "playing") return;

      gs.tick++;
      gs.score += 1;
      gs.speed  = 4.5 + gs.tick * 0.0012;
      gs.groundOff += gs.speed;

      // Physics
      const jumpV = (gsRef.current as GS & { jumpV?: number }).jumpV ?? JV;
      gs.pvy += G;
      gs.py  += gs.pvy;
      if (gs.py >= GY) {
        gs.py  = GY;
        gs.pvy = 0;
        const maxJumps = (character === "unicorn" || character === "superheroina") ? 2 : 1;
        gs.jumpsLeft = maxJumps;
      }

      // Ability timers
      if (gs.phaseActive > 0) gs.phaseActive--;
      if (gs.phaseCd    > 0) gs.phaseCd--;

      // Spawn obstacles
      gs.spawnIn--;
      if (gs.spawnIn <= 0) {
        const kind = OBSTACLE_KINDS[Math.floor(Math.random() * OBSTACLE_KINDS.length)];
        const isTall = kind === "skull";
        const isLow  = kind === "shark"; // shark flies low (mid-air)
        const h = isTall ? 72 : 52;
        const groundY = isLow ? GY - 55 : GY; // shark hovers above ground
        gs.obs.push({ x: CW + 10, w: 46, h, kind, gy: groundY });
        gs.spawnIn = Math.floor(80 + Math.random() * 70 - gs.tick * 0.01);
        gs.spawnIn = Math.max(gs.spawnIn, 55);
      }

      // Move + remove obstacles
      gs.obs.forEach(o => { o.x -= gs.speed; });
      gs.obs = gs.obs.filter(o => o.x > -80);

      // Collision detection
      const pleft  = PX - PHW, pright = PX + PHW;
      const ptop   = gs.py - PHH,       pbottom = gs.py;

      const isPhasing = gs.phaseActive > 0;

      for (const obs of gs.obs) {
        const oleft   = obs.x + 6;
        const oright  = obs.x + obs.w - 6;
        const obottom = obs.gy;
        const otop    = obs.gy - obs.h;
        const hit = pright > oleft && pleft < oright && pbottom > otop && ptop < obottom;
        if (hit && !isPhasing) {
          if (gs.shieldHits > 0) {
            gs.shieldHits--;
            gs.obs = gs.obs.filter(o => o !== obs);
            spawnParticles(gs.particles, PX, gs.py - PHH / 2);
            gs.shakeFrames = 10;
          } else {
            gs.status = "dead";
            spawnParticles(gs.particles, PX, gs.py - PHH / 2);
            gs.shakeFrames = 20;
            const final = Math.floor(gs.score / 10);
            setScore(final);
            setStatus("dead");
            setHighScore(prev => {
              const next = Math.max(prev, final);
              try { localStorage.setItem("runner-hs", String(next)); } catch {}
              return next;
            });
            // draw one last dead frame then stop
            break;
          }
        }
      }

      // Update particles
      gs.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--; });
      gs.particles = gs.particles.filter(p => p.life > 0);

      // ── Draw ──────────────────────────────────────────────────
      const shake = gs.shakeFrames > 0 ? (Math.random() - 0.5) * 5 : 0;
      if (gs.shakeFrames > 0) gs.shakeFrames--;

      ctx.clearRect(0, 0, CW, CH);
      ctx.save();
      if (shake) ctx.translate(shake, shake * 0.5);

      drawBg(ctx, gs.groundOff);

      // obstacles
      gs.obs.forEach(o => drawObstacle(ctx, o));

      // player
      drawAvatar(
        ctx, PX, gs.py,
        character, hat, shirt, pants,
        gs.tick, gs.py < GY,
        gs.phaseActive > 0,
        gs.shieldHits > 0,
      );

      // particles
      gs.particles.forEach(p => {
        ctx.globalAlpha = p.life / p.max;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // HUD: score
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.roundRect(CW - 110, 10, 100, 32, 8);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(`⭐ ${Math.floor(gs.score / 10)}`, CW - 14, 26);

      // ability HUD for ghost (shows phase cooldown)
      if (character === "ghost") {
        const pct = gs.phaseCd > 0 ? 1 - gs.phaseCd / 320 : 1;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath(); ctx.roundRect(10, 10, 110, 32, 8); ctx.fill();
        ctx.fillStyle = pct < 1 ? "#94a3b8" : "#e2e8f0";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(gs.phaseCd > 0 ? `👻 recargando…` : "👻 ¡Listo! (↑↑)", 16, 26);
      }
      // shield HUD for superhero
      if (character === "superhero" && gs.shieldHits > 0) {
        ctx.fillStyle = "rgba(59,130,246,0.4)";
        ctx.beginPath(); ctx.roundRect(10, 10, 80, 32, 8); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText("🛡️ ×1", 16, 26);
      }
      // double jump indicator
      if (character === "unicorn" || character === "superheroina") {
        const icon = character === "unicorn" ? "✨" : "⭐";
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath(); ctx.roundRect(10, 10, 90, 32, 8); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(`${icon} ×${gs.jumpsLeft}`, 16, 26);
      }

      ctx.restore();

      if (gs.status === "playing") {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [status, character, hat, shirt, pants]);

  // Load high score
  useEffect(() => {
    try { const hs = localStorage.getItem("runner-hs"); if (hs) setHighScore(Number(hs)); } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-100 flex flex-col items-center justify-center px-4 py-8">
      {/* Back link */}
      <div className="w-full max-w-xl mb-4">
        <a
          href="/demo/cumpleanos-infantil"
          className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-800 font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a crear personaje
        </a>
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-center mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
        ¡Corre, {character === "ghost" ? "Fantasma" : character === "unicorn" ? "Unicornio" : character === "dinosaur" ? "Dinosaurio" : character === "superheroina" ? "Superheroína" : "Superhéroe"}!
      </h1>
      <p className="text-muted-foreground text-sm mb-6 text-center">
        Esquiva los obstáculos piratas · <span className="font-semibold">Espacio / Tap</span> para saltar
      </p>

      {/* Ability badge */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold mb-6 shadow-lg"
        style={{ backgroundColor: ability.color }}
      >
        <Zap className="w-4 h-4" />
        <span>{ability.icon} Poder: {ability.name} — {ability.desc}</span>
      </div>

      {/* Canvas wrapper */}
      <div
        className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border-4 border-cyan-300 select-none cursor-pointer"
        style={{ aspectRatio: `${CW}/${CH}` }}
        onClick={handleAction}
        onTouchStart={(e) => { e.preventDefault(); handleAction(); }}
      >
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="w-full h-full block"
        />

        {/* Idle overlay */}
        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="text-center space-y-4 p-6">
              <div className="text-6xl animate-bounce">🏴‍☠️</div>
              <h2 className="text-2xl font-black text-foreground">¡Prepárate!</h2>
              <p className="text-muted-foreground text-sm">Esquiva piratas, anclas y tiburones</p>
              <button
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-xl px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all"
              >
                ¡EMPEZAR!
              </button>
              {highScore > 0 && (
                <p className="text-sm text-muted-foreground">Mejor puntuación: <strong>{highScore}</strong></p>
              )}
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {status === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-sm">
            <div className="text-center space-y-4 p-6">
              <div className="text-5xl">💀</div>
              <h2 className="text-2xl font-black text-foreground">¡Pillado!</h2>
              <div className="text-4xl font-black text-cyan-600">
                ⭐ {score} pts
              </div>
              {score >= highScore && score > 0 && (
                <div className="bg-yellow-400 text-yellow-900 font-black px-4 py-2 rounded-full text-sm animate-bounce">
                  🏆 ¡NUEVO RÉCORD!
                </div>
              )}
              {highScore > 0 && score < highScore && (
                <p className="text-sm text-muted-foreground">Récord: <strong>{highScore}</strong></p>
              )}
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); startGame(); }}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Otra vez
                </button>
                <a
                  href="/demo/cumpleanos-infantil"
                  className="flex items-center gap-2 border-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50 font-bold px-6 py-3 rounded-full transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Cambiar personaje
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Móvil: toca la pantalla para saltar · PC: barra espaciadora o flecha arriba
      </p>
    </div>
  );
}

// Suspense boundary required for useSearchParams
export default function RunnerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏴‍☠️</div>
      </div>
    }>
      <RunnerGame />
    </Suspense>
  );
}
