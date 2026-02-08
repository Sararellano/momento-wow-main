
"use client";

// Debug: log de estado en cada render
// (debe ir después de imports, así que lo movemos dentro del componente)

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Link from "next/link";
import { Home, Gamepad2, Trophy, Sparkles, PartyPopper, Star } from "lucide-react";

const pastelColors = ["#a7f3d0", "#f3e8ff", "#fef9c3"];
const playerEmojis = ["🟣", "🟢"];
const PLAYER = 0;
const AI = 1;

function checkWinner(board: (number | null)[]): number | "empate" | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a] !== null &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return board.every(cell => cell !== null) ? "empate" : null;
}


export default function JuegoTresEnRaya() {
  const [board, setBoard] = useState<(number | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<0 | 1>(PLAYER); // 0: jugador, 1: IA
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasPlayedWinSound, setHasPlayedWinSound] = useState(false);
  const [message, setMessage] = useState("Tu turno - Haz tu jugada");
  const winner = checkWinner(board);
  const mainRef = useRef<HTMLDivElement>(null);
  const trumpetRef = useRef<HTMLAudioElement>(null);
  const applauseRef = useRef<HTMLAudioElement>(null);

  // Debug: log de estado en cada render
  useEffect(() => {
    // Mostrar el tablero, el turno y el ganador en consola
    console.log("[DEBUG] Board:", board);
    console.log("[DEBUG] Turno actual:", turn === PLAYER ? "Jugador" : "IA");
    console.log("[DEBUG] Winner:", winner);
    if (winner === PLAYER) {
      console.log("[DEBUG] ¡Ha ganado el jugador!");
    } else if (winner === AI) {
      console.log("[DEBUG] ¡Ha ganado la máquina!");
    } else if (winner === "empate") {
      console.log("[DEBUG] ¡Empate!");
    }
  }, [board, turn, winner]);

  useEffect(() => {
    if (mainRef.current) {
      setDimensions({
        width: mainRef.current.offsetWidth,
        height: mainRef.current.offsetHeight,
      });
    }
    const handleResize = () => {
      if (mainRef.current) {
        setDimensions({
          width: mainRef.current.offsetWidth,
          height: mainRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reproducir sonidos de victoria solo una vez por partida
  useEffect(() => {
    if (winner && winner !== "empate" && !hasPlayedWinSound) {
      // URLs de sonidos desde CDN (puedes cambiarlas por otras si prefieres)
      // Trompeta: https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae3b2.mp3
      // Aplausos: https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b7bfa.mp3
      const playSounds = async () => {
        // Proteger refs con condicionales
        if (trumpetRef.current) {
          trumpetRef.current.currentTime = 0;
          trumpetRef.current.play();
          setTimeout(() => {
            if (trumpetRef.current) {
              trumpetRef.current.currentTime = 0;
              trumpetRef.current.play();
            }
          }, 1200);
        }
        setTimeout(() => {
          if (applauseRef.current) {
            applauseRef.current.currentTime = 0;
            applauseRef.current.play();
            setTimeout(() => {
              if (applauseRef.current) {
                applauseRef.current.currentTime = 0;
                applauseRef.current.play();
              }
            }, 1800);
          }
        }, 2400);
      };
      playSounds();
      setHasPlayedWinSound(true);
    }
    if (!winner) {
      setHasPlayedWinSound(false);
    }
  }, [winner, hasPlayedWinSound]);


  // IA simple: elige la primera casilla libre
  function aiMove(currentBoard: (number | null)[]): number {
    // Puedes mejorar la IA aquí (random, minimax, etc)
    const empty = currentBoard.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null) as number[];
    if (empty.length === 0) return -1;
    // Random:
    return empty[Math.floor(Math.random() * empty.length)];
  }

  function handleClick(idx: number) {
    // Si ya hay ganador o empate, no permitir más jugadas
    if (winner) return;
    if (board[idx] || turn !== PLAYER) return;
    const newBoard = [...board];
    newBoard[idx] = PLAYER;
    setBoard(newBoard);
    setTurn(AI);
    setMessage("Turno enemigo...");
  }

  // Efecto: cuando es turno de la IA, que juegue automáticamente
  useEffect(() => {
    // Si hay ganador o empate, no dejar que la IA juegue más ni alternar turnos
    if (winner) {
      if (winner === "empate") setMessage("¡Empate! 😅");
      else setMessage(winner === PLAYER ? "¡Has ganado! 🎉" : "¡La máquina gana! 😢");
      return;
    }
    // Turno de la IA
    if (turn === AI) {
      const timeout = setTimeout(() => {
        // Si hay ganador justo antes de que la IA juegue, no hacer nada
        if (checkWinner(board)) return;
        const idx = aiMove(board);
        if (idx !== -1) {
          const newBoard = [...board];
          newBoard[idx] = AI;
          setBoard(newBoard);
          setTurn(PLAYER);
          setMessage("Tu turno - Haz tu jugada");
        }
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [turn, board, winner]);

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn(PLAYER);
    setHasPlayedWinSound(false);
    setMessage("Tu turno - Haz tu jugada");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-200 via-purple-100 to-yellow-100 flex flex-col">
      {/* Fondo animado con iconos flotantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            {i % 3 === 0 ? (
              <Gamepad2 className="w-6 h-6 text-purple-400 fill-purple-300" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-5 h-5 text-cyan-400" />
            ) : (
              <PartyPopper className="w-5 h-5 text-yellow-400" />
            )}
          </motion.div>
        ))}
      </div>
      {/* Header personalizado */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg text-primary">Momento Wow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-muted-foreground">3 en Raya</span>
          </div>
        </div>
      </header>

      <main ref={mainRef} className="flex flex-col items-center justify-center flex-1 py-8">
        {/* Audios ocultos para efectos */}
        <audio ref={trumpetRef} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae3b2.mp3" preload="auto" />
        <audio ref={applauseRef} src="https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b7bfa.mp3" preload="auto" />
        {winner && winner !== "empate" && (
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            numberOfPieces={180}
            recycle={false}
          />
        )}
        {winner === "empate" && (
          <div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            style={{ top: 0, left: 0 }}
          >
            <span
              className="text-7xl md:text-8xl animate-bounce"
              style={{ filter: "drop-shadow(0 2px 8px #fbbf24)" }}
              role="img"
              aria-label="Empate"
            >
              🎉🤝🎉
            </span>
          </div>
        )}
        <Link
          href="/demo/cumpleanos-infantil"
          className="mb-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold transition-all"
        >
          ← Volver
        </Link>
        <h1 className="text-3xl font-bold text-cyan-900 mb-4 drop-shadow">3 en raya</h1>
        {/* Notificación de turno */}
        <div className="flex justify-center py-2">
          <motion.div
            animate={{ scale: turn === PLAYER ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: turn === PLAYER ? Infinity : 0, duration: 1.5 }}
            className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold shadow-lg ${
              turn === PLAYER
                ? "bg-green-100 text-green-700 border-2 border-green-300"
                : "bg-red-100 text-red-700 border-2 border-red-300"
            }`}
          >
            {turn === PLAYER ? "Tu turno - Haz tu jugada" : "Turno enemigo..."}
          </motion.div>
        </div>
        <div className={`relative`}>
          <div
            className={`grid grid-cols-3 gap-3 bg-white/70 p-6 rounded-3xl shadow-xl transition-opacity duration-300 ${turn === PLAYER && !winner ? '' : 'opacity-40'}`}
            style={{ border: "6px solid #a7f3d0" }}
          >
            {board.map((cell, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleClick(idx)}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-5xl md:text-6xl font-bold shadow-lg focus:outline-none"
                style={{
                  background: pastelColors[idx % pastelColors.length],
                  border: cell !== null ? "3px solid #a3a3a3" : "3px solid #e0e7ef",
                  cursor: cell === null && !winner && turn === PLAYER ? "pointer" : "not-allowed",
                  transition: "background 0.2s, border 0.2s",
                }}
                whileTap={{ scale: 0.9 }}
                disabled={cell !== null || !!winner || turn !== PLAYER}
                tabIndex={winner ? -1 : 0}
              >
                <AnimatePresence>
                  {cell !== null && (
                    <motion.span
                      key={cell}
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      {playerEmojis[cell]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
          {/* Modal de fin de partida */}
          {(winner === "empate" || winner === PLAYER || winner === AI) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 max-w-xs w-full mx-4">
                <div className="text-2xl font-bold text-cyan-900 mb-2 text-center">
                  {winner === PLAYER && "¡Has ganado! 🎉"}
                  {winner === AI && "¡La máquina gana! 😢"}
                  {winner === "empate" && "¡Empate! 😅"}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={reset}
                    className="bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-all"
                  >
                    Jugar de nuevo
                  </button>
                  <Link
                    href="/"
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-all flex items-center justify-center"
                  >
                    Salir
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 text-cyan-700 text-center text-base max-w-md">
          ¡Personaliza este juego cambiando los emojis, colores o añade efectos de confeti con <a href="https://www.npmjs.com/package/react-confetti" className="underline text-purple-600" target="_blank" rel="noopener noreferrer">react-confetti</a> si quieres celebrar la victoria!
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Creado con <span className="font-serif text-primary">Momento Wow</span>
        </p>
      </footer>
    </div>
  );
}
