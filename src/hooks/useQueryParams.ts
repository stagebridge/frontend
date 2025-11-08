import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useQueryParams<T extends Record<string, any>>() {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const get = (key: string) => params.get(key) ?? undefined;

  const setMany = (next: Partial<T>, replace = false) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") p.delete(k);
      else p.set(k, String(v));
    });
    const qs = p.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    replace ? navigate(url, { replace: true }) : navigate(url);
  };

  return { params, get, setMany };
}
