import GameBoard from '@/components/game/GameBoard';

export default function Home() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">Dam Haji</h1>
      <div className="rounded-lg border bg-card p-8 shadow-lg">
        <GameBoard />
      </div>
    </div>
  );
}
