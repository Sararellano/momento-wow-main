"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Trophy, RotateCcw, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ============ Lightweight confetti (no external lib) ============ */
const CONFETTI_COLORS = ["#6200EE", "#2EFFA9", "#F5A9C9", "#FFD166", "#fff"];

export function Confetti({ fire }: { fire: number }) {
  const [pieces, setPieces] = useState<
    { id: number; x: number; color: string; delay: number; rotate: number }[]
  >([]);

  useEffect(() => {
    if (fire === 0) return;
    const batch = Array.from({ length: 80 }, (_, i) => ({
      id: fire * 1000 + i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.3,
      rotate: Math.random() * 360,
    }));
    setPieces(batch);
    const t = setTimeout(() => setPieces([]), 2600);
    return () => clearTimeout(t);
  }, [fire]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 h-3 w-2 rounded-sm"
          style={{ left: `${p.x}%`, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, rotate: p.rotate }}
          animate={{ y: "105vh", opacity: [1, 1, 0], rotate: p.rotate + 360 }}
          transition={{ duration: 2.2, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/* ============ Memory Match ============ */
type MemoryCard = {
  id: number;
  pairId: number;
  image: string;
  fact: string;
};

const MEMORY_SOURCE = [
  { image: "/boda/mem-dog.png", fact: "El día que adoptaron a Trufa, su perrito, en 2024." },
  { image: "/boda/mem-travel.png", fact: "Su primer viaje juntos por los pueblos de la Toscana." },
  { image: "/boda/mem-cook.png", fact: "Cada domingo cocinan juntos... y casi siempre se quema algo." },
  { image: "/boda/mem-beach.png", fact: "Aquel atardecer en la playa donde dijeron 'para siempre'." },
  { image: "/boda/mem-concert.png", fact: "Su primer concierto: bailaron toda la noche bajo las luces." },
  { image: "/boda/mem-picnic.png", fact: "Los picnics en el parque son su plan favorito de primavera." },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): MemoryCard[] {
  const doubled = MEMORY_SOURCE.flatMap((m, pairId) => [
    { pairId, image: m.image, fact: m.fact },
    { pairId, image: m.image, fact: m.fact },
  ]);
  return shuffle(doubled).map((c, id) => ({ id, ...c }));
}

export function MemoryGame() {
  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [modal, setModal] = useState<string | null>(null);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    setDeck(buildDeck());
  }, []);

  const reset = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setModal(null);
    setLock(false);
  };

  const handleFlip = (idx: number) => {
    if (lock || flipped.includes(idx) || matched.includes(deck[idx].pairId)) return;
    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = next;
      if (deck[a].pairId === deck[b].pairId) {
        setTimeout(() => {
          setMatched((prev) => [...prev, deck[a].pairId]);
          setModal(deck[a].fact);
          setFlipped([]);
          setLock(false);
        }, 650);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 950);
      }
    }
  };

  const won = matched.length === MEMORY_SOURCE.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Parejas: <span className="font-bold text-primary">{matched.length}</span>/{MEMORY_SOURCE.length}
        </span>
        <span className="text-sm text-muted-foreground">
          Intentos: <span className="font-bold text-primary">{moves}</span>
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 md:gap-3">
        {deck.map((card, idx) => {
          const isUp = flipped.includes(idx) || matched.includes(card.pairId);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(idx)}
              className="relative aspect-square [perspective:1000px]"
              aria-label={isUp ? "Carta descubierta" : "Carta oculta"}
            >
              <div
                className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
                style={{ transform: isUp ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                {/* Back */}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary shadow-md [backface-visibility:hidden]">
                  <Heart className="w-6 h-6 md:w-8 md:h-8 text-secondary fill-secondary/30" />
                </div>
                {/* Front */}
                <div
                  className={`absolute inset-0 overflow-hidden rounded-2xl shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    matched.includes(card.pairId) ? "ring-2 ring-secondary" : ""
                  }`}
                >
                  <Image
                    src={card.image || "/placeholder.svg"}
                    alt="Recuerdo de la pareja"
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-serif text-2xl text-primary">
            ¡Las encontraste todas en {moves} intentos!
          </p>
          <Button variant="outline" onClick={reset} className="rounded-3xl bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Jugar otra vez
          </Button>
        </motion.div>
      )}

      {/* Match fact modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl"
            >
              <button
                onClick={() => setModal(null)}
                aria-label="Cerrar"
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.6 }}
                className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary"
              >
                <Sparkles className="w-7 h-7 text-secondary-foreground" />
              </motion.div>
              <p className="font-serif text-xl text-primary mb-2">¡Correcto!</p>
              <p className="text-muted-foreground text-pretty">{modal}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ Trivia Quiz ============ */
type Question = {
  q: string;
  options: string[];
  correct: number;
};

const QUESTIONS: Question[] = [
  {
    q: "¿Quién se declaró a quién?",
    options: ["Mateo a Elena", "Elena a Mateo", "Los dos a la vez", "El perro Trufa"],
    correct: 1,
  },
  {
    q: "¿A dónde fue su desastroso primer viaje?",
    options: ["París", "La Toscana", "Tailandia", "Benidorm"],
    correct: 1,
  },
  {
    q: "¿Cómo se conocieron?",
    options: ["En el gimnasio", "Una cita a ciegas", "En el trabajo", "Por una app"],
    correct: 1,
  },
  {
    q: "¿Cuál es su plan favorito?",
    options: ["Picnic en el parque", "Maratón de series", "Escalada", "Karaoke"],
    correct: 0,
  },
];

export function TriviaQuiz({ onCorrect }: { onCorrect: () => void }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const lockRef = useRef(false);

  const reset = () => {
    setStep(0);
    setScore(0);
    setSelected(null);
    setShakeIdx(null);
    setFinished(false);
    lockRef.current = false;
  };

  const choose = (i: number) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setSelected(i);
    const correct = i === QUESTIONS[step].correct;

    if (correct) {
      setScore((s) => s + 1);
      onCorrect();
    } else {
      setShakeIdx(i);
    }

    setTimeout(() => {
      if (step + 1 < QUESTIONS.length) {
        setStep((s) => s + 1);
        setSelected(null);
        setShakeIdx(null);
        lockRef.current = false;
      } else {
        setFinished(true);
      }
    }, 1100);
  };

  if (finished) {
    const ratio = score / QUESTIONS.length;
    const level =
      ratio === 1
        ? "Invitado VIP"
        : ratio >= 0.5
        ? "Buen amigo de la pareja"
        : "Viniste por la barra libre";
    const subtitle =
      ratio === 1
        ? "¡Lo sabes absolutamente todo sobre ellos!"
        : ratio >= 0.5
        ? "Los conoces bien, pero hay secretos que se te escapan."
        : "¡Tienes que repasar antes de la boda!";

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary"
        >
          <Trophy className="w-8 h-8 text-secondary" />
        </motion.div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
          Nivel: {score}/{QUESTIONS.length} aciertos
        </p>
        <h3 className="font-serif text-3xl text-primary mb-2">{level}</h3>
        <p className="text-muted-foreground mb-5 text-pretty">{subtitle}</p>
        <Button variant="outline" onClick={reset} className="rounded-3xl bg-transparent">
          <RotateCcw className="w-4 h-4 mr-2" />
          Volver a jugar
        </Button>
      </motion.div>
    );
  }

  const question = QUESTIONS[step];

  return (
    <div>
      {/* progress */}
      <div className="flex gap-1.5 mb-5">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-primary/15"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Pregunta {step + 1} de {QUESTIONS.length}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-primary mb-5 text-balance">
            {question.q}
          </h3>

          <div className="grid gap-3">
            {question.options.map((opt, i) => {
              const isCorrect = selected !== null && i === question.correct;
              const isWrongPick = selected === i && i !== question.correct;
              return (
                <motion.button
                  key={opt}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                  animate={shakeIdx === i ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`flex items-center justify-between rounded-3xl border-2 px-5 py-4 text-left font-semibold transition-colors ${
                    isCorrect
                      ? "border-secondary bg-secondary text-secondary-foreground"
                      : isWrongPick
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <span>{opt}</span>
                  {isCorrect && <Check className="w-5 h-5 shrink-0" />}
                  {isWrongPick && <X className="w-5 h-5 shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
