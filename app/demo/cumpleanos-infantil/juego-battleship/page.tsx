"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Ship,
  RotateCcw,
  Trophy,
  Home,
  Star,
  Anchor,
  Waves,
  Target,
  Flame,
  RotateCw,
  Play,
  Skull,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// Types
type CellState = "empty" | "ship" | "hit" | "miss" | "sunk";

interface Cell {
  state: CellState;
  shipId?: number;
}

interface ShipType {
  id: number;
  name: string;
  size: number;
  placed: boolean;
  positions: { row: number; col: number }[];
  sunk: boolean;
}

type Orientation = "horizontal" | "vertical";

// Ship configurations
const SHIPS_CONFIG = [
  { id: 1, name: "Portaaviones", size: 5 },
  { id: 2, name: "Acorazado", size: 4 },
  { id: 3, name: "Crucero", size: 3 },
  { id: 4, name: "Submarino", size: 3 },
  { id: 5, name: "Destructor", size: 2 },
];

const BOARD_SIZE = 10;

// Create empty board
function createEmptyBoard(): Cell[][] {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({ state: "empty" as CellState }))
    );
}

// Check if ship can be placed
function canPlaceShip(
  board: Cell[][],
  row: number,
  col: number,
  size: number,
  orientation: Orientation
): boolean {
  for (let i = 0; i < size; i++) {
    const r = orientation === "horizontal" ? row : row + i;
    const c = orientation === "horizontal" ? col + i : col;

    if (r >= BOARD_SIZE || c >= BOARD_SIZE) return false;
    if (board[r][c].state === "ship") return false;

    // Check adjacent cells
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
          if (board[nr][nc].state === "ship") return false;
        }
      }
    }
  }
  return true;
}

// Place ship on board
function placeShip(
  board: Cell[][],
  row: number,
  col: number,
  ship: ShipType,
  orientation: Orientation
): { board: Cell[][]; positions: { row: number; col: number }[] } {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const positions: { row: number; col: number }[] = [];

  for (let i = 0; i < ship.size; i++) {
    const r = orientation === "horizontal" ? row : row + i;
    const c = orientation === "horizontal" ? col + i : col;
    newBoard[r][c] = { state: "ship", shipId: ship.id };
    positions.push({ row: r, col: c });
  }

  return { board: newBoard, positions };
}

// AI: Place ships randomly
function placeShipsRandomly(): { board: Cell[][]; ships: ShipType[] } {
  let board = createEmptyBoard();
  const ships: ShipType[] = SHIPS_CONFIG.map((s) => ({
    ...s,
    placed: false,
    positions: [],
    sunk: false,
  }));

  for (const ship of ships) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const orientation: Orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
      const maxRow = orientation === "horizontal" ? BOARD_SIZE : BOARD_SIZE - ship.size;
      const maxCol = orientation === "horizontal" ? BOARD_SIZE - ship.size : BOARD_SIZE;
      const row = Math.floor(Math.random() * maxRow);
      const col = Math.floor(Math.random() * maxCol);

      if (canPlaceShip(board, row, col, ship.size, orientation)) {
        const result = placeShip(board, row, col, ship, orientation);
        board = result.board;
        ship.positions = result.positions;
        ship.placed = true;
        placed = true;
      }
      attempts++;
    }
  }

  return { board, ships };
}

// AI: Smart attack logic
interface AIState {
  mode: "hunt" | "target";
  hitStack: { row: number; col: number }[];
  lastHit: { row: number; col: number } | null;
  direction: "up" | "down" | "left" | "right" | null;
}

