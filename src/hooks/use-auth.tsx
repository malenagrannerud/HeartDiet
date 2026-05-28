import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: { id: string; email: string } | null;
  session: null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<{ id: string; email: string } | null>({
    id: "local-user",
    email: "dev@example.com",
  });
  const [loading] = useState(false);

  const signOut = async () => {};

  return (
    <AuthContext.Provider value={{ user, session: null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
