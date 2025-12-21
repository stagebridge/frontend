// src/components/Navbar/LanguageModal.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

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
  const { i18n, t } = useTranslation();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  useLayoutEffect(() => setOpen(true), []);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const panel = panelRef.current;
      const anchor = anchorRef.current;
      if (!panel) return;

      const target = e.target as Node;
      const inPanel = panel.contains(target);
      const inAnchor = anchor ? anchor.contains(target) : false;

      if (!inPanel && !inAnchor) onClose();
    };

    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [anchorRef, onClose]);

  const setLang = async (code: "ko" | "ja" | "en") => {
    await i18n.changeLanguage(code); // ✅ 전역 변경
    onClose();
  };

  const rect = anchorRef.current?.getBoundingClientRect();
  const style: React.CSSProperties = rect
    ? { position: "fixed", top: rect.bottom + 8, left: rect.left, zIndex: 50 }
    : { position: "fixed", top: 64, left: 16, zIndex: 50 };

  if (!open) return null;

  return createPortal(
    <div
      ref={panelRef}
      style={style}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="w-[260px] rounded-xl border bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
      role="menu"
      aria-label="language-menu"
    >
      <ul className="flex flex-col gap-1">
        <li>
          <button
            type="button"
            onClick={() => setLang("ko")}
            className="w-full rounded-md px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
          >
            {t("language.ko")}
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setLang("ja")}
            className="w-full rounded-md px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
          >
            {t("language.ja")}
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setLang("en")}
            className="w-full rounded-md px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
          >
            {t("language.en")}
          </button>
        </li>
      </ul>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="hidden [@media(pointer:coarse)]:inline-flex rounded-md border px-3 py-1.5 text-xs dark:border-neutral-700"
        >
          {t("common.close")}
        </button>
      </div>
    </div>,
    document.body
  );
}
