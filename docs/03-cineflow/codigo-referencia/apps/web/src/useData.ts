import { useEffect, useState } from "react";
import { request } from "./api";
export function useData<T>(path: string) {
  const [state, setState] = useState<{
    path: string;
    data?: T;
    error?: string;
    loading: boolean;
  }>({ path, loading: true });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ path, loading: true });
    request<T>(path, { signal: controller.signal })
      .then((data) => setState({ path, data, loading: false }))
      .catch((e) => {
        if (!controller.signal.aborted)
          setState({
            path,
            error: e instanceof Error ? e.message : "Error de conexión",
            loading: false,
          });
      });
    return () => controller.abort();
  }, [path, retry]);
  return {
    ...(state.path === path ? state : { path, loading: true }),
    reload: () => setRetry((x) => x + 1),
  };
}
