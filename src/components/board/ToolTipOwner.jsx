import React, { useState } from "react";

const ToolTipOwner = ({ board, user }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  return (
    <div className="relative inline-block">
      <img
        className="h-8 w-8 rounded-full mr-4 cursor-pointer"
        src={board.owner?.picture}
        alt={user?.name}
        onClick={toggleTooltip}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      <div
        className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-400 black:bg-gray-800 text-gray-900 black:text-white text-sm rounded-lg whitespace-nowrap z-10 transition-all duration-200 ${
          showTooltip ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ pointerEvents: "none" }}
      >
        <div className="font-semibold">{board.owner?.name}</div>
        <div className="text-xs text-gray-900 black:text-white">{board.owner?.email}</div>
        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default ToolTipOwner;
