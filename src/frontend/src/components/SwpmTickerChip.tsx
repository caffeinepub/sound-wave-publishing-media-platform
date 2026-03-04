import { TrendingUp } from "lucide-react";

interface SwpmTickerChipProps {
  className?: string;
}

export default function SwpmTickerChip({
  className = "",
}: SwpmTickerChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-amber-700/50 bg-zinc-900/80 px-3.5 py-1.5 text-xs shadow-sm backdrop-blur-sm ${className}`}
    >
      <TrendingUp className="h-3 w-3 text-amber-400 shrink-0" />
      <span className="font-mono font-bold tracking-widest text-amber-400">
        SWPM
      </span>
      <span className="text-zinc-500">·</span>
      <span className="font-mono text-zinc-300">$1.00</span>
      <span className="text-zinc-500">·</span>
      <span className="text-zinc-400">Privately Held</span>
    </div>
  );
}
