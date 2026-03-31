import * as SecureStore from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
// import { authService } from "../services/authService";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { authService } from "../services/auth-service";

type User = { id: string; name: string; email: string };

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // HYDRATION: Check for existing session on app boot
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedUser = await SecureStore.getItemAsync("user_data");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const logIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);

      if (response.data.user.role !== "vendor") {
        Toast.show({
          type: "error",
          text1: "Access Denied",
          text2: "This user is not a vendor",
        });
        return;
      }
      await SecureStore.setItemAsync("user_token", response.data.accessToken);
      await SecureStore.setItemAsync(
        "user_data",
        JSON.stringify(response.data.user),
      );

      setUser(response.data.user);
      router.replace("/(protected)/(tabs)/(orders)");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      console.log(error + "\n" + error.response);

      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    await SecureStore.deleteItemAsync("user_token");
    await SecureStore.deleteItemAsync("user_data");
    setUser(null);
    router.replace("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        logIn,
        logOut,
      }}
    >
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
