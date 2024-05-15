/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactNode, createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

// types
import { AuthContextType } from "@/types/auth";

// context & provider
const AuthContext = createContext<AuthContextType | null>(null);
const baseURL = "https://service.yaku.ai";
// const baseURL = 'http://127.0.0.1:10800';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null);

  const location = useLocation();
  const [token, setToken] = useState<any>(null);
  const [signed, setSigned] = useState<any>(false);
  const [myPublic, setMyPublic] = useState<any>(null);
  const [yakuPass, setYakuPass] = useState<any>(false);
  const [user, setUser] = useState<any>({});
  const [isAttempting, setIsAttempting] = useState<any>(false);
  const [isOnline, setIsOnline] = useState(socket?.connected);
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [hasExtension, setHasExtension] = useState(false);

  const attempting = (value: boolean) => {
    setIsAttempting(value);
  };

  const signin = async (jwt: string, publicKey?: string) => {
    setToken(jwt);
    if (publicKey) {
      setMyPublic(publicKey);
    }
    localStorage.setItem("yaku-lemonade", jwt);
    if (!socket?.connected) {
      socket?.connect();
    }
  };

  const logout = () => {
    setToken(null);
    setMyPublic(null);
    setUser({});
    localStorage.removeItem("yaku-lemonade");
    localStorage.clear();
    if (socket?.connected) {
      socket?.disconnect();
    }
  };

  const pass = () => {
    setYakuPass(true);
  };

  const sign = () => {
    setSigned(true);
  };

  const setUserData = (data: any) => {
    setUser(data);
  };

  const handleJoin = () => {
    if (!socket?.connected) {
      socket?.connect();
    }
    if (user && user.wallet) {
      console.log("handleJoin", user.wallet);
      socket?.emit("join", { user: user.wallet });
      socket?.emit("browsing", {
        user: user.wallet,
        page: window.location.pathname,
      });
    }
  };

  const handlePageChange = (page: string) => {
    if (!socket?.connected) {
      socket?.connect();
    }
    if (user && user.wallet) {
      console.log("handlePageChange", user.wallet, page);
      socket?.emit("browsing", { user: user.wallet, page });
    }
  };

  socket?.on("connect", () => {
    // console.log("connect", socket.id);
  });
  socket?.on("disconnect", () => {
    setIsOnline(false);
  });
  socket?.on("join", (usr: any) => {
    setIsOnline(true);
    // console.log("join", usr);
  });
  socket?.on("browsing", (users: any) => {
    // console.log("browsing", users);
    setOnlineUsers(users);
  });
  socket?.on("disconnecting", (users: any) => {
    // console.log("disconnecting", users);
    setOnlineUsers(users);
  });
  useEffect(() => {
    handlePageChange(window.location.pathname);
  }, [location]);

  useEffect(() => {
    handleJoin();
  }, [user.wallet]);

  useEffect(() => {
    const newSocket = io(baseURL, {
      path: "/api/socket.io",
      transports: ["websocket"],
      autoConnect: false,
    });
    setSocket(newSocket);
    return socket?.disconnect();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        logout,
        token,
        signin,
        pass,
        yakuPass,
        myPublic,
        sign,
        signed,
        isAttempting,
        attempting,
        user,
        setUserData,
        isOnline,
        onlineUsers,
        hasExtension,
        setHasExtension,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
