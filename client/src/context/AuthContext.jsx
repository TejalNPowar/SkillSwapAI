import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/api";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadUser = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {

            const response = await getProfile();

            setUser(response.data.user);

        } catch (error) {

            console.log("Session expired");

            localStorage.removeItem("token");

        } finally {

            setLoading(false);

        }

    };

    loadUser();

}, []);

  const login = async (data) => {

    // Save JWT
    localStorage.setItem("token", data.token);

    // Save User
    setUser(data.user);

    return data.user;
  };

  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        setUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}