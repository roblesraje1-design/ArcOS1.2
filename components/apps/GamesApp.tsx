'use client';

import { useState, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { Gamepad2, Trophy, Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import AppIcon from '@/components/AppIcon';

export default function GamesApp() {
  const { webApps, openApp } = useOSStore();
  const [selectedTab, setSelectedTab] = useState<'snake' | '2048' | 'tictactoe' | 'installed'>('snake');

  // Snake Game State
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 8, y: 8 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [snakeScore, setSnakeScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);

  // Tic Tac Toe State
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [tttWinner, setTttWinner] = useState<string | null>(null);

  // Filter custom installed apps that are games
  const installedGames = webApps.filter((app: any) => app.isGame);

  // Snake Loop
  useEffect(() => {
    if (selectedTab !== 'snake' || !isGameRunning || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'RIGHT') head.x += 1;

        // Collision Check
        if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15) {
          setIsGameOver(true);
          return prevSnake;
        }
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat Food
        if (head.x === food.x && head.y === food.y) {
          setSnakeScore((s) => s + 10);
          setFood({
            x: Math.floor(Math.random() * 15),
            y: Math.floor(Math.random() * 15),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [selectedTab, isGameRunning, isGameOver, direction, food]);

  // Keyboard controls for Snake
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedTab !== 'snake') return;
      if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTab, direction]);

  const restartSnake = () => {
    setSnake([{ x: 5, y: 5 }]);
    setFood({ x: 8, y: 8 });
    setDirection('RIGHT');
    setSnakeScore(0);
    setIsGameOver(false);
    setIsGameRunning(true);
  };

  // Tic Tac Toe Move
  const handleTttClick = (idx: number) => {
    if (board[idx] || tttWinner) return;
    const nextBoard = [...board];
    nextBoard[idx] = isXTurn ? 'X' : 'O';
    setBoard(nextBoard);

    // Check winner
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[a] === nextBoard[c]) {
        setTttWinner(nextBoard[a]);
        return;
      }
    }

    if (!nextBoard.includes(null)) {
      setTttWinner('Draw');
    } else {
      setIsXTurn(!isXTurn);
    }
  };

  const restartTtt = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setTttWinner(null);
  };

  return (
    <div className="h-full w-full bg-zinc-950 text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Header Bar */}
      <div className="bg-zinc-900 border-b border-white/10 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <Gamepad2 size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Arc Arcade & Games</h2>
            <p className="text-[10px] text-zinc-400">Play built-in retro titles and installed web games</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setSelectedTab('snake')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedTab === 'snake' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            🐍 Snake
          </button>
          <button
            onClick={() => setSelectedTab('tictactoe')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedTab === 'tictactoe' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            ❌ Tic Tac Toe
          </button>
          <button
            onClick={() => setSelectedTab('installed')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedTab === 'installed' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            🎮 My Games ({installedGames.length})
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto">
        {selectedTab === 'snake' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-between w-full max-w-sm px-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <Trophy size={16} />
                <span>Score: {snakeScore}</span>
              </div>
              <button
                onClick={restartSnake}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
              >
                <RotateCcw size={13} />
                <span>Restart</span>
              </button>
            </div>

            {/* Snake Grid Board */}
            <div className="relative w-80 h-80 bg-zinc-900 border-2 border-rose-500/40 rounded-2xl grid grid-cols-15 grid-rows-15 p-1 shadow-2xl">
              {Array.from({ length: 225 }).map((_, i) => {
                const x = i % 15;
                const y = Math.floor(i / 15);
                const isSnakeHead = snake[0].x === x && snake[0].y === y;
                const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={i}
                    className={`rounded-sm transition-all ${
                      isSnakeHead
                        ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.9)]'
                        : isSnakeBody
                        ? 'bg-rose-600'
                        : isFood
                        ? 'bg-amber-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                        : 'bg-zinc-950/40'
                    }`}
                  />
                );
              })}

              {/* Game Over / Start Screen */}
              {(!isGameRunning || isGameOver) && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-4">
                  <h3 className="text-xl font-black text-rose-400 mb-1">
                    {isGameOver ? 'GAME OVER' : 'ARCADE SNAKE'}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    {isGameOver ? `Final Score: ${snakeScore}` : 'Use Arrow keys or buttons to navigate'}
                  </p>
                  <button
                    onClick={restartSnake}
                    className="px-6 py-2.5 bg-gradient-to-tr from-rose-600 to-amber-500 rounded-xl text-white font-bold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <Play size={15} />
                    <span>{isGameOver ? 'Play Again' : 'Start Game'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* D-Pad Controls */}
            <div className="grid grid-cols-3 gap-1.5 w-36 pt-2">
              <div />
              <button
                onClick={() => direction !== 'DOWN' && setDirection('UP')}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-rose-600 rounded-xl flex justify-center text-white"
              >
                <ArrowUp size={16} />
              </button>
              <div />
              <button
                onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-rose-600 rounded-xl flex justify-center text-white"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => direction !== 'UP' && setDirection('DOWN')}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-rose-600 rounded-xl flex justify-center text-white"
              >
                <ArrowDown size={16} />
              </button>
              <button
                onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-rose-600 rounded-xl flex justify-center text-white"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {selectedTab === 'tictactoe' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-sm font-bold text-indigo-300">
              {tttWinner
                ? tttWinner === 'Draw'
                  ? "It's a Draw!"
                  : `Winner: ${tttWinner} 🎉`
                : `Current Turn: ${isXTurn ? 'X' : 'O'}`}
            </div>

            <div className="grid grid-cols-3 gap-2 w-72 h-72 bg-zinc-900 border-2 border-indigo-500/40 p-3 rounded-2xl shadow-2xl">
              {board.map((cell, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTttClick(idx)}
                  className="bg-zinc-950 hover:bg-indigo-950 rounded-xl text-3xl font-black flex items-center justify-center transition-colors border border-white/5"
                >
                  <span className={cell === 'X' ? 'text-indigo-400' : 'text-rose-400'}>{cell}</span>
                </button>
              ))}
            </div>

            <button
              onClick={restartTtt}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg flex items-center space-x-1.5"
            >
              <RotateCcw size={14} />
              <span>Reset Board</span>
            </button>
          </div>
        )}

        {selectedTab === 'installed' && (
          <div className="w-full max-w-xl flex flex-col items-center">
            {installedGames.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <Gamepad2 size={48} className="mx-auto mb-3 opacity-30 text-amber-400" />
                <h4 className="text-base font-bold text-zinc-300">No Installed Games Yet</h4>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  When creating or installing apps in iFrame Studio or App Installer, check &quot;Categorize as Game&quot; to add them here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                {installedGames.map((game: any) => (
                  <div
                    key={game.id}
                    onClick={() => openApp(game.id, game.name, { url: game.url })}
                    className="group bg-zinc-900/80 border border-white/10 hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer transition-all hover:-translate-y-1 shadow-xl"
                  >
                    <AppIcon appId={game.id} size="lg" customBgGradient={game.bgGradient} />
                    <span className="text-xs font-bold text-white mt-2 group-hover:text-amber-300 truncate w-full">
                      {game.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono mt-0.5">Installed Game</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
