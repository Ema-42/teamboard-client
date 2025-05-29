"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Layout,
  Star,
  Plus,
  Bell,
  ChevronDown,
  Info,
  LogOut,
  Settings,
  User,
  Grid,
  Search,
  Menu,
  X,
  SunIcon,
  MoonIcon,
  NotepadText 
} from "lucide-react"

import Logo from "/icono.png"
import { useAuth } from "../../context/AuthContext"
import CreateBoardForm from "../board/Create-Board-Form"
 

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()

  const [openDropdown, setOpenDropdown] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Estado para el tema oscuro/claro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 1. Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      return savedTheme === "dark"
    }
    // 2. Si no, verificar la preferencia del sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    // Aplicar el tema al montar el componente
    document.documentElement.classList.toggle("dark", isDarkMode)
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Datos de ejemplo para los tableros
  const boards = [
    { id: 1, name: "Proyecto Web", isFavorite: true },
    { id: 2, name: "Marketing Q2", isFavorite: true },
    { id: 3, name: "Desarrollo App", isFavorite: false },
    { id: 4, name: "Recursos Humanos", isFavorite: false },
  ]

  const favoriteBoards = boards.filter((board) => board.isFavorite)

  // Datos de ejemplo para las notificaciones
  const notifications = [
    {
      id: 1,
      text: "Fuiste asignado al tablero 'Proyecto Web'",
      time: "Hace 5 min",
    },
    {
      id: 2,
      text: "Emanuel te invitó a colaborar en 'Marketing Q2'",
      time: "Hace 2 horas",
    },
    {
      id: 3,
      text: "Fecha límite: 'Desarrollo App' vence mañana",
      time: "Hace 1 día",
    },
  ]

  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(dropdown)
    }
  }

  const closeDropdowns = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpenDropdown(null)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdowns)
    return () => {
      document.removeEventListener("mousedown", closeDropdowns)
    }
  }, [])

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
    setOpenDropdown(null) // Cerrar cualquier dropdown abierto
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700" ref={dropdownRef}>
        <div className="px-0 sm:px-2 lg:px-4">
          <div className="flex h-16">
            {/* Left side */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 md:hidden ml-1"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Logo */}
              <Link to="/dashboard" className="flex-shrink-0 flex items-center ml-0 md:ml-2">
                <NotepadText size={30} color={isDarkMode ? "#fff" : "#000"} className="mr-2" />
                <span className={`font-bold hidden sm:block ${isDarkMode ? "text-teal-500" : "text-teal-700"}`}>TeamBoard</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-4 md:flex md:items-center md:space-x-1">
                {/* Boards Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("boards")}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                      openDropdown === "boards"
                        ? "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-100"
                        : ""
                    }`}
                  >
                    <Grid size={16} className="mr-2" />
                    <span>Tableros</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>

                  {openDropdown === "boards" && (
                    <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Tus tableros</h3>
                          <div className="mt-2 relative">
                            <input
                              type="text"
                              placeholder="Buscar tableros..."
                              className="w-full pl-8 pr-4 py-2 text-sm border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-teal-500 focus:border-teal-500"
                            />
                            <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {boards.map((board) => (
                            <Link
                              key={board.id}
                              to={`/board/${board.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                              <div className="flex items-center">
                                <Layout size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                <span>{board.name}</span>
                                {board.isFavorite && (
                                  <Star size={16} className="ml-auto text-yellow-400" fill="currentColor" />
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={openCreateModal}
                            className="block w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-gray-100 dark:text-teal-400 dark:hover:bg-gray-600"
                          >
                            <div className="flex items-center">
                              <Plus size={16} className="mr-2" />
                              <span>Crear nuevo tablero</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Favorites Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("favorites")}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                      openDropdown === "favorites"
                        ? "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-100"
                        : ""
                    }`}
                  >
                    <Star size={16} className="mr-2" />
                    <span>Favoritos</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>

                  {openDropdown === "favorites" && (
                    <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Tableros favoritos</h3>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {favoriteBoards.length > 0 ? (
                            favoriteBoards.map((board) => (
                              <Link
                                key={board.id}
                                to={`/board/${board.id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                              >
                                <div className="flex items-center">
                                  <Layout size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                  <span>{board.name}</span>
                                  <Star size={16} className="ml-auto text-yellow-400" fill="currentColor" />
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                              No tienes tableros favoritos
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Button */}
                <button
                  onClick={openCreateModal}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Plus size={16} className="mr-2" />
                  <span>Crear</span>
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center pr-0 ml-auto md:pr-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ml-3"
                aria-label="Cambiar tema"
              >
                {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative ml-3">
                <button
                  onClick={() => toggleDropdown("notifications")}
                  className={`p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                    openDropdown === "notifications"
                      ? "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-100"
                      : ""
                  }`}
                >
                  <span className="sr-only">Ver notificaciones</span>
                  <div className="relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-xs font-bold text-white">
                      {notifications.length}
                    </span>
                  </div>
                </button>

                {openDropdown === "notifications" && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notificaciones</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-200">{notification.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600">
                        <Link
                          to="/notifications"
                          className="block w-full text-center px-4 py-2 text-sm text-teal-600 hover:bg-gray-100 dark:text-teal-400 dark:hover:bg-gray-600"
                        >
                          Ver todas las notificaciones
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Button */}
              <div className="relative ml-3">
                <button
                  onClick={() => toggleDropdown("info")}
                  className={`p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                    openDropdown === "info" ? "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-100" : ""
                  }`}
                >
                  <span className="sr-only">Información</span>
                  <Info size={20} />
                </button>

                {openDropdown === "info" && (
                  <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-3 px-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Acerca de</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          Desarrollado por <span className="font-medium">Emanuel</span>
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                          <a
                            href="https://github.com/emanuel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-500 dark:text-teal-400"
                          >
                            GitHub
                          </a>
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                          <a
                            href="mailto:emanuel@example.com"
                            className="text-teal-600 hover:text-teal-500 dark:text-teal-400"
                          >
                            emanuel@example.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative ml-3 mr-1 md:mr-0">
                <button
                  onClick={() => toggleDropdown("profile")}
                  className={`flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                    openDropdown === "profile" ? "ring-2 ring-teal-500 ring-offset-2" : ""
                  }`}
                >
                  <span className="sr-only">Abrir menú de usuario</span>
                  <img className="h-8 w-8 rounded-full" src={user?.picture} alt={user?.name} />
                </button>
                

                {openDropdown === "profile" && (
                  <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Información de cuenta</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        <div className="flex items-center">
                          <Settings size={16} className="mr-2" />
                          <span>Administrar cuenta</span>
                        </div>
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        <div className="flex items-center">
                          <User size={16} className="mr-2" />
                          <span>Tu perfil</span>
                        </div>
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        <div className="flex items-center">
                          <LogOut size={16} className="mr-2" />
                          <span>Cerrar sesión</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <Layout size={16} className="mr-2" />
                <span>Dashboard</span>
              </div>
            </Link>

            <button
              onClick={() => toggleDropdown("mobile-boards")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                openDropdown === "mobile-boards"
                  ? "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-100"
                  : ""
              }`}
            >
              <div className="flex items-center">
                <Grid size={16} className="mr-2" />
                <span>Tableros</span>
              </div>
              <ChevronDown size={16} className={`transform ${openDropdown === "mobile-boards" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "mobile-boards" && (
              <div className="pl-6 space-y-1">
                {boards.map((board) => (
                  <Link
                    key={board.id}
                    to={`/board/${board.id}`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <Layout size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                      <span>{board.name}</span>
                      {board.isFavorite && <Star size={16} className="ml-2 text-yellow-400" fill="currentColor" />}
                    </div>
                  </Link>
                ))}
                <button
                  onClick={openCreateModal}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-teal-600 hover:bg-gray-100 dark:text-teal-400 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    <span>Crear nuevo tablero</span>
                  </div>
                </button>
              </div>
            )}

            <button
              onClick={() => toggleDropdown("mobile-favorites")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                openDropdown === "mobile-favorites"
                  ? "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-100"
                  : ""
              }`}
            >
              <div className="flex items-center">
                <Star size={16} className="mr-2" />
                <span>Favoritos</span>
              </div>
              <ChevronDown
                size={16}
                className={`transform ${openDropdown === "mobile-favorites" ? "rotate-180" : ""}`}
              />
            </button>

            {openDropdown === "mobile-favorites" && (
              <div className="pl-6 space-y-1">
                {favoriteBoards.length > 0 ? (
                  favoriteBoards.map((board) => (
                    <Link
                      key={board.id}
                      to={`/board/${board.id}`}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <Layout size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                        <span>{board.name}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No tienes tableros favoritos</div>
                )}
              </div>
            )}

            <button
              onClick={openCreateModal}
              className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              <div className="flex items-center">
                <Plus size={16} className="mr-2" />
                <span>Crear</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Modal de creación de tablero */}
      {isCreateModalOpen && <CreateBoardForm onClose={() => setIsCreateModalOpen(false)} isDarkMode={isDarkMode} />}
    </>
  )
}

export default Navbar
