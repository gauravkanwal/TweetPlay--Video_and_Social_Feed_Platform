// pages/WatchPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/axios";
import VideoPlayer from "../components/VideoPlayer";
import VideoInfo from "../components/VideoInfo";
import OwnerCard from "../components/OwnerCard";
import CommentSection from "../components/CommentSection";

const WatchPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get(`/videos/${videoId}`);
        setVideo(res.data.data[0]);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load video.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <p className="text-[13px] text-[#e85d2f]">{error}</p>
      </div>
    );

  if (!video) return null;

  return (
    <div
      className="min-h-screen bg-[#0c0c0f] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-7 py-6">
        <VideoPlayer src={video.videoFile} poster={video.thumbnail} />

        <VideoInfo
          videoId={video._id}
          ownerId={video.owner._id}
          title={video.title}
          views={video.views}
          createdAt={video.createdAt}
          likes={video.likes}
          isLiked={video.isLiked}
        />

        <OwnerCard owner={video.owner} />

        {video.description && (
          <div className="py-4 border-b border-white/[0.06]">
            <p className="text-[13px] text-[#9999aa] leading-relaxed whitespace-pre-line">
              {video.description}
            </p>
          </div>
        )}

        <CommentSection videoId={video._id}/>
      </div>
    </div>
  );
};

export default WatchPage;
