// src/components/Navbar/LanguageModal.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

export default function LanguageModal({
  anchorRef,
  onClose,
  onPointerEnter,
  onPointerLeave,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });

  const setLang = (code: "ko" | "ja" | "en") => {
    localStorage.setItem("sb_lang", code);
    document.documentElement.lang = code;
    onClose();
    // i18n 사용 시: i18next.changeLanguage(code)
  };

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 위치 계산 + 충돌 보정
  const place = () => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const width = Math.max(220, Math.min(window.innerWidth * 0.24, 320));
    panel.style.width = `${width}px`;

    const rect = anchor.getBoundingClientRect();
    const margin = 8;
    const desiredTop = rect.bottom + margin;
    const desiredLeft = rect.right - width;

    const height = panel.offsetHeight || 240;
    let top = desiredTop;
    let left = desiredLeft;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (left + width > vw - margin) left = vw - width - margin;
    if (left < margin) left = margin;
    if (top + height > vh - margin) top = rect.top - height - margin;
    if (top < margin) top = margin;

    setStyle({ position: "fixed", top, left, zIndex: 1000, visibility: "visible" });
  };

  useLayoutEffect(() => {
    requestAnimationFrame(place);
    const onScrollOrResize = () => place();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={panelRef}
      style={style}
      role="menu"
      aria-label="언어 선택"
      // 🔽 버튼↔패널 사이 이동 시 열림 유지
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="rounded-2xl border bg-white p-3 shadow-xl
                 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <ul className="max-h-[min(60vh,420px)] overflow-auto text-sm">
        <li>
          <button
            onClick={() => setLang("ko")}
            className="w-full rounded-md px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
          >
            한국어
          </button>
        </li>
        <li>
          <button
            onClick={() => setLang("ja")}
            className="w-full rounded-md px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
          >
            日本語
          </button>
        </li>
        <li>
          <button
            onClick={() => setLang("en")}
            className="w-full rounded-md px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
          >
            English
          </button>
        </li>
      </ul>

      <div className="mt-2 flex justify-end">
        <button
          onClick={onClose}
          className="hidden [@media(pointer:coarse)]:inline-flex rounded-md border px-3 py-1.5 text-xs dark:border-neutral-700"
        >
          닫기
        </button>
      </div>
    </div>,
    document.body
  );
}