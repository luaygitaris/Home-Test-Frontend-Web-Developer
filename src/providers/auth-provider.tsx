"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "user" | "admin"
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const dummyUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    role: "user" as const,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

 const login = async (username: string, password: string) => {
  setLoading(true);
  try {
    const res = await fetch("https://test-fe.mysellerpintar.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login gagal");
    }

    const data = await res.json();

    // Misal API mengembalikan { id, username, role, token, ... }
    const authData = {
      id: data.id,
      name: data.username, // kalau API tidak kirim "name", kita pakai username
      email: data.email || "",
      role: data.role.toLowerCase() as "user" | "admin",
      token: data.token,
    };

    setUser(authData);
    localStorage.setItem("user", JSON.stringify(authData));
    localStorage.setItem("token", data.token);

    toast.success(`Login berhasil sebagai ${authData.role}`);
    router.push(authData.role === "admin" ? "/articlesAdmin" : "/articles");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Login gagal");
    throw error;
  } finally {
    setLoading(false);
  }
};

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "user" | "admin"
  ) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (dummyUsers.some((user) => user.email === email)) {
        throw new Error("Email sudah terdaftar");
      }

      const token =
        Math.random().toString(36).substring(2) + Date.now().toString(36);

      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role,
        password,
      };

      dummyUsers.push(newUser);

      const { password: _, ...userData } = newUser;
      const authData = { ...userData, token };

      setUser(authData);
      localStorage.setItem("user", JSON.stringify(authData));
      localStorage.setItem("token", token);

      toast.success("Registrasi berhasil!");
      router.push(role === "admin" ? "/articlesAdmin" : "/articles");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registrasi gagal");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.removeItem("user");

      // Reset state user
      setUser(null);

      // Redirect ke halaman login
      router.push("/login");
      router.refresh(); // Pastikan halaman di-refresh

      toast.success("Logout berhasil");
    } catch (error) {
      toast.error("Logout gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
