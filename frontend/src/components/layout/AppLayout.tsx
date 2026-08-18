import { NavLink, Outlet } from "react-router-dom";

import { Library, Search } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-[#0f0f10] text-white">

      <aside className="hidden w-72 border-r border-zinc-800 p-6 md:flex md:flex-col">

        <h1 className="text-3xl font-bold">
          Chronicle
        </h1>

        <p className="mt-2 text-zinc-500">
          Start from Episode 1.
        </p>

        <nav className="mt-10 space-y-2">

          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-zinc-900"
          >
            <Library className="h-5 w-5" />
            Library
          </NavLink>

          <NavLink
            to="/search"
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-zinc-900"
          >
            <Search className="h-5 w-5" />
            Discover
          </NavLink>

        </nav>

      </aside>

      <main className="flex-1 overflow-y-auto p-6 pb-24 md:p-10">

        <Outlet />

      </main>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-zinc-800 bg-zinc-950 p-4 md:hidden">

        <NavLink to="/">
          <Library />
        </NavLink>

        <NavLink to="/search">
          <Search />
        </NavLink>

      </nav>

    </div>
  );
}