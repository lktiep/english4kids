"use client";

import { GameProvider } from "@/app/context/GameContext";
import HomePage from "@/app/components/HomePage";

export default function LearnEnglishPage() {
  return (
    <GameProvider>
      <HomePage />
    </GameProvider>
  );
}
