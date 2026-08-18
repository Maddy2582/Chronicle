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
    <div className="
  group
  flex
  min-w-0
  items-center
  gap-3
  rounded-2xl
  border
  border-zinc-800
  bg-zinc-900
  p-3
  active:scale-[0.99]
">

      <img
        src={podcast.image}
        className="
  h-14
  w-14
  shrink-0
  rounded-xl
  object-cover
"
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