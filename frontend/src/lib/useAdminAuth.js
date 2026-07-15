import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_TOKEN_KEY } from "./api";

/**
 * Guards an admin route: redirects to /admin/login when no JWT is present in
 * localStorage. Returns a stable `ready` flag so components can gate their
 * initial data fetch until the token check has resolved.
 *
 * Usage:
 *   const { ready, token } = useAdminAuth();
 *   useEffect(() => { if (ready) fetchStuff(); }, [ready]);
 *
 * Behaviour:
 *  - No token → navigate("/admin/login") and `ready` stays false.
 *  - Token present → `ready` becomes true; `token` is the raw JWT string.
 */
export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!stored) {
      navigate("/admin/login");
      return;
    }
    setToken(stored);
    setReady(true);
  }, [navigate]);

  return { ready, token };
};
