import React, { useState, useEffect, useRef } from "react";
import { Users, User } from "lucide-react";

const ToolTip = ({ users }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  // Cerrar tooltip al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div
        ref={triggerRef}
        className="flex items-center gap-1 cursor-pointer px-2 py-1 mt-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        onClick={toggleTooltip}
      >
        <Users size={16} className="text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Miembros ({users.length})
        </span>
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 transition-all duration-200 ${
          showTooltip ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ pointerEvents: showTooltip ? "auto" : "none" }}
      >
        {/* Lista de usuarios */}
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="p-3 space-y-2">
            {users.map((item, index) => (
              <div
                key={item.user.email}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {item.user.picture ? (
                    <img
                      src={item.user.picture}
                      alt={item.user.name}
                      className="h-8 w-8 rounded-full shadow-sm"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <User size={14} className="text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Información del usuario */}
                <div className="flex-grow min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate text-sm">
                    {item.user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.user.email}
                  </div>
                </div>

                {/* Indicador de primer miembro */}
                {index === 0 && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Admin
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer minimalista */}
        {users.length > 5 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {users.length} miembros
            </div>
          </div>
        )}
      </div>
 
      <style  >{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(209 213 219);
          border-radius: 3px;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(75 85 99);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgb(156 163 175);
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgb(107 114 128);
        }
      `}</style>
    </div>
  );
};
export default ToolTip;