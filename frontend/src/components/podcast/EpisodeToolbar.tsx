import { Search } from "lucide-react";

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
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row">

      <div className="relative flex-1">

        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />

        <Input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search by episode number or title..."
          className="pl-10"
        />

      </div>

      <button
        onClick={toggleSort}
        className="rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
      >
        {oldestFirst
          ? "Oldest → Newest"
          : "Newest → Oldest"}
      </button>

    </div>
  );
}