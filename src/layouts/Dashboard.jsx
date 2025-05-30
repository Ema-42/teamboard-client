import React from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ListBoards from "../components/board/List-Boards";
import { useSecureFetch } from "../hooks/useSecureFetch";

const Dashboard = () => {
  const { isAuthenticated, token } = useAuth();
  const [boards, setBoards] = useState([]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchBoards();
    }
  }, [isAuthenticated]);
  
  const { secureFetch } = useSecureFetch();
  
  const fetchBoards = async () => {
    try {
      const response = await secureFetch(
        `${import.meta.env.VITE_BACKEND_URL}/boards/my-boards`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Fetched Boards:", data);
      
      setBoards(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-stone-300 dark:bg-gray-800 p-4 relative overflow-hidden">
      {/* Fondo con textura que gira */}
      <div
        className="absolute opacity-30 dark:opacity-20"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c3-3 8-3 12 0 4 3 4 8 0 12-3 4-8 4-12 0-4-3-4-8 0-12z'/%3E%3Cpath d='M60 15c2-2 6-2 8 0 2 2 2 6 0 8-2 2-6 2-8 0-2-2-2-6 0-8z'/%3E%3Cpath d='M15 55c4-2 9-1 11 3 2 4 0 9-4 11-4 2-9 1-11-3-2-4 0-9 4-11z'/%3E%3Cpath d='M65 60c1-3 5-4 8-2 3 2 4 6 2 9-2 3-6 4-9 2-3-2-4-6-1-9z'/%3E%3Cpath d='M35 8c3-1 6 1 7 4 1 3-1 6-4 7-3 1-6-1-7-4-1-3 1-6 4-7z'/%3E%3Cpath d='M8 45c2-3 6-3 9-1 3 2 3 6 1 9-2 3-6 3-9 1-3-2-3-6-1-9z'/%3E%3Cpath d='M72 35c1-2 4-2 6 0 2 2 2 5 0 6-2 1-5 1-6 0-2-1-2-4 0-6z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
          animation: "spin 200s linear infinite",
          filter: 'brightness(0.8) contrast(1.2)',
          transformOrigin: 'center center'
        }}
      />
      
      {/* Versión para modo oscuro con colores invertidos */}
      <div
        className="absolute opacity-0 dark:opacity-20"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M20 20c3-3 8-3 12 0 4 3 4 8 0 12-3 4-8 4-12 0-4-3-4-8 0-12z'/%3E%3Cpath d='M60 15c2-2 6-2 8 0 2 2 2 6 0 8-2 2-6 2-8 0-2-2-2-6 0-8z'/%3E%3Cpath d='M15 55c4-2 9-1 11 3 2 4 0 9-4 11-4 2-9 1-11-3-2-4 0-9 4-11z'/%3E%3Cpath d='M65 60c1-3 5-4 8-2 3 2 4 6 2 9-2 3-6 4-9 2-3-2-4-6-1-9z'/%3E%3Cpath d='M35 8c3-1 6 1 7 4 1 3-1 6-4 7-3 1-6-1-7-4-1-3 1-6 4-7z'/%3E%3Cpath d='M8 45c2-3 6-3 9-1 3 2 3 6 1 9-2 3-6 3-9 1-3-2-3-6-1-9z'/%3E%3Cpath d='M72 35c1-2 4-2 6 0 2 2 2 5 0 6-2 1-5 1-6 0-2-1-2-4 0-6z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
          animation: "spin 200s linear infinite",
          filter: 'brightness(1.2) contrast(0.8)',
          transformOrigin: 'center center'
        }}
      />
      
      {/* Contenido por encima del fondo */}
      <div className="relative z-10">
        <div className="flex flex-wrap gap-4">
          <ListBoards boards={boards} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;