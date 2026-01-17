import { useRef } from "react";

interface VideoPlayerProps {
  videoURL: string;
  onEnded?: () => void;
}

export const VideoPlayer = ({ videoURL, onEnded }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    if (onEnded) {
      onEnded();
    }
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-xl">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls
        controlsList="nodownload"
        onEnded={handleEnded}
      >
        <source src={videoURL} type="video/mp4" />
        <source src={videoURL} type="video/webm" />
        <source src={videoURL} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
