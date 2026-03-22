import { useState, useEffect } from "react";
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
      console.log(videos);
      console.log(tweets);
      
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVideosAndTweets();
  }, []);

  // const tweetArr = [
  //   {
  //     id: 1,
  //     avatar: "https://i.pravatar.cc/150?img=12",
  //     username: "Gaurav Dev",
  //     handle: "@gaurav_dev",
  //     time: "2h",
  //     content:
  //       "Just shipped the video sharing feature. Built with React, Node, and MongoDB. Thumbnail lazy-loading cut LCP by 40%.",
  //     numberOfLikes: 1824,
  //     liked: false,
  //     numberOfComments: 38,
  //   },
  //   {
  //     id: 2,
  //     avatar: "https://i.pravatar.cc/150?img=47",
  //     username: "Code Master",
  //     handle: "@code_master",
  //     time: "5h",
  //     content:
  //       "Hot take: Tailwind is the best thing that happened to frontend DX in years. Stop gatekeeping utility classes and just ship.",
  //     numberOfLikes: 423,
  //     liked: true,
  //     numberOfComments: 91,
  //   },
  //   {
  //     id: 3,
  //     avatar: "https://i.pravatar.cc/150?img=33",
  //     username: "Backend Guru",
  //     handle: "@backend_guru",
  //     time: "1d",
  //     verified: true,
  //     content:
  //       "MongoDB aggregation pipelines are genuinely underrated. Most devs only scratch the surface — new deep-dive guide drops tomorrow.",
  //     numberOfLikes: 3109,
  //     liked: false,
  //     numberOfComments: 142,
  //   },
  //   {
  //     id: 4,
  //     avatar: "https://i.pravatar.cc/150?img=5",
  //     username: "UI Engineer",
  //     handle: "@ui_engineer",
  //     time: "3h",
  //     verified: false,
  //     content:
  //       "Spent the weekend building a custom drag-and-drop system from scratch. No libraries. Pointer events API is surprisingly powerful.",
  //     numberOfLikes: 876,
  //     liked: false,
  //     numberOfComments: 54,
  //   },
  //   {
  //     id: 5,
  //     avatar: "https://i.pravatar.cc/150?img=6",
  //     username: "Dev Ops",
  //     handle: "@dev_ops",
  //     time: "6h",
  //     verified: true,
  //     content:
  //       "Reminder: your VPS costs $6/mo. Your Vercel bill after one viral post can be $600. Self-host your side projects, people.",
  //     numberOfLikes: 5420,
  //     liked: true,
  //     numberOfComments: 310,
  //   },
  // ];

  return (
    <div
      className="min-h-screen bg-[#0c0c0f] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      {/* Tabs */}
      <div className="flex px-7 pt-4 border-b border-white/[0.06]">
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
                <TweetCard tweet={tweet} />
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
