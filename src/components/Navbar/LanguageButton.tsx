// src/components/Navbar/LanguageButton.tsx
import { useRef, useState } from "react";
import LanguageModal from "./LanguageModal";

export default function LanguageButton() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const openNow = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label="언어 설정"
        className="text-xl leading-none"
        // 🔽 마우스/키보드 인터랙션
        onMouseEnter={openNow}
        onFocus={openNow}
        onMouseLeave={scheduleClose}
        onBlur={scheduleClose}
        onClick={() => setOpen(v => !v)}
      >
        🌐
      </button>

      {open && (
        <LanguageModal
          anchorRef={anchorRef}
          onClose={() => setOpen(false)}
          // 🔽 팝오버 안에 마우스를 올리면 닫힘 예약 취소
          onPointerEnter={() => {
            if (closeTimerRef.current) {
              window.clearTimeout(closeTimerRef.current);
              closeTimerRef.current = null;
            }
          }}
          // 🔽 팝오버 밖으로 나가면 닫힘 예약
          onPointerLeave={scheduleClose}
        />
      )}
    </>
  );
}
