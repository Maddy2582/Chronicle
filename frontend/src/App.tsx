import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Player from "@/components/player/Player";

import AppLayout from "@/components/layout/AppLayout";

import LibraryPage from "@/pages/LibraryPage";
import SearchPage from "@/pages/SearchPage";
import PodcastPage from "@/pages/PodcastPage";
import InstallBanner from "../src/components/pwa/InstallBanner";
import { useEffect } from "react";
import { useLibraryStore } from "./store/libraryStore";

export default function App() {
  // const { loadLibrary } = useLibraryStore((state) => state.loadLibrary);

  useEffect(() => {
    useLibraryStore.getState().loadLibrary();
  }, []);

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route element={<AppLayout />}>

            <Route
              path="/"
              element={<LibraryPage />}
            />

            <Route
              path="/search"
              element={<SearchPage />}
            />

            <Route
              path="/podcast/:rss"
              element={<PodcastPage />}
            />

          </Route>

        </Routes>

      </BrowserRouter>

      <Player />

      <InstallBanner />

    </>
  );
}