import { useNavigate } from "react-router-dom";

const Avatar = ({
  src,
  alt = "",
  size = 40,
  className = "",
  onClick,
  username,
}) => {
  const navigate = useNavigate();
  const initials = alt ? alt.substring(0, 2).toUpperCase() : "?";

  const handleClick = () => {
    if (onClick) return onClick();
    if (username) return navigate(`/profile/${username}`);
  };

  const isClickable = !!onClick || !!username;

  return (
    <div
      onClick={handleClick}
      className={`rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-500 to-orange-400 ${isClickable ? "cursor-pointer hover:opacity-80 transition-opacity duration-150" : ""} ${className}`}
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