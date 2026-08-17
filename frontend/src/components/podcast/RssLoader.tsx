
import { useState } from "react";
import { Input } from "../../../@/components/ui/input";
import { Button } from "../../../@/components/ui/button";

interface Props {
  onLoad: (rss: string) => void;
}

export default function RssLoader({ onLoad }: Props) {
  const [rss, setRss] = useState(
    "https://feeds.simplecast.com/kwWc0lhf"
  );

  return (
    <div className="flex gap-3">
      <Input
        value={rss}
        onChange={(e) => setRss(e.target.value)}
        placeholder="Paste RSS Feed"
      />

      <Button onClick={() => onLoad(rss)}>
        Load Podcast
      </Button>
    </div>
  );
}