import { NavLink, Outlet } from "react-router-dom";
import {
  Library,
  Search,
} from "lucide-react";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0f0f10] text-white">

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-zinc-800 bg-[#0f0f10] p-6 md:flex md:flex-col">

        <h1 className="text-3xl font-bold">
          Chronicle
        </h1>

        <p className="mt-2 text-zinc-500">
          Start from Episode 1.
        </p>

        <nav className="mt-10 space-y-2">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl p-3 transition ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`
            }
          >
            <Library className="h-5 w-5" />
            Library
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl p-3 transition ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`
            }
          >
            <Search className="h-5 w-5" />
            Discover
          </NavLink>

        </nav>

      </aside>

      {/* Main Content */}
      <main
        className="
          min-h-screen
          px-4
          pt-5
          pb-32
          sm:px-6
          md:ml-72
          md:px-10
          md:pb-10
          md:pt-10
        "
      >
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-40
          border-t
          border-zinc-800
          bg-zinc-950/95
          backdrop-blur-xl
          md:hidden
        "
      >
        <div className="mx-auto flex max-w-md items-center justify-around px-6 py-3">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex min-w-16 flex-col items-center gap-1 text-xs ${
                isActive
                  ? "text-white"
                  : "text-zinc-500"
              }`
            }
          >
            <Library className="h-6 w-6" />

            <span>
              Library
            </span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex min-w-16 flex-col items-center gap-1 text-xs ${
                isActive
                  ? "text-white"
                  : "text-zinc-500"
              }`
            }
          >
            <Search className="h-6 w-6" />

            <span>
              Discover
            </span>
          </NavLink>

        </div>
      </nav>

    </div>
  );
}