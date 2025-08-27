import { cn } from "@/lib/utils"
import type { Word } from "@/types/meeting-data"

interface HighlightedWordProps {
  word: Word
  isActive: boolean
  isNext?: boolean
  isPrevious?: boolean
  onWordClick: (startTime: number) => void
}

export default function HighlightedWord({
  word,
  isActive,
  isNext,
  isPrevious,
  onWordClick
}: HighlightedWordProps) {
  return (
    <button
      type="button"
      onClick={() => onWordClick?.(word.start_time)}
      className={cn(
        "inline-block cursor-pointer px-0.5 text-md hover:bg-muted hover:text-muted-foreground",
        isActive && "scale-x-105 rounded-sm bg-primary text-primary-foreground",
        isNext && "bg-primary/10",
        isPrevious && "bg-primary/5"
      )}
    >
      {word.text}
    </button>
  )
}
