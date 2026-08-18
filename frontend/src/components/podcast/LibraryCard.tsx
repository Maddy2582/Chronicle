import {
  Trash2,
} from "lucide-react";

import {
  useLibraryStore,
  type LibraryPodcast,
} from "@/store/libraryStore";

interface Props {
  podcast: LibraryPodcast;
  onOpen: (rss: string) => void;
}

export default function LibraryCard({
  podcast,
  onOpen,
}: Props) {

  const { removePodcast } =
    useLibraryStore();

  return (
    <div className="group flex items-center gap-3 rounded-xl bg-zinc-900 p-3 transition hover:bg-zinc-800">

      <img
        src={podcast.image}
        className="h-12 w-12 rounded-lg object-cover"
      />

      <button
        onClick={() =>
          onOpen(podcast.rss)
        }
        className="min-w-0 flex-1 text-left"
      >

        <p className="truncate font-semibold">
          {podcast.title}
        </p>

        <p className="truncate text-sm text-zinc-500">
          {podcast.author}
        </p>

      </button>

      <button
        onClick={() =>
          removePodcast(podcast.rss)
        }
        className="opacity-0 transition group-hover:opacity-100"
      >

        <Trash2 className="h-5 w-5 text-zinc-500 hover:text-red-400" />

      </button>

    </div>
  );
}