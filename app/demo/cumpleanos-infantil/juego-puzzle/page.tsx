"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Puzzle,
  RotateCcw,
  Trophy,
  Sparkles,
  Eye,
  EyeOff,
  Home,
  PartyPopper,
  Star,
} from "lucide-react";
import Link from "next/link";

// Image URL
const PUZZLE_IMAGE =
  "https://static.vecteezy.com/system/resources/previews/008/414/443/non_2x/children-playground-with-swings-slide-climbing-ladders-and-more-in-the-amusement-park-for-little-ones-to-play-in-flat-cartoon-illustration-vector.jpg";

// Puzzle piece shape types
type TabType = "out" | "in" | "flat";

interface PieceShape {
  top: TabType;
  right: TabType;
  bottom: TabType;
  left: TabType;
}

interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  shape: PieceShape;
  isPlaced: boolean;
}

// Generate puzzle piece SVG path with tabs - adjusted for proper fitting
function generatePiecePath(
  width: number,
  height: number,
  shape: PieceShape,
  tabSize: number
): string {
  const tabDepth = tabSize * 0.7;

  let path = "";

  // Start at top-left corner
  path += `M 0 0`;

  // Top edge
  if (shape.top === "flat") {
    path += ` L ${width} 0`;
  } else {
    const midX = width / 2;
    const dir = shape.top === "out" ? -1 : 1;
    path += ` L ${midX - tabSize} 0`;
    path += ` C ${midX - tabSize * 0.6} ${dir * tabDepth * 0.1}, ${midX - tabSize * 0.6} ${dir * tabDepth * 0.8}, ${midX} ${dir * tabDepth}`;
    path += ` C ${midX + tabSize * 0.6} ${dir * tabDepth * 0.8}, ${midX + tabSize * 0.6} ${dir * tabDepth * 0.1}, ${midX + tabSize} 0`;
    path += ` L ${width} 0`;
  }

  // Right edge
  if (shape.right === "flat") {
    path += ` L ${width} ${height}`;
  } else {
    const midY = height / 2;
    const dir = shape.right === "out" ? 1 : -1;
    path += ` L ${width} ${midY - tabSize}`;
    path += ` C ${width + dir * tabDepth * 0.1} ${midY - tabSize * 0.6}, ${width + dir * tabDepth * 0.8} ${midY - tabSize * 0.6}, ${width + dir * tabDepth} ${midY}`;
    path += ` C ${width + dir * tabDepth * 0.8} ${midY + tabSize * 0.6}, ${width + dir * tabDepth * 0.1} ${midY + tabSize * 0.6}, ${width} ${midY + tabSize}`;
    path += ` L ${width} ${height}`;
  }

  // Bottom edge (right to left)
  if (shape.bottom === "flat") {
    path += ` L 0 ${height}`;
  } else {
    const midX = width / 2;
    const dir = shape.bottom === "out" ? 1 : -1;
    path += ` L ${midX + tabSize} ${height}`;
    path += ` C ${midX + tabSize * 0.6} ${height + dir * tabDepth * 0.1}, ${midX + tabSize * 0.6} ${height + dir * tabDepth * 0.8}, ${midX} ${height + dir * tabDepth}`;
    path += ` C ${midX - tabSize * 0.6} ${height + dir * tabDepth * 0.8}, ${midX - tabSize * 0.6} ${height + dir * tabDepth * 0.1}, ${midX - tabSize} ${height}`;
    path += ` L 0 ${height}`;
  }

  // Left edge (bottom to top)
  if (shape.left === "flat") {
    path += ` L 0 0`;
  } else {
    const midY = height / 2;
    const dir = shape.left === "out" ? -1 : 1;
    path += ` L 0 ${midY + tabSize}`;
    path += ` C ${dir * tabDepth * 0.1} ${midY + tabSize * 0.6}, ${dir * tabDepth * 0.8} ${midY + tabSize * 0.6}, ${dir * tabDepth} ${midY}`;
    path += ` C ${dir * tabDepth * 0.8} ${midY - tabSize * 0.6}, ${dir * tabDepth * 0.1} ${midY - tabSize * 0.6}, 0 ${midY - tabSize}`;
    path += ` L 0 0`;
  }

  path += " Z";
  return path;
}

