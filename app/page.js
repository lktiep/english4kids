"use client";

import { GameProvider } from "@/app/context/GameContext";
import HomePage from "@/app/components/HomePage";

export default function Page() {
  return (
    <GameProvider>
      <HomePage />
    </GameProvider>
  );
}
