import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase";
import { request } from "./api";
import type { Account, Profile } from "./types";
interface SessionValue {
  user: User | null;
  loading: boolean;
  account: Account | null;
  profile: Profile | null;
  error: string;
  refresh: () => Promise<void>;
  select: (id: string) => void;
  call: <T>(path: string, init?: RequestInit) => Promise<T>;
}
const Context = createContext<SessionValue | null>(null);
export function Session({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(!!auth),
    [account, setAccount] = useState<Account | null>(null),
    [active, setActive] = useState("main"),
    [error, setError] = useState("");
  const epoch = useRef(0);
  async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const u = auth?.currentUser;
    if (!u) throw new Error("Inicia sesión");
    return request<T>(path, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${await u.getIdToken()}`,
      },
    });
  }
  async function refresh() {
    const u = auth?.currentUser;
    if (!u) return;
    const current = epoch.current;
    const data = await call<Account>("/me");
    if (auth?.currentUser?.uid === u.uid && epoch.current === current)
      setAccount(data);
  }
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      const current = ++epoch.current;
      setUser(u);
      setAccount(null);
      setActive("main");
      setError("");
      setLoading(!!u);
      if (u) {
        u.getIdToken()
          .then((token) =>
            request<Account>("/me", {
              method: "PUT",
              body: "{}",
              headers: { Authorization: `Bearer ${token}` },
            }),
          )
          .then((data) => {
            if (current === epoch.current) setAccount(data);
          })
          .catch((e) => {
            if (current === epoch.current) setError(e.message);
          })
          .finally(() => {
            if (current === epoch.current) setLoading(false);
          });
      }
    });
  }, []);
  const profile =
    account?.profiles.find((p) => p.id === active) ??
    account?.profiles[0] ??
    null;
  return (
    <Context.Provider
      value={{
        user,
        loading,
        account,
        profile,
        error,
        call,
        refresh,
        select: setActive,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useSession() {
  const value = useContext(Context);
  if (!value) throw new Error("Falta Session");
  return value;
}
