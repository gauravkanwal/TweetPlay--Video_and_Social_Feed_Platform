const VideoPlayer = ({ src, poster }) => {
  return (
    <video
      src={src}
      poster={poster}
      controls
      preload="metadata"
      controlsList="nodownload"
      className="w-full rounded-xl bg-black aspect-video"
    />
  );
};

export default VideoPlayer;