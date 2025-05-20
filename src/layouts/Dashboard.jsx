import React from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ListBoards from "../components/board/List-Boards";
const Dashboard = () => {
  const { user, logout, isAuthenticated, token } = useAuth();
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBoards();
    }
  }, [isAuthenticated]);
  const fetchBoards = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/boards/my-boards`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setBoards(data);
      } else {
        console.error("Failed to fetch boards");
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-100 dark:bg-gray-900 p-4">

      <div className="flex flex-wrap gap-4">
        <ListBoards boards={boards} />
      </div>
    </div>
  );
};

export default Dashboard;
