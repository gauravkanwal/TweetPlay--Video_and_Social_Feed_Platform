import { useRef, useState } from "react";

const ScrollableCards = ({ title, items = [], renderCard, ownerOnly = false, isOwner = false }) => {
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  if (ownerOnly && !isOwner) return null;
  if (items.length === 0) return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h2 className="text-[15px] font-extrabold text-[#f2f2f4] mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
        {title}
      </h2>
      <p className="text-[13px] text-[#3d3d47]">Nothing here yet.</p>
    </div>
  );

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 700 : -700, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h2 className="text-[15px] font-extrabold text-[#f2f2f4] mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
        {title}
      </h2>
      <div className="flex items-center gap-3">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, i) => (
            <div key={item._id ?? i} className="flex-shrink-0">
              {renderCard(item)}
            </div>
          ))}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a22] border border-white/[0.07] hover:border-white/20 hover:bg-[#1e1e28] flex items-center justify-center text-[#9999aa] hover:text-[#f2f2f4] transition-all duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
        {canScrollLeft && !canScrollRight && (
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a22] border border-white/[0.07] hover:border-white/20 hover:bg-[#1e1e28] flex items-center justify-center text-[#9999aa] hover:text-[#f2f2f4] transition-all duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ScrollableCards;