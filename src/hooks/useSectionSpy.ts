import { useEffect, useState } from "react";

export function useSectionSpy(ids: string[], rootMargin = "-40% 0px -60% 0px") {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id);
          });
        },
        { rootMargin }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids, rootMargin]);
  return active;
}
