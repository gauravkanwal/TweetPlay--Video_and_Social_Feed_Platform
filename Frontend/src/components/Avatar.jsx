// Avatar.jsx
const Avatar = ({
  src,
  alt = "",
  size = 40,
  className = "",
  onClick,
}) => {
  const initials = alt
    ? alt.substring(0, 2).toUpperCase()
    : "?";

  return (
    <div
      onClick={onClick}
      className={`rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-500 to-orange-400 ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <span
          className="font-bold text-white select-none"
          style={{ fontSize: size * 0.35 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

export default Avatar;