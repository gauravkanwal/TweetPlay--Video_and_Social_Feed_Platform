// pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../api/axios";
import SearchResult from "../components/SearchResult";

const SearchVideo = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/videos/", { params: { query } });
        setVideos(res.data.data.docs);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]); // re-runs automatically when query param changes

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {loading && (
        <div className="flex items-center justify-center py-24 gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <span className="text-[13px] text-[#3d3d47]">Searching...</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-center py-24">
          <p className="text-[13px] text-[#e85d2f]">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <SearchResult videos={videos} query={query} />
      )}
    </div>
  );
};

export default SearchVideo;