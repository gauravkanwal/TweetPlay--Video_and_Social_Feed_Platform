// SearchResult.jsx
import VideoCard from './VideoCard';

const SearchResult = ({ videos = [], query = "" }) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <svg className="w-12 h-12 text-[#2a2a35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <div className="text-center">
          <p className="text-[15px] font-bold text-[#f0f0f2]" style={{ fontFamily: "'Syne', sans-serif" }}>
            No results found
          </p>
          {query && (
            <p className="text-[13px] text-[#3d3d47] mt-1">
              Nothing matched <span className="text-[#7a7a8a]">"{query}"</span> — try different keywords
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Result count */}
      {query && (
        <div className="px-7 pt-5 pb-4 flex items-center gap-2">
          <span className="text-[13px] text-[#3d3d47]">
            Showing <span className="text-[#f0f0f2] font-medium">{videos.length}</span> result{videos.length !== 1 ? "s" : ""} for
          </span>
          <span
            className="text-[13px] font-bold text-orange-500"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            "{query}"
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="px-7 pb-12">
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
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SearchResult;