// Generate puzzle pieces with interlocking shapes
function generatePieces(rows: number, cols: number): PuzzlePiece[] {
  const pieces: PuzzlePiece[] = [];
  const shapes: PieceShape[][] = [];

  // First pass: generate shapes ensuring they interlock
  for (let row = 0; row < rows; row++) {
    shapes[row] = [];
    for (let col = 0; col < cols; col++) {
      const shape: PieceShape = {
        top: row === 0 ? "flat" : shapes[row - 1][col].bottom === "out" ? "in" : "out",
        right: col === cols - 1 ? "flat" : Math.random() > 0.5 ? "out" : "in",
        bottom: row === rows - 1 ? "flat" : Math.random() > 0.5 ? "out" : "in",
        left: col === 0 ? "flat" : shapes[row][col - 1].right === "out" ? "in" : "out",
      };
      shapes[row][col] = shape;
    }
  }

  // Create pieces
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: row * cols + col,
        row,
        col,
        shape: shapes[row][col],
        isPlaced: false,
      });
    }
  }

  return pieces;
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Difficulty configurations
const difficulties = {
  20: { rows: 4, cols: 5, label: "20 piezas" },
  40: { rows: 5, cols: 8, label: "40 piezas" },
  60: { rows: 6, cols: 10, label: "60 piezas" },
};

type DifficultyKey = keyof typeof difficulties;

