import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VideoCard from "../components/VideoCard.jsx";
import TweetCard from "../components/TweetCard.jsx";
import { API } from "../api/axios.js";

const TABS = ["Videos", "Tweets"];

function Home() {
  const [activeTab, setActiveTab] = useState("Videos");
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);

  const getVideosAndTweets = async () => {
    try {
      const [videoRes, tweetRes] = await Promise.all([
        API.get("/videos/"),
        API.get("/tweets/"),
      ]);
      setVideos(videoRes.data.data.docs);
      setTweets(tweetRes.data.data.docs);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTweetDelete = (tweetId) => {
  setTweets((prev) => prev.filter((t) => t._id !== tweetId));
  };
  
  useEffect(() => {
    getVideosAndTweets();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0c0c0f] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Tabs row */}
      <div className="flex items-center px-7 pt-4 border-b border-white/[0.06]">
        {/* Tabs */}
        <div className="flex flex-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] font-bold pb-3.5 mr-8 border-b-2 transition-all duration-200 bg-transparent
                ${
                  activeTab === tab
                    ? "text-[#f0f0f2] border-orange-500"
                    : "text-[#3d3d47] border-transparent hover:text-[#7a7a8a]"
                }`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Create button */}
        <Link
          to="/upload"
          className="flex items-center gap-1.5 h-8 px-3 mb-2 rounded-full bg-[#e85d2f] hover:bg-[#d4512a] transition-all duration-150 no-underline flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span
            className="text-[12px] font-bold text-white tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Create
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="px-7 pt-6 pb-12">
        {activeTab === "Videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {videos.map((video, i) => (
              <div
                key={video._id}
                className="animate-[fadeUp_0.4s_ease_both]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "Tweets" && (
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            {tweets.map((tweet, i) => (
              <div
                key={tweet._id}
                className="animate-[fadeUp_0.4s_ease_both]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <TweetCard tweet={tweet} onDelete={handleTweetDelete} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Home;