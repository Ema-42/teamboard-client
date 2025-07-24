"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, Eye, EyeClosed } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
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
  //funcion para manejar el submit del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
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
        throw new Error(errorData.message || "Error al registrar");
      }
      const { user, token } = await response.json();
      login(user, token);

      toast.success(`Registro de Usuario exitoso`, { theme: "colored" });
      document.body.style.pointerEvents = "none";
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      toast.error(`${error.message}`, { theme: "colored" });
    }
  };

  const sendGoogleRegisterRequest = async (credential) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/google/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwt: credential }), // le mandamos el token como objeto
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar con Google");
      }

      const { user, token } = data;
      login(user, token);

      document.body.style.pointerEvents = "none";
      toast.success(`Registro de Usuario exitoso`, { theme: "colored" });
      setTimeout(() => {
        navigate("/dashboard");
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
          <h1 className="text-2xl font-bold">Crear Cuenta</h1>
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
              htmlFor="name"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors bg-white border-gray-300 focus:border-teal-500 focus:ring-teal-500/50 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-teal-500 dark:focus:ring-teal-500/50 dark:text-white dark:placeholder-gray-400"
            />
          </div>

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
              onChange={handleChange}
              placeholder="Correo"
              required
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
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Contraseña"
                onChange={handleChange}
                required
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
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              La contraseña debe tener al menos 8 caracteres
            </p>
          </div>
 

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Registrarse
          </button>
          <ToastContainer />
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm mb-4 text-gray-600 dark:text-gray-400">
            Otra opción
          </p>
          <div className="grid grid-cols-1 gap-3">
            <GoogleLogin
              text="signup_with"
              onSuccess={(CredentialsResponse) => {
                sendGoogleRegisterRequest(CredentialsResponse.credential);
              }}
              onError={() => console.log("Register Failed")}
            ></GoogleLogin>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