export default function PuzzleGame() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>(20);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [shuffledPieces, setShuffledPieces] = useState<PuzzlePiece[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [boardDimensions, setBoardDimensions] = useState({ width: 320, height: 256 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { rows, cols } = difficulties[difficulty];

  // Calculate board dimensions based on container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 24; // padding
        const maxWidth = Math.min(containerWidth, 500);
        // Use 4:3 aspect ratio for the image
        const aspectRatio = 4 / 3;
        const width = maxWidth;
        const height = width / aspectRatio;
        setBoardDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const pieceWidth = boardDimensions.width / cols;
  const pieceHeight = boardDimensions.height / rows;
  const tabSize = Math.min(pieceWidth, pieceHeight) * 0.22;

  // Initialize game
  const initGame = useCallback(() => {
    const newPieces = generatePieces(rows, cols);
    setPieces(newPieces);
    setShuffledPieces(shuffleArray(newPieces.map((p) => ({ ...p, isPlaced: false }))));
    setIsComplete(false);
    setGameStarted(true);
    setMoveCount(0);
  }, [rows, cols]);

  // Check if puzzle is complete
  useEffect(() => {
    if (pieces.length > 0 && pieces.every((p) => p.isPlaced)) {
      setIsComplete(true);
    }
  }, [pieces]);

  // Handle piece placement
  const handleDrop = (targetRow: number, targetCol: number) => {
    if (draggedPiece === null) return;

    const piece = shuffledPieces.find((p) => p.id === draggedPiece);
    if (!piece || piece.isPlaced) return;

    // Check if correct position
    if (piece.row === targetRow && piece.col === targetCol) {
      setPieces((prev) =>
        prev.map((p) => (p.id === draggedPiece ? { ...p, isPlaced: true } : p))
      );
      setShuffledPieces((prev) =>
        prev.map((p) => (p.id === draggedPiece ? { ...p, isPlaced: true } : p))
      );
      setMoveCount((prev) => prev + 1);
    }

    setDraggedPiece(null);
  };

  // Render a single puzzle piece SVG
  const renderPieceSVG = (
    piece: PuzzlePiece,
    isInTray: boolean = false
  ) => {
    const extraSpace = tabSize * 1.2;
    const viewBoxX = -extraSpace;
    const viewBoxY = -extraSpace;
    const viewBoxW = pieceWidth + extraSpace * 2;
    const viewBoxH = pieceHeight + extraSpace * 2;

    const clipId = isInTray ? `tray-clip-${piece.id}` : `board-clip-${piece.id}`;

    // Calculate image position to align with the piece's position in the full image
    const imgX = -piece.col * pieceWidth;
    const imgY = -piece.row * pieceHeight;

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`}
        style={{ display: "block" }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={generatePiecePath(pieceWidth, pieceHeight, piece.shape, tabSize)} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <image
            href={PUZZLE_IMAGE}
            x={imgX}
            y={imgY}
            width={boardDimensions.width}
            height={boardDimensions.height}
            preserveAspectRatio="none"
          />
        </g>
        <path
          d={generatePiecePath(pieceWidth, pieceHeight, piece.shape, tabSize)}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
        <path
          d={generatePiecePath(pieceWidth, pieceHeight, piece.shape, tabSize)}
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.5"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50">
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-300" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-5 h-5 text-primary" />
            ) : (
              <PartyPopper className="w-5 h-5 text-orange-400" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg text-primary">Momento Wow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">
              Puzzle Playground
            </span>
          </div>
        </div>
      </header>

      <main ref={containerRef} className="container mx-auto px-4 py-6 max-w-xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            Puzzle del Parque
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Arrastra las piezas al tablero para completar la imagen
          </p>
        </motion.div>

        {/* Game controls */}
        {!gameStarted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Difficulty selection */}
            <Card className="p-6 bg-card shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Elige la dificultad
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(difficulties) as unknown as DifficultyKey[]).map(
                  (key) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(Number(key) as DifficultyKey)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        difficulty === Number(key)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <Puzzle
                        className={`w-8 h-8 mx-auto mb-2 ${
                          difficulty === Number(key)
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {difficulties[Number(key) as DifficultyKey].label}
                      </span>
                    </motion.button>
                  )
                )}
              </div>
            </Card>

            {/* Preview image */}
            <Card className="p-4 bg-card shadow-lg overflow-hidden">
              <h2 className="text-lg font-semibold mb-3 text-center">
                Imagen a completar
              </h2>
              <div className="relative rounded-xl overflow-hidden border-4 border-primary/20">
                <img
                  src={PUZZLE_IMAGE || "/placeholder.svg"}
                  alt="Puzzle preview"
                  className="w-full h-auto"
                  crossOrigin="anonymous"
                />
              </div>
            </Card>

            {/* Start button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={initGame}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Comenzar Puzzle
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Game stats & controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Piezas:{" "}
                  <span className="font-semibold text-foreground">
                    {pieces.filter((p) => p.isPlaced).length}/{pieces.length}
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">
                  Movimientos:{" "}
                  <span className="font-semibold text-foreground">{moveCount}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="guide"
                    checked={showGuide}
                    onCheckedChange={setShowGuide}
                  />
                  <Label htmlFor="guide" className="text-sm flex items-center gap-1">
                    {showGuide ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Guia</span>
                  </Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={initGame}
                  className="gap-1 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </Button>
              </div>
            </div>

            {/* Puzzle board */}
            <Card className="p-3 md:p-4 bg-card shadow-lg">
              <div
                className="relative mx-auto rounded-xl overflow-hidden border-4 border-primary/20 bg-muted/30"
                style={{
                  width: boardDimensions.width,
                  height: boardDimensions.height,
                }}
              >
                {/* Guide image */}
                <AnimatePresence>
                  {showGuide && (
                    <motion.img
                      src={PUZZLE_IMAGE}
                      alt="Guide"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full"
                      style={{ objectFit: "fill" }}
                      crossOrigin="anonymous"
                    />
                  )}
                </AnimatePresence>

                {/* Placed pieces layer - renders all placed pieces */}
                <div className="absolute inset-0">
                  {pieces
                    .filter((p) => p.isPlaced)
                    .map((piece) => {
                      const extraSpace = tabSize * 1.2;
                      return (
                        <motion.div
                          key={`placed-${piece.id}`}
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute"
                          style={{
                            left: piece.col * pieceWidth - extraSpace,
                            top: piece.row * pieceHeight - extraSpace,
                            width: pieceWidth + extraSpace * 2,
                            height: pieceHeight + extraSpace * 2,
                          }}
                        >
                          {renderPieceSVG(piece, false)}
                        </motion.div>
                      );
                    })}
                </div>

                {/* Drop zones grid - invisible but functional */}
                <div
                  className="absolute inset-0 grid"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                  }}
                >
                  {[...Array(rows * cols)].map((_, i) => {
                    const row = Math.floor(i / cols);
                    const col = i % cols;
                    const isOccupied = pieces.find(
                      (p) => p.row === row && p.col === col && p.isPlaced
                    );

                    return (
                      <div
                        key={i}
                        className={`border border-dashed transition-colors ${
                          isOccupied
                            ? "border-transparent"
                            : draggedPiece !== null
                              ? "border-primary/40 bg-primary/5"
                              : "border-primary/15"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (!isOccupied) {
                            e.currentTarget.classList.add("bg-primary/15");
                          }
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove("bg-primary/15");
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove("bg-primary/15");
                          handleDrop(row, col);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Pieces tray */}
            <Card className="p-3 md:p-4 bg-card shadow-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Piezas disponibles ({shuffledPieces.filter((p) => !p.isPlaced).length})
              </h3>
              <div
                className="grid gap-1 max-h-[220px] md:max-h-[300px] overflow-y-auto p-1"
                style={{
                  gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(pieceWidth * 1.4, 55)}px, 1fr))`,
                }}
              >
                {shuffledPieces
                  .filter((p) => !p.isPlaced)
                  .map((piece) => {
                    const extraSpace = tabSize * 1.2;
                    const displayW = pieceWidth + extraSpace * 2;
                    const displayH = pieceHeight + extraSpace * 2;

                    return (
                      <motion.div
                        key={piece.id}
                        draggable
                        onDragStart={() => setDraggedPiece(piece.id)}
                        onDragEnd={() => setDraggedPiece(null)}
                        whileHover={{ scale: 1.08, zIndex: 10 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-grab active:cursor-grabbing relative bg-muted/20 rounded-lg"
                        style={{
                          width: displayW,
                          height: displayH,
                        }}
                      >
                        {renderPieceSVG(piece, true)}
                      </motion.div>
                    );
                  })}
              </div>
            </Card>

            {/* Change difficulty */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGameStarted(false)}
                className="text-muted-foreground"
              >
                Cambiar dificultad
              </Button>
            </div>
          </div>
        )}

        {/* Victory modal */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-card rounded-3xl p-6 md:p-8 shadow-2xl max-w-sm w-full text-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                </motion.div>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                  Felicidades!
                </h2>
                <p className="text-muted-foreground mb-4">
                  Has completado el puzzle en{" "}
                  <span className="font-semibold text-primary">{moveCount}</span>{" "}
                  movimientos
                </p>
                <div className="flex justify-center gap-3">
                  <PartyPopper className="w-6 h-6 text-orange-500" />
                  <Sparkles className="w-6 h-6 text-primary" />
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
                </div>
                <div className="mt-6 space-y-3">
                  <Button onClick={initGame} className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Jugar de nuevo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsComplete(false);
                      setGameStarted(false);
                    }}
                    className="w-full bg-transparent"
                  >
                    Cambiar dificultad
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Creado con{" "}
          <span className="font-serif text-primary">Momento Wow</span>
        </p>
      </footer>
    </div>
  );
}
