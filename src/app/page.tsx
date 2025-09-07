"use client";
import { useState, useEffect } from "react";
import "./globals.css";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: 1 };

export default function Home() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const newHead = {
          x: (prev[0].x + direction.x + BOARD_SIZE) % BOARD_SIZE,
          y: (prev[0].y + direction.y + BOARD_SIZE) % BOARD_SIZE,
        };

        // Check collision with self
        if (
          prev.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prev;
        }

        let newSnake = [newHead, ...prev];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          spawnFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && direction.y !== 1)
        setDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && direction.y !== -1)
        setDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && direction.x !== 1)
        setDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && direction.x !== -1)
        setDirection({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  const spawnFood = (snake: { x: number; y: number }[]) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    setFood(newFood);
  };

  return (
    <div className="container">
      <h1>Snake Game</h1>
      {gameOver && (
        <div className="game-over">Game Over! Press F5 to restart</div>
      )}
      <div
        className="board"
        style={{
          gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
        }}
      >
        {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
          const x = i % BOARD_SIZE;
          const y = Math.floor(i / BOARD_SIZE);
          const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={`cell ${isSnake ? "snake" : ""} ${
                isFood ? "food" : ""
              }`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
