import { useAuth } from "../context/AuthContext";

export function useSecureFetch() {
  const { logout } = useAuth();

  const secureFetch = async (url, options) => {
    const response = await fetch(url, options);
    if (response.status === 401) {
      logout();
      throw new Error("Sesión expirada");
    }
    return response;
  };

  return { secureFetch };
}
