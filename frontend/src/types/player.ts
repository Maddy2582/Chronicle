import type { Episode } from "@/services/podcastService";

export interface PlayerState {
  episode: Episode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}