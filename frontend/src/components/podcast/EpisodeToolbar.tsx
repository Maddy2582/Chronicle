import { Search, ArrowDownUp } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  oldestFirst: boolean;
  toggleSort: () => void;
}

export default function EpisodeToolbar({
  search,
  setSearch,
  oldestFirst,
  toggleSort,
}: Props) {
  return (
    <div className="space-y-3">

      {/* Search */}
      <div className="relative">

        <Search
          className="
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-zinc-500
          "
        />

        <Input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search episodes..."
          className="
            h-12
            rounded-xl
            border-zinc-800
            bg-zinc-900
            pl-10
            text-base
          "
        />

      </div>

      {/* Sort */}
      <button
        onClick={toggleSort}
        className="
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-zinc-900
          text-sm
          text-zinc-300
          transition
          active:scale-[0.98]
          hover:bg-zinc-800
        "
      >

        <ArrowDownUp className="h-4 w-4" />

        {oldestFirst
          ? "Oldest → Newest"
          : "Newest → Oldest"}

      </button>

    </div>
  );
}