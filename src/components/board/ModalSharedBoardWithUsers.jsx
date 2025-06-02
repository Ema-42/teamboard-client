"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Users, Search, CheckCircle2, UserPlus, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function SharedBoard({ board, onClose, onShare, secureFetch }) {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Función para cargar usuarios - solo se ejecutará una vez al montar el componente
  const fetchUsers = useCallback(async () => {
    if (!isInitialLoad) return;

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
      const usersList = data.data || [];
      
      // Obtener IDs de usuarios que ya son miembros del tablero
      const memberIds = board.members ? board.members.map(member => member.user.id) : [];
      
      // Filtrar usuarios que no son el propietario ni miembros existentes
      const availableUsers = usersList.filter((u) => 
        u.id !== board.ownerId && !memberIds.includes(u.id)
      );
      
      setUsers(availableUsers);
      setFilteredUsers(availableUsers);
      setIsInitialLoad(false);
    } catch (err) {
      setError("Error al cargar usuarios");
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }, [secureFetch, token, board.ownerId, board.members, isInitialLoad]);

  // Cargar usuarios solo una vez al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Actualizar usuarios filtrados cuando cambia la búsqueda
  useEffect(() => {
    // Filtrar por búsqueda manteniendo el orden original
    let filtered = users;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      // Si ya está seleccionado, lo quitamos
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      // Si no está seleccionado, lo añadimos
      return [...prev, userId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      console.log("Selected Users:", selectedUsers);
      console.log("Board:", board);

      const res = await secureFetch(
        `${import.meta.env.VITE_BACKEND_URL}/boards/${board.id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ usersIds: selectedUsers }),
        }
      );
      if (!res.ok) throw new Error("No se pudo compartir el tablero");
      
      console.log("Compartir exitoso, estableciendo success a true");
      setLoading(false); // Detener loading primero
      setSuccess(true);
      if (onShare) onShare(selectedUsers);

      // Mostrar mensaje por 2 segundos, luego cerrar y recargar
      setTimeout(() => {
        onClose();
        // Recargar la página para actualizar los datos
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError("Error al compartir el tablero");
      setLoading(false);
    }
  };

  // Función para renderizar la imagen de perfil
  const renderProfileImage = (user) => {
    if (user.picture) {
      return (
        <img
          src={user.picture || "/placeholder.svg"}
          alt={`Foto de ${user.name}`}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=random`;
          }}
        />
      );
    }

    // Imagen de respaldo si no hay picture
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <User size={20} className="text-gray-500 dark:text-gray-400" />
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60  dark:bg-gray-900/60 "
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative border border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
        <button
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1.5 transition-colors"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-teal-100 dark:bg-teal-900/40 p-2 rounded-full">
            <UserPlus size={22} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Compartir tablero
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {board.title}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Label con contadores */}
          <div className="text-sm text-gray-600 dark:text-gray-400 px-1">
            {filteredUsers.length} usuarios disponibles • {selectedUsers.length} seleccionados
          </div>

          <div className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 dark:border-teal-400 mr-2"></div>
                Cargando usuarios...
              </div>
            ) : error ? (
              <div className="p-4 text-red-500 dark:text-red-400 text-center">
                {error}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
                No se encontraron usuarios
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className={`flex items-center p-3 cursor-pointer transition-colors duration-150 ${
                      selectedUsers.includes(user.id)
                        ? "bg-teal-50 dark:bg-teal-900/20"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => handleSelectUser(user.id)}
                  >
                    <div className="mr-3 flex-shrink-0">
                      {renderProfileImage(user)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border ${
                          selectedUsers.includes(user.id)
                            ? "bg-teal-500 dark:bg-teal-400 border-teal-600 dark:border-teal-500 text-white dark:text-black"
                            : "border-gray-400 dark:border-gray-500"
                        } flex items-center justify-center`}
                      >
                        {selectedUsers.includes(user.id) && (
                          <CheckCircle2 size={14} />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mensaje de éxito - más visible */}
          {success && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 size={24} className="mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">¡Éxito!</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Tablero compartido exitosamente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || selectedUsers.length === 0}
              className="px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-500 text-white dark:text-black hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black mr-2"></div>
                  Compartiendo...
                </span>
              ) : (
                <span className="flex items-center">
                  <Users size={16} className="mr-2" />
                  Compartir
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}