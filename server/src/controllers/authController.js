import { createContext, useState } from "react";
// MUDANÇA: Importar a instância 'api' que criamos, não o 'axios' puro
import api from "../api/api"; 

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Registrando usuário
  async function registerUser(nome, email, senha) {
    try {
      // MUDANÇA: Usamos 'api.post' e a rota correta '/auth/register'
      await api.post("/auth/register", {
        nome,
        email,
        senha,
      });

      return true;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao registrar! Verifique se o servidor backend está rodando na porta 4000.");
      return false;
    }
  }

  // Login
  async function login(email, senha) {
    try {
      // MUDANÇA: Usamos 'api.post' e a rota correta '/auth/login'
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      setUser(response.data.user);
      return true;

    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Email ou senha incorretos!");
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ user, registerUser, login }}>
      {children}
    </AuthContext.Provider>
  );
}