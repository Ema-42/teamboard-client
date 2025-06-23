import React, { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";
import { createPortal } from "react-dom";
const UserAuthorTask = ({ task, members, owner }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const ownerUser = { user: owner };
  // Encontrar el usuario que creó la tarea
  const author =
    members.find((member) => member.user.id === task.created_by) || ownerUser;

  // Cerrar tooltip al hacer click fuera (solo en móvil)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        showTooltip &&
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showTooltip, isMobile]);

  const handleInteraction = () => {
    if (isMobile) {
      setShowTooltip((prev) => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // 10px arriba del elemento
        left: rect.left + rect.width / 2, // Centrado horizontalmente
      });
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Si no hay autor, no mostrar nada
  if (!author) {
    return null;
  }

  return (
    <div className="relative inline-block  ">
      {/* Avatar del autor */}
      <div
        ref={triggerRef}
        className="cursor-pointer h-full w-10 flex items-center justify-center px-2 "
        onClick={handleInteraction}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {author.user.picture ? (
          <img
            src={author.user.picture}
            alt={author.user.name}
            className=" h-6 w-6 rounded-full shadow-sm hover:ring-2 hover:ring-teal-300 transition-all duration-200"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all duration-200">
            <User size={12} className="text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed transform -translate-x-1/2 -translate-y-full px-3 py-2 bg-gray-600/90 dark:bg-gray-600/90 text-white text-xs rounded-lg shadow-lg whitespace-nowrap   ${
          showTooltip ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          pointerEvents: showTooltip ? "auto" : "none",
          zIndex: 99999,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-2">
          <div className="flex flex-col justify-center">
            <div className="font-medium leading-tight">{author.user.name}</div>
            <div className="text-xs opacity-75 leading-tight">
              {author.user.email}
            </div>
          </div>
        </div>

        {/* Flecha del tooltip */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-600 dark:border-t-teal-800"></div>
      </div>
    </div>
  );
};

export default UserAuthorTask;
