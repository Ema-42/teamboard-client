"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Check, Plus } from "lucide-react";

const CreateBoardForm = ({ onClose, isDarkMode }) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#10b981"); // Default color (teal-500)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const modalRef = useRef(null);

  // Datos de ejemplo para los miembros
  const allMembers = [
    {
      id: 1,
      name: "Ana García",
      email: "ana@example.com",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@example.com",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Elena Martínez",
      email: "elena@example.com",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "David Rodríguez",
      email: "david@example.com",
      avatar: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Sofía Pérez",
      email: "sofia@example.com",
      avatar: "/placeholder.svg",
    },
    {
      id: 6,
      name: "Miguel Sánchez",
      email: "miguel@example.com",
      avatar: "/placeholder.svg",
    },
  ];

  // Colores predefinidos para elegir
  const colorOptions = [
    { name: "Teal", value: "#10b981" }, // teal-500
    { name: "Blue", value: "#3b82f6" }, // blue-500
    { name: "Purple", value: "#8b5cf6" }, // violet-500
    { name: "Pink", value: "#ec4899" }, // pink-500
    { name: "Red", value: "#ef4444" }, // red-500
    { name: "Orange", value: "#f97316" }, // orange-500
    { name: "Yellow", value: "#eab308" }, // yellow-500
    { name: "Green", value: "#22c55e" }, // green-500
  ];

  // Filtrar miembros basados en la búsqueda
  const filteredMembers = allMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cerrar el modal al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Manejar la selección de miembros
  const toggleMember = (member) => {
    if (selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  // Manejar la creación del tablero
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí iría la lógica para crear el tablero
    console.log({
      title,
      color: selectedColor,
      members: selectedMembers,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60  dark:bg-gray-900/60 "  style={{ backdropFilter: 'blur(4px)' }}>
      <div
        ref={modalRef}
        className="w-full sm:max-w-2xl  rounded-lg shadow-xl bg-white dark:bg-gray-800 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Crear nuevo tablero
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Título del tablero */}
          <div className="mb-4">
            <label
              htmlFor="board-title"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
              Título del tablero
            </label>
            <input
              id="board-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa un título para el tablero"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors bg-white border-gray-300 focus:border-teal-500 focus:ring-teal-500/50 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-teal-500 dark:focus:ring-teal-500/50 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>

          {/* Selección de color */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Color del tablero
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                    selectedColor === color.value
                      ? "ring-2 ring-offset-2 ring-teal-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Selección de miembros */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Miembros
            </label>

            {/* Buscador de miembros */}
            <div className="relative mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar miembros..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors bg-white border-gray-300 focus:border-teal-500 focus:ring-teal-500/50 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-teal-500 dark:focus:ring-teal-500/50 dark:text-white dark:placeholder-gray-400"
              />
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
            </div>

            {/* Lista de miembros filtrados */}
            <div className="max-h-40 overflow-y-auto mb-3 rounded-lg border border-gray-200 dark:border-gray-700">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => toggleMember(member)}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedMembers.some((m) => m.id === member.id)
                          ? "bg-teal-500 text-white"
                          : "border border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {selectedMembers.some((m) => m.id === member.id) && (
                        <Check size={12} />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron miembros
                </div>
              )}
            </div>

            {/* Miembros seleccionados */}
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-100 px-2 py-1 rounded-full text-sm"
                >
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-5 h-5 rounded-full mr-1"
                  />
                  <span className="mr-1">{member.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleMember(member)}
                    className="text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <div className="flex items-center">
                <Plus size={16} className="mr-2" />
                <span>Crear tablero</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardForm;