function getAIAttack(
  board: Cell[][],
  aiState: AIState
): { row: number; col: number; newState: AIState } {
  const availableCells: { row: number; col: number }[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c].state === "empty" || board[r][c].state === "ship") {
        availableCells.push({ row: r, col: c });
      }
    }
  }

  if (availableCells.length === 0) {
    return { row: 0, col: 0, newState: aiState };
  }

  // Target mode: follow up on hits
  if (aiState.mode === "target" && aiState.hitStack.length > 0) {
    const lastHit = aiState.hitStack[aiState.hitStack.length - 1];
    const directions = [
      { dr: -1, dc: 0, name: "up" as const },
      { dr: 1, dc: 0, name: "down" as const },
      { dr: 0, dc: -1, name: "left" as const },
      { dr: 0, dc: 1, name: "right" as const },
    ];

    // Try to continue in the same direction if we have one
    if (aiState.direction) {
      const dir = directions.find((d) => d.name === aiState.direction);
      if (dir) {
        const nr = lastHit.row + dir.dr;
        const nc = lastHit.col + dir.dc;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          (board[nr][nc].state === "empty" || board[nr][nc].state === "ship")
        ) {
          return { row: nr, col: nc, newState: aiState };
        }
      }
    }

    // Try adjacent cells
    for (const dir of directions) {
      const nr = lastHit.row + dir.dr;
      const nc = lastHit.col + dir.dc;
      if (
        nr >= 0 &&
        nr < BOARD_SIZE &&
        nc >= 0 &&
        nc < BOARD_SIZE &&
        (board[nr][nc].state === "empty" || board[nr][nc].state === "ship")
      ) {
        return {
          row: nr,
          col: nc,
          newState: { ...aiState, direction: dir.name },
        };
      }
    }

    // No valid adjacent cells, pop from stack and try again
    const newStack = aiState.hitStack.slice(0, -1);
    if (newStack.length > 0) {
      return getAIAttack(board, {
        ...aiState,
        hitStack: newStack,
        direction: null,
      });
    }

    // Back to hunt mode
    aiState = { mode: "hunt", hitStack: [], lastHit: null, direction: null };
  }

  // Hunt mode: random attack with checkerboard pattern preference
  const checkerboardCells = availableCells.filter(
    (c) => (c.row + c.col) % 2 === 0
  );
  const targetCells = checkerboardCells.length > 0 ? checkerboardCells : availableCells;
  const randomIndex = Math.floor(Math.random() * targetCells.length);
  const target = targetCells[randomIndex];

  return { row: target.row, col: target.col, newState: aiState };
}

