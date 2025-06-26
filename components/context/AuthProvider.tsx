import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  id: string;
  displayName: string;
  email?: string;
  profileImage?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (userData: User): void => {
    setUser(userData);
  };

  const signOut = (): void => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    signIn,
    signOut,
    isSignedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
