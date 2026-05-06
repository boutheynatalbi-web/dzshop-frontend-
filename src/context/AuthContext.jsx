import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("novamart_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Simulated user database stored in localStorage
  const getUsers = () => {
    try {
      const stored = localStorage.getItem("novamart_users_db");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  };

  const saveUsers = (users) => {
    localStorage.setItem("novamart_users_db", JSON.stringify(users));
  };

  useEffect(() => {
    if (user) localStorage.setItem("novamart_user", JSON.stringify(user));
    else localStorage.removeItem("novamart_user");
  }, [user]);

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Email ou mot de passe incorrect." };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true };
  };

  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: "Cet email est déjà utilisé." };
    }
    const newUser = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
    saveUsers([...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);