export default function BattleshipGame() {
  // Game state
  const [gamePhase, setGamePhase] = useState<"setup" | "playing" | "gameover">("setup");
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);

  // Player state
  const [playerBoard, setPlayerBoard] = useState<Cell[][]>(createEmptyBoard);
  const [playerShips, setPlayerShips] = useState<ShipType[]>(
    SHIPS_CONFIG.map((s) => ({ ...s, placed: false, positions: [], sunk: false }))
  );
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [previewCells, setPreviewCells] = useState<{ row: number; col: number; valid: boolean }[]>([]);

  // AI state
  const [aiBoard, setAiBoard] = useState<Cell[][]>(createEmptyBoard);
  const [aiShips, setAiShips] = useState<ShipType[]>([]);
  const [aiState, setAiState] = useState<AIState>({
    mode: "hunt",
    hitStack: [],
    lastHit: null,
    direction: null,
  });

  // Turn state
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [lastAttack, setLastAttack] = useState<{ row: number; col: number; result: "hit" | "miss" | "sunk" } | null>(null);
  const [message, setMessage] = useState("Coloca tus barcos en el tablero");

  // Initialize AI board when game starts
  const startGame = useCallback(() => {
    if (playerShips.some((s) => !s.placed)) {
      setMessage("Debes colocar todos tus barcos primero");
      return;
    }

    const { board, ships } = placeShipsRandomly();
    setAiBoard(board);
    setAiShips(ships);
    setGamePhase("playing");
    setIsPlayerTurn(true);
    setMessage("Tu turno - Ataca el tablero enemigo");
  }, [playerShips]);

  // Handle ship placement preview
  const handlePlacementHover = (row: number, col: number) => {
    if (!selectedShip || gamePhase !== "setup") return;

    const cells: { row: number; col: number; valid: boolean }[] = [];
    const valid = canPlaceShip(playerBoard, row, col, selectedShip.size, orientation);

    for (let i = 0; i < selectedShip.size; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;
      if (r < BOARD_SIZE && c < BOARD_SIZE) {
        cells.push({ row: r, col: c, valid });
      }
    }

    setPreviewCells(cells);
  };

  // Handle ship placement
  const handlePlaceShip = (row: number, col: number) => {
    if (!selectedShip || gamePhase !== "setup") return;

    if (!canPlaceShip(playerBoard, row, col, selectedShip.size, orientation)) {
      setMessage("No puedes colocar el barco aqui");
      return;
    }

    const result = placeShip(playerBoard, row, col, selectedShip, orientation);
    setPlayerBoard(result.board);
    setPlayerShips((prev) =>
      prev.map((s) =>
        s.id === selectedShip.id ? { ...s, placed: true, positions: result.positions } : s
      )
    );
    setSelectedShip(null);
    setPreviewCells([]);

    const remainingShips = playerShips.filter((s) => !s.placed && s.id !== selectedShip.id);
    if (remainingShips.length === 0) {
      setMessage("Todos los barcos colocados. Pulsa Comenzar Batalla");
    } else {
      setMessage(`Coloca tu ${remainingShips[0].name}`);
    }
  };

  // Check if ship is sunk
  const checkShipSunk = (
    board: Cell[][],
    ships: ShipType[],
    shipId: number
  ): boolean => {
    const ship = ships.find((s) => s.id === shipId);
    if (!ship) return false;

    return ship.positions.every(
      (pos) => board[pos.row][pos.col].state === "hit" || board[pos.row][pos.col].state === "sunk"
    );
  };

  // Mark ship as sunk
  const markShipAsSunk = (
    board: Cell[][],
    ships: ShipType[],
    shipId: number
  ): { board: Cell[][]; ships: ShipType[] } => {
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    const newShips = ships.map((s) => ({ ...s }));

    const ship = newShips.find((s) => s.id === shipId);
    if (ship) {
      ship.sunk = true;
      for (const pos of ship.positions) {
        newBoard[pos.row][pos.col].state = "sunk";
      }
    }

    return { board: newBoard, ships: newShips };
  };

  // Player attacks AI
  const handlePlayerAttack = (row: number, col: number) => {
    if (gamePhase !== "playing" || !isPlayerTurn) return;

    const cell = aiBoard[row][col];
    if (cell.state === "hit" || cell.state === "miss" || cell.state === "sunk") {
      setMessage("Ya atacaste ahi. Elige otra celda.");
      return;
    }

    const newBoard = aiBoard.map((r) => r.map((c) => ({ ...c })));
    let result: "hit" | "miss" | "sunk" = "miss";

    if (cell.state === "ship") {
      newBoard[row][col].state = "hit";
      result = "hit";

      if (cell.shipId && checkShipSunk(newBoard, aiShips, cell.shipId)) {
        const sunkResult = markShipAsSunk(newBoard, aiShips, cell.shipId);
        setAiBoard(sunkResult.board);
        setAiShips(sunkResult.ships);
        result = "sunk";

        const ship = aiShips.find((s) => s.id === cell.shipId);
        setMessage(`Hundiste el ${ship?.name}!`);

        // Check for win
        const allSunk = sunkResult.ships.every((s) => s.sunk);
        if (allSunk) {
          setWinner("player");
          setGamePhase("gameover");
          return;
        }
      } else {
        setAiBoard(newBoard);
        setMessage("Tocado! Sigue atacando.");
      }

      setLastAttack({ row, col, result });
      // Player gets another turn on hit
    } else {
      newBoard[row][col].state = "miss";
      setAiBoard(newBoard);
      setMessage("Agua! Turno del enemigo...");
      setLastAttack({ row, col, result: "miss" });
      setIsPlayerTurn(false);
    }
  };

  // AI attacks player
  useEffect(() => {
    if (gamePhase !== "playing" || isPlayerTurn) return;

    const timeout = setTimeout(() => {
      const { row, col, newState } = getAIAttack(playerBoard, aiState);
      const cell = playerBoard[row][col];

      const newBoard = playerBoard.map((r) => r.map((c) => ({ ...c })));
      let hitShip = false;

      if (cell.state === "ship") {
        newBoard[row][col].state = "hit";
        hitShip = true;

        if (cell.shipId && checkShipSunk(newBoard, playerShips, cell.shipId)) {
          const sunkResult = markShipAsSunk(newBoard, playerShips, cell.shipId);
          setPlayerBoard(sunkResult.board);
          setPlayerShips(sunkResult.ships);

          const ship = playerShips.find((s) => s.id === cell.shipId);
          setMessage(`El enemigo hundio tu ${ship?.name}!`);

          // Reset AI targeting
          setAiState({
            mode: "hunt",
            hitStack: [],
            lastHit: null,
            direction: null,
          });

          // Check for loss
          const allSunk = sunkResult.ships.every((s) => s.sunk);
          if (allSunk) {
            setWinner("ai");
            setGamePhase("gameover");
            return;
          }
        } else {
          setPlayerBoard(newBoard);
          setMessage("El enemigo te dio! Sigue atacando...");

          // Update AI state for targeting
          setAiState({
            ...newState,
            mode: "target",
            hitStack: [...newState.hitStack, { row, col }],
            lastHit: { row, col },
          });
        }
      } else {
        newBoard[row][col].state = "miss";
        setPlayerBoard(newBoard);
        setMessage("El enemigo fallo! Tu turno.");
        setAiState(newState);
      }

      if (!hitShip) {
        setIsPlayerTurn(true);
      } else {
        // AI gets another turn on hit
        setIsPlayerTurn(false);
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [isPlayerTurn, gamePhase, playerBoard, playerShips, aiState]);

  // Auto-place ships for player
  const autoPlaceShips = () => {
    const { board, ships } = placeShipsRandomly();
    // Map to player ships format
    const newPlayerShips = ships.map((s, i) => ({
      ...SHIPS_CONFIG[i],
      placed: true,
      positions: s.positions,
      sunk: false,
    }));
    setPlayerBoard(board);
    setPlayerShips(newPlayerShips);
    setSelectedShip(null);
    setPreviewCells([]);
    setMessage("Barcos colocados automaticamente. Pulsa Comenzar Batalla");
  };

  // Reset game
  const resetGame = () => {
    setPlayerBoard(createEmptyBoard());
    setPlayerShips(
      SHIPS_CONFIG.map((s) => ({ ...s, placed: false, positions: [], sunk: false }))
    );
    setAiBoard(createEmptyBoard());
    setAiShips([]);
    setAiState({ mode: "hunt", hitStack: [], lastHit: null, direction: null });
    setSelectedShip(null);
    setPreviewCells([]);
    setOrientation("horizontal");
    setIsPlayerTurn(true);
    setLastAttack(null);
    setWinner(null);
    setGamePhase("setup");
    setMessage("Coloca tus barcos en el tablero");
  };

  // Render cell
  const renderCell = (
    cell: Cell,
    row: number,
    col: number,
    isEnemy: boolean,
    onClick?: () => void
  ) => {
    const isPreview = previewCells.some((c) => c.row === row && c.col === col);
    const previewCell = previewCells.find((c) => c.row === row && c.col === col);
    const isLastAttack = lastAttack?.row === row && lastAttack?.col === col && isEnemy;

    let bgClass = "bg-blue-100";
    let content = null;

    if (cell.state === "ship" && !isEnemy) {
      bgClass = "bg-slate-400";
    } else if (cell.state === "hit") {
      bgClass = "bg-red-400";
      content = <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-200" />;
    } else if (cell.state === "miss") {
      bgClass = "bg-blue-300";
      content = <Waves className="w-3 h-3 md:w-4 md:h-4 text-blue-100" />;
    } else if (cell.state === "sunk") {
      bgClass = "bg-red-600";
      content = <Skull className="w-4 h-4 md:w-5 md:h-5 text-white" />;
    }

    if (isPreview) {
      bgClass = previewCell?.valid ? "bg-green-300" : "bg-red-300";
    }

    return (
      <motion.button
        key={`${row}-${col}`}
        className={`aspect-square rounded-sm md:rounded border border-blue-200/50 flex items-center justify-center transition-all ${bgClass} ${
          onClick && !isPreview ? "hover:bg-blue-200 cursor-crosshair" : ""
        } ${isEnemy && gamePhase === "playing" && isPlayerTurn ? "hover:ring-2 hover:ring-primary" : ""}`}
        onClick={onClick}
        onMouseEnter={() => !isEnemy && gamePhase === "setup" && handlePlacementHover(row, col)}
        whileHover={onClick ? { scale: 1.1 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
        animate={isLastAttack ? { scale: [1, 1.3, 1] } : {}}
        disabled={!onClick}
      >
        {content}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-teal-50">
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
            {i % 4 === 0 ? (
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-300" />
            ) : i % 4 === 1 ? (
              <Anchor className="w-5 h-5 text-blue-400" />
            ) : i % 4 === 2 ? (
              <Ship className="w-5 h-5 text-slate-500" />
            ) : (
              <Waves className="w-5 h-5 text-cyan-400" />
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
            <Ship className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">
              Hundir la Flota
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 py-4 md:py-6 max-w-2xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 md:mb-6"
        >
          <h1 className="font-serif text-2xl md:text-4xl text-foreground mb-1 md:mb-2">
            Hundir la Flota
          </h1>
          <p className="text-muted-foreground text-xs md:text-base">
            Destruye todos los barcos enemigos antes de que hundan los tuyos
          </p>
        </motion.div>

        {/* Message bar */}
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className={`p-3 text-center text-sm font-medium ${
            message.includes("Hundiste") || message.includes("Tocado")
              ? "bg-green-100 text-green-700 border-green-200"
              : message.includes("enemigo") && message.includes("dio")
                ? "bg-red-100 text-red-700 border-red-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            {message}
          </Card>
        </motion.div>

        {/* Setup phase */}
        {gamePhase === "setup" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Ship selection */}
            <Card className="p-3 md:p-4">
              <h2 className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
                <Ship className="w-4 h-4 text-blue-500" />
                Selecciona un barco
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {playerShips.map((ship) => (
                  <motion.button
                    key={ship.id}
                    whileHover={{ scale: ship.placed ? 1 : 1.02 }}
                    whileTap={{ scale: ship.placed ? 1 : 0.98 }}
                    onClick={() => !ship.placed && setSelectedShip(ship)}
                    disabled={ship.placed}
                    className={`p-2 md:p-3 rounded-xl border-2 text-left transition-all ${
                      ship.placed
                        ? "opacity-50 cursor-not-allowed border-muted bg-muted/30"
                        : selectedShip?.id === ship.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs md:text-sm font-medium">{ship.name}</div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(ship.size)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-2 md:w-5 md:h-3 rounded-sm ${
                            ship.placed ? "bg-slate-300" : "bg-slate-500"
                          }`}
                        />
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Orientation toggle */}
              {selectedShip && (
                <div className="mt-3 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOrientation((o) => o === "horizontal" ? "vertical" : "horizontal")}
                    className="gap-2 bg-transparent"
                  >
                    <RotateCw className="w-4 h-4" />
                    {orientation === "horizontal" ? "Horizontal" : "Vertical"}
                  </Button>
                </div>
              )}
            </Card>

            {/* Player board for setup - fixed 320x320 size */}
            <Card className="p-4 md:p-8">
              <h2 className="text-base md:text-lg font-semibold mb-4 text-center">Tu tablero</h2>
              <div
                className="grid mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                  width: "320px",
                  height: "320px",
                  gap: "2px",
                }}
                onMouseLeave={() => setPreviewCells([])}
              >
                {playerBoard.map((row, r) =>
                  row.map((cell, c) =>
                    renderCell(cell, r, c, false, () => handlePlaceShip(r, c))
                  )
                )}
              </div>
            </Card>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={autoPlaceShips}
                className="flex-1 gap-2 bg-transparent"
              >
                <Sparkles className="w-4 h-4" />
                Colocar automaticamente
              </Button>
              <Button
                onClick={startGame}
                disabled={playerShips.some((s) => !s.placed)}
                className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Play className="w-4 h-4" />
                Comenzar Batalla
              </Button>
            </div>
          </motion.div>
        )}

        {/* Playing phase */}
        {gamePhase === "playing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Enemy board */}
            <Card className={`p-4 md:p-6 transition-opacity duration-300 ${!isPlayerTurn ? "opacity-40" : ""}`}>
              <h2 className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-red-500" />
                Tablero Enemigo
                <span className="ml-auto text-xs text-muted-foreground">
                  Barcos: {aiShips.filter((s) => !s.sunk).length}/{aiShips.length}
                </span>
              </h2>
              <div
                className="grid gap-1 md:gap-1.5 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                  maxWidth: "400px",
                }}
              >
                {aiBoard.map((row, r) =>
                  row.map((cell, c) => {
                    const canAttack =
                      isPlayerTurn &&
                      cell.state !== "hit" &&
                      cell.state !== "miss" &&
                      cell.state !== "sunk";
                    return renderCell(
                      { ...cell, state: cell.state === "ship" ? "empty" : cell.state },
                      r,
                      c,
                      true,
                      canAttack ? () => handlePlayerAttack(r, c) : undefined
                    );
                  })
                )}
              </div>
            </Card>

            {/* Turn indicator - between boards */}
            <div className="flex justify-center py-2">
              <motion.div
                animate={{
                  scale: isPlayerTurn ? [1, 1.05, 1] : 1,
                }}
                transition={{ repeat: isPlayerTurn ? Infinity : 0, duration: 1.5 }}
                className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold shadow-lg ${
                  isPlayerTurn
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-red-100 text-red-700 border-2 border-red-300"
                }`}
              >
                {isPlayerTurn ? "Tu turno - Ataca!" : "Turno enemigo..."}
              </motion.div>
            </div>

            {/* Player board */}
            <Card className={`p-4 md:p-6 transition-opacity duration-300 ${isPlayerTurn ? "opacity-40" : ""}`}>
              <h2 className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
                <Anchor className="w-4 h-4 text-blue-500" />
                Tu Tablero
                <span className="ml-auto text-xs text-muted-foreground">
                  Barcos: {playerShips.filter((s) => !s.sunk).length}/{playerShips.length}
                </span>
              </h2>
              <div
                className="grid gap-1 md:gap-1.5 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                  maxWidth: "350px",
                }}
              >
                {playerBoard.map((row, r) =>
                  row.map((cell, c) => renderCell(cell, r, c, false))
                )}
              </div>
            </Card>

            {/* Restart button */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={resetGame} className="gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Game over modal */}
        <AnimatePresence>
          {gamePhase === "gameover" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-card rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: winner === "player" ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{ duration: 0.5, repeat: winner === "player" ? Infinity : 0, repeatDelay: 1 }}
                >
                  {winner === "player" ? (
                    <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto text-yellow-500" />
                  ) : (
                    <Skull className="w-16 h-16 md:w-20 md:h-20 mx-auto text-red-500" />
                  )}
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
                  {winner === "player" ? "Victoria!" : "Derrota"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {winner === "player"
                    ? "Has hundido toda la flota enemiga!"
                    : "El enemigo ha destruido tu flota"}
                </p>

                <div className="flex flex-col gap-3">
                  <Button onClick={resetGame} className="w-full gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Jugar de nuevo
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Salir
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Anchor className="w-4 h-4 text-blue-400" />
            </motion.div>
            <span className="font-serif text-lg text-primary">Momento Wow</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Ship className="w-4 h-4 text-slate-400" />
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground">
            Invitaciones web interactivas que no se olvidan
          </p>
        </div>
      </footer>
    </div>
  );
}
