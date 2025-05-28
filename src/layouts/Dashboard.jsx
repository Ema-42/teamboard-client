import React from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ListBoards from "../components/board/List-Boards";
import { useSecureFetch } from "../hooks/useSecureFetch";

const Dashboard = () => {
  const { user, logout, isAuthenticated, token } = useAuth();
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
      setBoards(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-stone-200 dark:bg-gray-800 p-4">
      <div className="flex flex-wrap gap-4">
        <ListBoards boards={boards} />
      </div>
    </div>
  );
};

export default Dashboard;
