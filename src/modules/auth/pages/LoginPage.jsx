"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, Eye, EyeClosed } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // Estado inicial basado en localStorage o preferencia del sistema
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 1. Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // 2. Si no, verificar la preferencia del sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Aplicar el tema al montar el componente
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      toast.success(`Inicio de sesión exitoso`, { theme: "colored" });
      document.body.style.pointerEvents = "none";
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    } catch (error) {
      toast.error(`${error.message}`, { theme: "colored" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 dark:bg-teal-900/10" />
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-teal-400/10 dark:bg-teal-800/10" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-teal-300/10 dark:bg-teal-700/10" />
        <svg
          className="absolute bottom-0 left-0 w-full opacity-20 text-gray-200 dark:text-gray-800"
          height="100"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C150,20 350,0 500,20 C650,40 750,80 900,80 C1050,80 1250,40 1440,20 L1440,100 L0,100 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="w-full max-w-md p-8 rounded-lg shadow-lg relative z-10 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-yellow-300 dark:hover:bg-gray-600"
            aria-label="Cambiar tema"
          >
            {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="Correo"
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors bg-white border-gray-300 focus:border-teal-500 focus:ring-teal-500/50 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-teal-500 dark:focus:ring-teal-500/50 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                required
                onChange={handleChange}
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors bg-white border-gray-300 focus:border-teal-500 focus:ring-teal-500/50 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-teal-500 dark:focus:ring-teal-500/50 dark:text-white dark:placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                aria-label="Mostrar contraseña"
              >
                {isPasswordVisible ? (
                  <Eye size={20}></Eye>
                ) : (
                  <EyeClosed size={20}></EyeClosed>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border focus:ring-2 focus:ring-offset-2 bg-white border-gray-300 focus:ring-teal-500 text-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-teal-500 dark:text-teal-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Recordarme
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-teal-600 hover:text-teal-500"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Entrar
          </button>
          <ToastContainer />
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm mb-4 text-gray-600 dark:text-gray-400">
            O iniciar sesión con
          </p>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 rounded-lg border font-medium transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continuar con Google
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
