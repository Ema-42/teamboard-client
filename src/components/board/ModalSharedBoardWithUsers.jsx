import React, { useEffect, useState } from "react";
import { X, Users } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const SharedBoard = ({ board, onClose, onShare, secureFetch }) => {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await secureFetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          }
        );
        const data = await res.json();
        console.log("Usuarios obtenidos:", data);

        setUsers(data.data || []);
      } catch (err) {
        setError("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [secureFetch]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await secureFetch(
        `${import.meta.env.VITE_BACKEND_URL}/boards/${board.id}/share`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: selectedUsers }),
        }
      );
      if (!res.ok) throw new Error("No se pudo compartir el tablero");
      setSuccess(true);
      if (onShare) onShare(selectedUsers);
    } catch (err) {
      setError("Error al compartir el tablero");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="flex items-center mb-4">
          <Users size={22} className="mr-2 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Compartir tablero
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="text-gray-700 dark:text-gray-200">
                Cargando usuarios...
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <ul className="space-y-2">
                {users
                  .filter((u) => u.id !== board.ownerId)
                  .map((user) => (
                    <li
                      key={user.id}
                      className={`flex items-center p-2 rounded cursor-pointer transition-colors duration-150 ${
                        selectedUsers.includes(user.id)
                          ? "bg-teal-100 dark:bg-teal-700/40"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleSelectUser(user.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="mr-3 accent-teal-600 dark:accent-teal-400"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-gray-900 dark:text-white">
                        {user.name} ({user.email})
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || selectedUsers.length === 0}
              className="px-4 py-2 rounded bg-teal-600 dark:bg-teal-400 text-white dark:text-black hover:bg-teal-700 dark:hover:bg-teal-500 disabled:opacity-60"
            >
              Compartir
            </button>
          </div>
          {success && (
            <div className="mt-4 text-green-600 dark:text-green-400">
              ¡Tablero compartido exitosamente!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SharedBoard;
