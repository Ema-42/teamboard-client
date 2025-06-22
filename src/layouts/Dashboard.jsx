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
    <div className="flex flex-1 flex-col bg-stone-300 dark:bg-gray-900 p-4 relative overflow-x-auto overflow-y-hidden">
      <div className="relative z-10">
        <div className="w-full">
          <ListBoards boards={boards} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;