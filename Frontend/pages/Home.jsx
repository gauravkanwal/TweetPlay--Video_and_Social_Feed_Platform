import { useState } from "react";
import VideoCard from "../components/VideoCard";
import TweetCard from "../components/TweetCard";

const TABS = ["Videos", "Tweets"];

function Home() {
  const [activeTab, setActiveTab] = useState("Videos");

  const videos = [
    { id: 1, title: "Building a Fullstack Video Sharing App", username: "gaurav_dev", views: "23K", date: "2 days ago", duration: "12:30", thumbnail: "https://picsum.photos/500/300?random=1", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, title: "React Tailwind Complete Crash Course", username: "code_master", views: "120K", date: "1 week ago", duration: "18:45", thumbnail: "https://picsum.photos/500/300?random=2", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, title: "MongoDB Aggregation Explained Simply", username: "backend_guru", views: "8.7K", date: "5 days ago", duration: "9:20", thumbnail: "https://picsum.photos/500/300?random=3", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, title: "JWT Authentication Full Guide", username: "security_pro", views: "54K", date: "3 weeks ago", duration: "15:10", thumbnail: "https://picsum.photos/500/300?random=4", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, title: "How Infinite Scroll Works in Real Apps", username: "ui_engineer", views: "31K", date: "4 days ago", duration: "11:02", thumbnail: "https://picsum.photos/500/300?random=5", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 6, title: "Deploy MERN App on VPS Step by Step", username: "dev_ops", views: "76K", date: "6 days ago", duration: "21:55", thumbnail: "https://picsum.photos/500/300?random=6", avatar: "https://i.pravatar.cc/150?img=6" },
  ];

  const tweets = [
    { id: 1, avatar: "https://i.pravatar.cc/150?img=12", username: "Gaurav Dev", handle: "@gaurav_dev", time: "2h", content: "Just shipped the video sharing feature. Built with React, Node, and MongoDB. Thumbnail lazy-loading cut LCP by 40%.", numberOfLikes: 1824, liked: false, numberOfComments: 38 },
    { id: 2, avatar: "https://i.pravatar.cc/150?img=47", username: "Code Master", handle: "@code_master", time: "5h", content: "Hot take: Tailwind is the best thing that happened to frontend DX in years. Stop gatekeeping utility classes and just ship.", numberOfLikes: 423, liked: true, numberOfComments: 91 },
    { id: 3, avatar: "https://i.pravatar.cc/150?img=33", username: "Backend Guru", handle: "@backend_guru", time: "1d", verified: true, content: "MongoDB aggregation pipelines are genuinely underrated. Most devs only scratch the surface — new deep-dive guide drops tomorrow.", numberOfLikes: 3109, liked: false, numberOfComments: 142 },
    { id: 4, avatar: "https://i.pravatar.cc/150?img=5", username: "UI Engineer", handle: "@ui_engineer", time: "3h", verified: false, content: "Spent the weekend building a custom drag-and-drop system from scratch. No libraries. Pointer events API is surprisingly powerful.", numberOfLikes: 876, liked: false, numberOfComments: 54 },
    { id: 5, avatar: "https://i.pravatar.cc/150?img=6", username: "Dev Ops", handle: "@dev_ops", time: "6h", verified: true, content: "Reminder: your VPS costs $6/mo. Your Vercel bill after one viral post can be $600. Self-host your side projects, people.", numberOfLikes: 5420, liked: true, numberOfComments: 310 },
  ];

  return (
    <div
      className="min-h-screen bg-[#0c0c0f] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      {/* Tabs */}
        <div className="flex px-7 border-b border-white/[0.06]">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[13px] font-bold pb-3.5 mr-8 border-b-2 transition-all duration-200 bg-transparent
              ${activeTab === tab
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
                key={video.id}
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
                key={tweet.id}
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