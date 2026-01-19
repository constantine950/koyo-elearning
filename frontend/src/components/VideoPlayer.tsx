import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoURL: string;
  onEnded?: () => void;
}

const getYouTubeId = (url: string) => {
  const parsed = new URL(url);

  if (parsed.hostname.includes("youtu.be")) {
    return parsed.pathname.slice(1);
  }

  if (parsed.searchParams.get("v")) {
    return parsed.searchParams.get("v");
  }

  if (parsed.pathname.includes("/shorts/")) {
    return parsed.pathname.split("/shorts/")[1];
  }

  return null;
};

export const VideoPlayer = ({ videoURL, onEnded }: VideoPlayerProps) => {
  const playerRef = useRef<YT.Player | null>(null);
  const videoId = getYouTubeId(videoURL);

  useEffect(() => {
    if (!videoId || !window.YT || !window.YT.Player) return;

    playerRef.current = new YT.Player("yt-player", {
      videoId,
      events: {
        onStateChange: (event: YT.OnStateChangeEvent) => {
          if (event.data === YT.PlayerState.ENDED) {
            onEnded?.();
          }
        },
      },
    });

    return () => {
      playerRef.current?.destroy();
    };
  }, [videoId, onEnded]);

  if (!videoId) {
    return <p className="text-red-500">Invalid video link</p>;
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <div id="yt-player" className="w-full h-full" />
    </div>
  );
};
