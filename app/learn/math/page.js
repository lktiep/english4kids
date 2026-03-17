"use client";

import { GameProvider } from "@/app/context/GameContext";
import MathHomePage from "@/app/components/MathHomePage";

export default function LearnMathPage() {
  return (
    <GameProvider>
      <MathHomePage />
    </GameProvider>
  );
}
