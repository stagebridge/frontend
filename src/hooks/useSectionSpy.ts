// src/hooks/useSectionSpy.ts
import { useEffect, useRef, useState } from "react";

/**
 * 섹션 ids를 받아 현재 화면에서 "상단(헤더 아래)에 가장 가까운" 섹션 id를 반환
 * - 고정 헤더 높이(--header-h)를 자동 반영
 * - IntersectionObserver + 상단 거리 기준 보정
 */
export function useSectionSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const headerPx =
    Number(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--header-h")
        .replace("px", "")
    ) || 96;
  
  const BUFFER = 8;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleMap = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    // 헤더 아래로 살짝 여유를 두고(8px) 관찰: top은 마이너스, bottom은 넉넉히
    const rootMarginTop = -(headerPx + BUFFER);
    const rootMarginBottom = -Math.round(window.innerHeight * 0.4); // 아래쪽 여유
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visibleMap.current.set(e.target.id, e);
          else visibleMap.current.delete(e.target.id);
        });

        // 현재 보이는 섹션들 중 "헤더 아래에 가장 가까운" 것을 활성으로 선택
        let winner: { id: string; dist: number; ratio: number } | null = null;
        visibleMap.current.forEach((entry, id) => {
          const rect = entry.boundingClientRect;
          const dist = Math.abs(rect.top - (headerPx + BUFFER));
          const ratio = entry.intersectionRatio;
          if (
            !winner ||
            dist < winner.dist ||
            (dist === winner.dist && ratio > winner.ratio)
          ) {
            winner = { id, dist, ratio };
          }
        });

        if (winner && winner.id !== active) setActive(winner.id);
      },
      {
        root: null,
        // top/bottom만 보정, 좌우는 0
        rootMargin: `${rootMarginTop}px 0px ${rootMarginBottom}px 0px`,
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    observerRef.current = io;
    sections.forEach((s) => io.observe(s));

    // 초기에도 한 번 강제로 계산(새로고침 직후 등)
    const tick = () => {
      const evt = new Event("scroll");
      window.dispatchEvent(evt);
    };
    requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      observerRef.current = null;
      visibleMap.current.clear();
    };
  }, [ids.join(","), headerPx]); // ids/헤더 높이 바뀌면 재설정

  return active;
}
