export default function Home() {
  return (
    <div className="flex h-screen bg-[#0f0f10] text-white">
      <div className="hidden w-72 border-r border-zinc-800 md:flex flex-col p-6">
        <h1 className="text-3xl font-bold">Chronicle</h1>
        <p className="text-zinc-400 mt-2">
          Start from Episode 1.
        </p>

        <div className="mt-8 space-y-3">
          <div className="rounded-xl bg-zinc-900 p-3">
            Hidden Brain
          </div>

          <div className="rounded-xl bg-zinc-900 p-3">
            Darknet Diaries
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-auto p-6">
        <h2 className="text-4xl font-bold">
          Your Library
        </h2>

        <div className="mt-8 h-48 rounded-3xl bg-gradient-to-r from-violet-700 to-fuchsia-700 p-8">
          <h3 className="text-3xl font-bold">
            Welcome to Chronicle
          </h3>

          <p className="mt-3 text-zinc-100">
            Every podcast. Episode 1 first.
          </p>
        </div>
      </main>
    </div>
  );
}

<nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-zinc-800 bg-zinc-950 p-4 md:hidden">
  <button>Home</button>
  <button>Library</button>
  <button>Search</button>
</nav>