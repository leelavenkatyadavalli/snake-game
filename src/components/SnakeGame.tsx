import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 5;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        setDirection(currentDir);

        const newHead = { ...head };
        if (currentDir === 'UP') newHead.y -= 1;
        if (currentDir === 'DOWN') newHead.y += 1;
        if (currentDir === 'LEFT') newHead.x -= 1;
        if (currentDir === 'RIGHT') newHead.x += 1;

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, isGameOver, isPaused, speed, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto relative group">
      {/* Game Header Overlay */}
      <div className="absolute top-4 right-4 z-20 font-mono text-xs text-neon-lime bg-black/50 px-3 py-2 rounded border border-neon-lime">
        STATUS: IN_GAME
      </div>

      <div className="flex justify-between items-end w-full mb-6 px-4">
        <div className="flex flex-col gap-1 w-full flex-row justify-between">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-[2px] text-white/50">Score</span>
            <span className="text-2xl font-mono text-neon-lime drop-shadow-[0_0_5px_var(--color-neon-lime)]">{score.toString().padStart(5, '0')}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase tracking-[2px] text-white/50">Highest</span>
            <span className="text-2xl font-mono text-neon-lime drop-shadow-[0_0_5px_var(--color-neon-lime)]">{highScore.toString().padStart(5, '0')}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-transparent border border-white/5 overflow-hidden w-full max-w-[480px] aspect-square"
      >
        <div 
          className="absolute inset-0"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            let bgClass = "bg-transparent border border-white/5";
            let shadowClass = "";
            let scaleClass = "";

            if (isHead) {
              bgClass = "bg-white z-10 border-none";
            } else if (isSnake) {
              bgClass = "bg-neon-lime border-none";
              shadowClass = "shadow-[0_0_10px_var(--color-neon-lime)]";
            } else if (isFood) {
              bgClass = "bg-neon-magenta border-none";
              shadowClass = "shadow-[0_0_15px_var(--color-neon-magenta)]";
              scaleClass = "scale-[0.7] rounded-full animate-pulse";
            }

            return (
              <div 
                key={index}
                className={`w-full h-full transition-all duration-75 ${bgClass} ${shadowClass} ${scaleClass}`}
                style={isSnake && !isHead ? { borderRadius: '2px' } : {}}
              />
            );
          })}
        </div>
        
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in zoom-in duration-300 z-30">
            <h3 className="text-4xl font-bold text-neon-magenta drop-shadow-[0_0_10px_var(--color-neon-magenta)] mb-2 font-mono">CRASHED</h3>
            <p className="text-neon-lime mb-6 font-mono text-xl">Score: {score}</p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan/20 transition-all font-bold tracking-[2px] text-sm uppercase"
            >
              <RotateCcw size={16} />
              Reboot System
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-30">
            <h3 className="text-2xl font-bold text-white tracking-[4px] animate-pulse font-mono border-y border-white/20 py-4 w-full text-center bg-black/40">SYSTEM PAUSED</h3>
          </div>
        )}
      </div>
    </div>
  );
}
